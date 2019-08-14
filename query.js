require('dotenv').config();
const moment = require('moment-timezone');
const queryType = require ('./queryType');
const bcrypt = require('bcrypt');
const pg = require('pg');
const pdf = require('html-pdf');

const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
}
const pool = new pg.Pool(config)




const getTrackingData = (request, response) => {
    const rssiThreshold = request.body.rssiThreshold || -65
    pool.query(queryType.query_getTrackingData())        
        .then(res => {
            console.log('Get tracking data!')
            res.rows.map(item => {

                /** Tag the object that is found 
                 *  if the object's last_seen_timestamp is in the specific time period
                 *  and its rssi is below the specific rssi threshold  */
                item.found = moment().diff(item.last_seen_timestamp, 'seconds') < 30 && item.rssi > rssiThreshold ? 1 : 0;
    
                /** Set the residence time of the object */
                item.residence_time =  item.found 
                    ? moment(item.last_seen_timestamp).from(moment(item.first_seen_timestamp)) 
                    : item.last_seen_timestamp 
                        ? moment(item.last_seen_timestamp).fromNow()
                        : 'N/A'
    
                /** Tag the object that is violate geofence */
                if (moment().diff(item.geofence_violation_timestamp, 'seconds') > 300
                    || moment(item.first_seen_timestamp).diff(moment(item.geofence_violation_timestamp)) > 0) {
                        
                    delete item.geofence_type
                }
    
                /** Tag the object that is on sos */
                if (moment().diff(item.panic_timestamp, 'second') < 300) {
                    item.panic = true
                }
                
                /** Omit the unused field of the object */
                delete item.first_seen_timestamp
                delete item.last_seen_timestamp
                delete item.geofence_violation_timestamp
                delete item.panic_timestamp
                delete item.rssi
    
                return item
            })
            response.status(200).json(res)

        }).catch(err => {
            console.log("Get trackingData fails : " + err)
        })
}

const getObjectTable = (request, response) => {
    pool.query(queryType.query_getObjectTable, (error, results) => {        
        if (error) {
            console.log("Get data fails : " + error)
        } else {
            console.log('Get objectTable data!')
        
            results.rows.map(item => {
                const localLastReportTimeStamp = moment(item.last_report_timestamp).tz(process.env.TZ);
                item.last_report_timestamp = localLastReportTimeStamp.format();
            })
            response.status(200).json(results)
        }
    })
}

const getLbeaconTable = (request, response) => {
    pool.query(queryType.query_getLbeaconTable)
        .then(res => {
            console.log('Get lbeaconTable data!')
            res.rows.map(item => {
                item.last_report_timestamp = moment(item.last_report_timestamp).tz(process.env.TZ).format('lll');
                item.health_status =  moment().diff(item.last_report_timestamp, 'days') < 1 ? 0 : 1 
            })
            response.status(200).json(res)

        })
        .catch(err => {
            console.log("Get data fails : " + err)
        })        


}

const getGatewayTable = (request, response) => {
    pool.query(queryType.query_getGatewayTable)
        .then(res => {
            console.log('Get gatewayTable data!')
            res.rows.map(item => {
                item.last_report_timestamp = moment(item.last_report_timestamp).tz(process.env.TZ).format('lll');
                item.registered_timestamp = moment(item.registered_timestamp).tz(process.env.TZ).format('lll');

                item.health_status =  item.health_status === 0 && moment().diff(item.last_report_timestamp, 'days') < 1 ? 0 : 1 
            })
            response.status(200).json(res)
        })    
        .catch(err => {
            console.log("Get data fails : " + err)                

        })
}

const getGeofenceData = (request, response) => {
    pool.query(queryType.query_getGeofenceData, (error, results) => {
        if (error) {
            console.log("Get Geofence Data fails: " + error)
        } else {
            console.log("Get Geofence Data")
        }

        results.rows.map(item => {
            const localLastReportTimeStamp = moment(item.receive_time).tz(process.env.TZ);
            item.receive_time = localLastReportTimeStamp.format();
        })
        response.status(200).json(results);
        
    })
}

const editObject = (request, response) => {
    const formOption = request.body.formOption
    pool.query(queryType.query_editObject(formOption), (error, results) => {
        if (error) {
            console.log("Edit Object Fails: " + error)
        } else {
            console.log("Edit Object Success");
        }
        
        response.status(200).json(results)

    })
}

const addObject = (request, response) => {
    const formOption = request.body.formOption
    pool.query(queryType.query_addObject(formOption))
        .then(res => {
            console.log("Add Object Success");
            response.status(200).json(res)
        })
        .catch(err => {
            console.log("Add Object Fails: " + err)
        })
    
}

