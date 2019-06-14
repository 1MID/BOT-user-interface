require('dotenv').config();
const moment = require('moment-timezone');
const queryType = require ('./queryType');
const bcrypt = require('bcrypt');
const pg = require('pg');
const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
}
const pool = new pg.Pool(config)



const getTrackingData = (request, response) => {
    const modifiedRssi = request.body.rssi || undefined;
    // console.log(modifiedRssi)
    pool.query(queryType.query_getTrackingData(modifiedRssi), (error, results) => {        
        if (error) {
            console.log("Get trackingData fails : " + error)
        } else {
            console.log('Get tracking data!')
        }


        response.status(200).json(results)
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
    pool.query(queryType.query_getLbeaconTable, (error, results) => {        
        if (error) {
            console.log("Get data fails : " + error)
        }
        console.log('Get lbeaconTable data!')
    
        results.rows.map(item => {
            const localLastReportTimeStamp = moment(item.last_report_timestamp).tz(process.env.TZ);
            item.last_report_timestamp = localLastReportTimeStamp.format();
        })
        response.status(200).json(results)
    })
}

const getGatewayTable = (request, response) => {
    pool.query(queryType.query_getGatewayTable, (error, results) => {        
        if (error) {
            console.log("Get data fails : " + error)                
        }
        console.log('Get gatewayTable data!')

        results.rows.map(item => {
            const localLastReportTimeStamp = moment(item.last_report_timestamp).tz(process.env.TZ);
            item.last_report_timestamp = localLastReportTimeStamp.format();
        })
        response.status(200).json(results)
    })
}

const getGeofenceData = (request, response) => {
    pool.query(queryType.query_getGeofenceData, (error, results) => {
        if (error) {
            console.log("Get Geofence Data fails: " + error)
        } else {
            console.log("Get Geofence Data")
        }

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

const signin = (request, response) => {
    const { username, password } = request.body

    pool.query(queryType.query_signin(username), (error, results) => {
        const hash = results.rows[0].password;
        if (error) {
            console.log("Login Fails: " + error)
        } else {

            if (results.rowCount < 1) {
                response.json({
                    authentication: false,
                    message: "Username or password is incorrect"
                })
            } else {
                if (bcrypt.compareSync(password, hash)) {
                    response.json({
                        authentication: true,
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
    pool.query(queryType.query_signup(signupPackage), (error, results) => {

        if (error) {
            console.log("Login Fails!")
        } else {
            console.log('Sign up Success')
        }

        response.status(200).json(results)
    })

}
    
module.exports = {
    getTrackingData,
    getObjectTable,
    getLbeaconTable,
    getGatewayTable,
    getGeofenceData,
    editObject,
    signin,
    signup
}