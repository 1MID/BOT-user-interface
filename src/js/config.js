import IIS_SINICA_FLOOR_FOUR_MAP from '../img/map/iis_new_building_four_floor.png';
import NTUH_YUNLIN_WARD_FIVE_B_MAP from '../img/map/ntuh_yunlin_branch_ward_five_b.png';
import BOT_LOGO from '../img//logo/BOT_LOGO_RED.png';

const config = {
    
    defaultAreaId: 1,

    areaOptions: {
        1: "IIS_SINICA_FLOOR_FOUR",
        3: "NTUH_YUNLIN_WARD_FIVE_B",
    },

    areaModules: {
        IIS_SINICA_FLOOR_FOUR: {
            name: "IIS_SINICA_FLOOR_FOUR",
            url: IIS_SINICA_FLOOR_FOUR_MAP,
            bounds: [[0,0], [21130,35710]],
        },
        NTUH_YUNLIN_WARD_FIVE_B: {
            name: "NTUH_YUNLIN_WARD_FIVE_B",
            url: NTUH_YUNLIN_WARD_FIVE_B_MAP,
            bounds: [[-5000,-5000], [21067,31928]],
        }
    },
    
    surveillanceMap: {

        /* Surveillance map source*/
        // defaultArea: "IIS_SINICA_FLOOR_FOUR",
        // defaultMap: IIS_SINICA_FLOOR_FOUR_MAP,
        // IIS_SINICA_FLOOR_FOUR: IIS_SINICA_FLOOR_FOUR_MAP,
        // NTUH_YUNLIN_WARD_FIVE_B: NTUH_YUNLIN_WARD_FIVE_B_MAP,

        // mapModules: {
        //     IIS_SINICA_FLOOR_FOUR: {
        //         name: "IIS_SINICA_FLOOR_FOUR",
        //         areaMap: IIS_SINICA_FLOOR_FOUR_MAP,
        //         mapBound:[[0,0], [21130,35710]],
        //     },
        //     NTUH_YUNLIN_WARD_FIVE_B: {
        //         name: "NTUH_YUNLIN_WARD_FIVE_B",
        //         areaMap: NTUH_YUNLIN_WARD_FIVE_B_MAP,
        //         mapBound:[[0,0], [10000,10000]],
        //     }
        // },

        /* Map customization */
        mapOptions: {
            crs: L.CRS.Simple,
            // center: L.latLng(-2000, -4000),
            zoom: -5,
            minZoom: -5,
            maxZoom: 0,
            zoomDelta: 0.25,
            zoomSnap: 0,
            zoomControl: true,
            attributionControl: false,
            dragging: true,
            doubleClickZoom: false,
            scrollWheelZoom: false
        },

        iconOptions: {
            iconSize: 50,
            // stationaryIconUrl: black_pin,
            // movinfIconUrl: darkGrey_pin,
            // sosIconUrl: sos,
			// geofenceIconFence: geofence_fence,
            // geofenceIconPerimeter: geofence_perimeter,
            // searchedObjectIconUrl: white_pin,
            showNumber: false,
        },

        

        iconColor: {
            stationary: 'black',
            geofenceF: 'red',
            geofenceP: 'orange',
            searched: 'blue',
            unNormal: 'grey',
            sos: 'sos',
            number: 'white',
            female: 'female',
            male: 'male',
            female_1: 'female_2',
            male_1: 'male_1',

            // ['slateblue', 'tan', 'lightyellow', 'lavender', 'orange','lightblue', 'mistyrose', 'yellowgreen', 'darkseagreen', 'orchid']
            pinColorArray: ['orchid','mistyrose', 'tan', 'lightyellow', 'lavender','lightblue', 'yellowgreen']
        },

        /* For test. To start object tracking*/
        startInteval: true,

        /* Object tracking query inteval */
        intevalTime: 1000,

        /* Bound of surveillance map*/
        mapBound:[[0,0], [21130,35710]],

        // mapBound:[[0,0], [651,1584]],
        // mapBound:[[2000,-8500], [14067,18428]],

        
        /* Tracking object Rssi filter */
        locationAccuracyMapToDefault: {
            0: -100,
            1: -60,
            2: -50,
        },

        locationAccuracyMapToDB: {
            0: 'low_rssi',
            1: 'med_rssi',
            2: 'high_rssi',
        },

        /* Marker dispersity, can be any positive number */
        markerDispersity: 5,

        // objectTypeSet: new Set(['Bed', 'EKG Machine', 'Infusion pump', 'SONOSITE Ultrasound', 'Ultrasound', 'Bladder scanner', 'CPM'])
        objectType: ['三合一Monitor', 'EKG', 'IV Pump', '烤燈', '血壓血氧監視器', '電擊器', 'CPM']

        
    },

    

    objectStatus: {
        PERIMETER: 'perimeter',
        FENCE: 'fence',
        NORMAL: 'normal',
        BROKEN: 'broken',
        RESERVE: 'reserve',
        TRANSFERRED: 'transferred',   
    },

    objectManage: {

        /* The definition of the time period that the object is not scanned by lbeacon
         * The time period unit is seconds */
        notFoundObjectTimePeriod: 30,

        geofenceViolationTimePeriod: 300,

        sosTimePeriod: 300,

        objectManagementRSSIThreshold: 0
    },

    transferredLocation: {
        Yuanlin_Christian_Hospital: [
            "ward 1",
            "ward 2",
        ],
        NTU_Hospital_Yunlin_branch: [
            "NTU_Hospital_Yunlin_branch"
        ],
        NTU_Hospital_Taipei: [
            "NTU_Hospital_Taipei"
        ],
    },
    
    locale: {
        defaultLocale: 'tw',
    },

    defaultRSSIThreshold: 1,

    image: {
        logo: BOT_LOGO,
    },

    companyName: 'BeDITech',

    systemAdmin: {

        openGlobalStateMonitor: !true,

        refreshSearchResult: true,

    },

    healthReport: {
        startInteval: false,
        pollLbeaconTabelIntevalTime: 60000,
        pollGatewayTableIntevalTime: 60000,
    },

    userPreference: {
        searchHistoryNumber: 4,
        cookies: {
            userInfo: {
                NAME: name,
                SEARCH_HISTORY: 'search_history',
                MY_DEVICES: 'mydevice'
            }
        },
        searchResultForm: 'List'
    },

    frequentSearchOption: {
        MY_DEVICES: 'my devices',
        ALL_DEVICES: 'all devices'
    },

    searchResult:{
        showImage: false,
        style: 'list',
        displayMode: 'showAll',
    },

    monitorType: {
        // 0: 'normal',
        1: 'geofence',
        2: 'panic',
        4: 'movement',
    },

    shiftOption: [
        'day shift',
        'swing shift',
        'night shift',
    ],

    shiftRecordFolderPath: 'shift_record',
    searchResultFolderPath: 'search_result',

    shiftRecordFileNameTimeFormat: 'MM_DD_YYYY',
    shiftRecordPdfContentTimeFormat: 'MM/DD/YYYY',
    geoFenceViolationTimeFormat: 'h:mm MM/DD/YYYY',
    confirmFormTimeFormat: 'LLLL',
    shiftChangeRecordTimeFormat: 'LLL',

    roles: [
        'guest',
        'care_provider',
        'system_admin'
    ],

    defaultRole: 'care_provider', 

    mobileWindowWidth: 600,

    objectType: {
        0: "medicalDevice",
        1: "inpatient"
    },

    toastProps: {
        position: "top-left",
        autoClose: false,
        newestOnTop: false,
        closeOnClick: true,
        rtl: false,
        pauseOnVisibilityChange: true,
        draggable: true
    },


    pdfFormat: (userInfo, foundResult, notFoundResult, locale, time, option) => {
        const hasFoundResult = foundResult.length !== 0
        const hasNotFoundResult = notFoundResult.length !== 0
        const title = config.getPDFTitle(userInfo, locale, time, option)

        let foundTitle = hasFoundResult
            ?   `<h3 style='text-transform: capitalize; margin-bottom: 5px; font-weight: bold'>
                    ${locale.texts.DEVICES_IN}
                    ${userInfo.areas_id.map(id => {
                        return locale.texts[config.areaOptions[id]]
                    })}
                </h3>`
            :   '';
        let foundData = hasFoundResult 
            ?   foundResult.map((item, index) => {
                    return `
                        <div key=${index} style='text-transform: capitalize; margin: 10px;'>
                            ${index + 1}.${item.name}, 
                            ${locale.texts.LAST_FOUR_DIGITS_IN_ACN}: ${item.last_four_acn}, 
                            ${locale.texts.NEAR}${item.location_description}
                        </div>
                    `
                    
                }).join(' ')
            :   ''
        let notFoundTitle = hasNotFoundResult 
            ?   `<h3 className='mt-1' style='text-transform: capitalize; margin-bottom: 5px; font-weight: bold'>
                    ${locale.texts.DEVICES_NOT_IN}
                    ${userInfo.areas_id.map(id => {
                        return locale.texts[config.areaOptions[id]]
                    })}
                </h3>`
            :   '';
        let notFoundData = hasNotFoundResult 
            ?   notFoundResult.map((item, index) => {
                    return `
                        <div key=${index} style='text-transform: capitalize; margin: 10px;'>
                            ${index + 1}.${item.name}, 
                            ${locale.texts.LAST_FOUR_DIGITS_IN_ACN}: ${item.last_four_acn}, 
                            ${locale.texts.NEAR}${item.location_description}
                        </div>
                    `
                }).join(' ')
            :   '';
        let pdfFormat = title + foundTitle + foundData + notFoundTitle + notFoundData
        return pdfFormat
    },

    getPDFTitle: (userInfo, locale, time, option) => {
        let timestamp = `<div style='text-transform: capitalize;'>${locale.texts.DATE_TIME}: ${time}</div>`
        let header = ``;
        switch(option) {
            case 'shiftChange':
                const nextShiftIndex = (config.shiftOption.indexOf(userInfo.shift) + 1) % config.shiftOption.length
                const nextShift = locale.texts[config.shiftOption[nextShiftIndex].toUpperCase().replace(/ /g, '_')]
                const thisShift = locale.texts[userInfo.shift.toUpperCase().replace(/ /g, '_')]
                header += `<h1 style='text-transform: capitalize;'>
                        ${locale.texts.SHIFT_CHANGE_RECORD}-${locale.texts.CONFIRM_BY}
                    </h1>`
                let shift = `<div style='text-transform: capitalize;'>
                        ${locale.texts.SHIFT}: ${thisShift} ${locale.texts.SHIFT_TO} ${nextShift}
                    </div>`
                let checkby = `<div style='text-transform: capitalize;'>
                        ${locale.texts.DEVICE_LOCATION_STATUS_CHECKED_BY}: ${userInfo.name}, ${thisShift}
                    </div>`
                return header + timestamp + shift + checkby
            case 'searchResult':
                header += `<h1 style='text-transform: capitalize;'>
                        ${locale.texts.SEARCH_RESULT}
                    </h1>`
                return header + timestamp


        }

    },
    popupOptions: {
        minWidth: '500',
        maxHeight: '300',
        className : 'customPopup',
    },

    /** The html content of popup of markers */
    getPopupContent: (object, objectList, locale) => {

        /* The style sheet is right in the src/css/Surveillance.css*/
        const content = 
            `
                <div>
                    <h4 class='border-bottom pb-1 px-2'>${object[0].location_description}</h4>
                    ${objectList.map( item =>{
                        var element = ''
                        if (item.object_type == 0) {
                            element +=     
                                `
                                    <div class='row popupRow mb-2 ml-1 d-flex jusify-content-start'>
                                        <div class='popupType'>
                                            ${item.type} 
                                        </div>
                                        <div class='popupType'>
                                            , ${locale.texts.LAST_FOUR_DIGITS_IN_ACN}: ${item.access_control_number.slice(10, 14)}
                                        </div>
                                        <div class='popupType'>
                                            , ${locale.texts[item.status.toUpperCase()]}
                                        </div>
                                        <div class='popupType'>
                                            , ${locale.texts.BELONG_TO} ${locale.texts[config.areaOptions[item.area_id]]}
                                        </div>
                                    </div>
                                `
                        } else {
                            element +=     
                                `
                                    <div class='row popupRow mb-2 ml-1 d-flex jusify-content-start'>
                                        <div class='popupType'>
                                            ${item.name} 
                                        </div>
                                        <div class='popupType'>
                                            , ${locale.texts.PHYSICIAN_NAME}: ${item.physician_name}
                                        </div>
                                        <div class='popupType'>
                                            , ${locale.texts.BELONG_TO} ${locale.texts[config.areaOptions[item.area_id]]}
                                        </div>
                                    </div>
                                `
                        }

                            return element
                        }).join('')
                    }
                </div>
            `
        return content
    }
}

export default config