const editObjectPackage = (request, response) => {
    const formOption = request.body.formOption
    pool.query(queryType.query_editObjectPackage(formOption), (error, results) => {
        if (error) {
            console.log(error)
        } else {
            console.log('success')
            response.status(200).json(results)
        } 
    })
}

const signin = (request, response) => {
    const username = request.body.username
    const pwd = request.body.password

    pool.query(queryType.query_signin(username), (error, results) => {
        if (error) {
            console.log("Login Fails: " + error)
        } else {
            if (results.rowCount < 1) {
                response.json({
                    authentication: false,
                    message: "Username or password is incorrect"
                })
            } else {

                const hash = results.rows[0].password
                if (bcrypt.compareSync(pwd, hash)) {
                    let userInfo = {}
                    userInfo.myDevice = results.rows[0].mydevice
                    userInfo.name= results.rows[0].name
                    userInfo.searchHistory = results.rows[0].search_history
                    response.json({
                        authentication: true,
                        userInfo
                    })
                } else {
                    response.json({
                        authentication: false,
                        message: "password is incorrect"
                    })
                }
            }
        }

    })

}

const signup = (request, response) => {
    const { username, password } = request.body;
    
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);
    const signupPackage = {
        username: username,
        password: hash,
    }
    pool.query(queryType.query_signup(signupPackage))
        .then(res => {
            console.log('Sign up Success')
            response.status(200).json(results)

        })
        .catch(err => {
            console.log("Signup Fails!")

        })
}

const getUserInfo = (request, response) => {
    const username = request.body.username;
    pool.query(queryType.query_getUserInfo(username))
        .then(res => {
            console.log('Get user info Fails!')
            response.status(200).json(res)
        })
        .catch(error => {
            console.log('Get user info Fails! error: ' + error)
        })
    
}

const addUserSearchHistory = (request, response) => {
    const { username, history } = request.body;
    pool.query(queryType.query_addUserSearchHistory(username, history), (error, results) => {
        if (error) {
            console.log('Add user search history fails: ' + error)
        } else {
            console.log('Add user searech history success')
        }
        response.status(200).json(results)
    })

}

const editLbeacon = (request, response) => {
    const low = request.body.formOption.low_rssi || null
    const med = request.body.formOption.med_rssi || null
    const high = request.body.formOption.high_rssi || null
    const uuid = request.body.formOption.uuid
    const description = request.body.formOption.description


    pool.query(queryType.query_editLbeacon(uuid, low, med, high, description), (error, results) => {
        if (error) {
            console.log('Edit lbeacon fails ' + error)
        } else {
            console.log('Edit lbeacon success')
        }
        response.status(200).json(results)
    })
}

const  QRCode = (request, response) => {
    // console.log(result)
    var {foundResult, notFoundResult, user} = request.body
    console.log(typeof user)
    var header = "<h1 style='text-align: center;'>" + "checked by " + user + "</h1>"
    console.log(header)
    var timestamp = "<h3 style='text-align: center;'>" + moment().format('LLLL') + "</h3>"

    function generateTable(title, types, lists, attributes){
        var html = "<div>"
        html += "<h2 style='text-align: center;'>" + title + "</h2>"
        html += "<table border='1' style='width:100%;word-break:break-word;'>";
        html += "<tr>";
        for(var i in types){
            html += "<th >" + types[i] + "</th>";
        }
        for (var i of lists){
            html += "<tr>";
            for(var j of attributes){
                html += "<td>"+i[j]+"</td>";
            }
        }
        html += "</table></div>"

        return html
    }

    // foundResult to Table
    
    var types = ["Name", "Type", "ACN", "Location"]
    var attributes = ["name", "type", "access_control_number", "location_description"]

    var title = "Found Results"
    var lists = foundResult
    var foundTable = generateTable(title, types, lists, attributes)


    var title = "Not Found Results"
    var lists = notFoundResult
    var notFoundTable = generateTable(title, types, lists, attributes)


    
    
    var options = {
        "format": "A4",
        "orientation": "landscape",
        "border": {
            "top": "0.3in",            // default is 0, units: mm, cm, in, px
            "right": "2in",
            "bottom": "0.3in",
            "left": "2in"
        },
        "timeout": "120000"
    };
    var html = header + timestamp + foundTable + notFoundTable
    var filePath = `save_file_path/${user}_${moment().format('LLLL')}.pdf`
    pdf.create(html, options).toFile(filePath, function(err, result) {
        if (err) return console.log(err);
        console.log("pdf create");
        response.status(200).json(filePath)
    });
}
    
module.exports = {
    getTrackingData,
    getObjectTable,
    getLbeaconTable,
    getGatewayTable,
    getGeofenceData,
    editObject,
    addObject,
    editObjectPackage,
    signin,
    signup,
    getUserInfo,
    addUserSearchHistory,
    editLbeacon,
    QRCode

    
}