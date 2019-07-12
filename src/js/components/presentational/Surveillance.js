/** Import React */
import React from 'react';

/** Import leaflet.js */
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/** Import leaflet.markercluser library */
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import '../../../css/CustomMarkerCluster.css'
import '../../leaflet_awesome_number_markers';


/** Redux related Library  */
import { 
    isObjectListShown,
    selectObjectList,
} from '../../action/action';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';

import config from '../../config';

class Surveillance extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            data: [],
            lbeaconsPosition: null,
            objectInfo: {},
            hasErrorCircle: false,
            hasInvisibleCircle: false,       
        }
        this.map = null;
        this.markersLayer = L.layerGroup();
        this.errorCircle = L.layerGroup();
        this.popupContent = this.popupContent.bind(this);

        this.handlemenu = this.handlemenu.bind(this);
        this.handleTrackingData = this.handleTrackingData.bind(this);
        this.handleObjectMarkers = this.handleObjectMarkers.bind(this);
        this.createLbeaconMarkers = this.createLbeaconMarkers.bind(this);
        this.handleMarkerClick = this.handleMarkerClick.bind(this);

        this.resizeMarkers = this.resizeMarkers.bind(this);
        this.calculateScale = this.calculateScale.bind(this);

        this.StartSetInterval = config.surveillanceMap.startInteval; 
        this.isShownTrackingData = !true;
    }

    componentDidMount(){
        this.initMap();  
    }

    componentDidUpdate(prepProps){
        if(this.props.shouldTrackingDataUpdate) {

            /** Check whether there is the new tracking data retrieving from store */
            if (this.props.objectInfo !== prepProps.objectInfo) {
                this.handleTrackingData(); 
            }
            this.handleObjectMarkers();
            this.createLbeaconMarkers();
        }
    }

    shouldComponentUpdate(nextProps){
        return this.props.shouldTrackingDataUpdate
    }

    
    /** Set the search map configuration which establishs in config.js  */
    initMap(){
        let map = L.map('mapid', config.surveillanceMap.mapOptions);
        
        let bounds = config.surveillanceMap.mapBound;
        let image = L.imageOverlay(config.surveillanceMap.map, bounds).addTo(map);
        map.fitBounds(bounds);
        this.map = map;

        /** Set the map's events */
        this.map.on('zoomend', this.resizeMarkers)
    }

    /**
     * Resize the markers and errorCircles when the view is zoomend.
     */
    resizeMarkers(){
        this.calculateScale();
        this.markersLayer.eachLayer( marker => {
            let icon = marker.options.icon;
            icon.options.iconSize = [this.scalableIconSize, this.scalableIconSize]
            marker.setIcon(icon);
        })

        this.errorCircle.eachLayer( circle => {
            circle.setRadius(this.scalableErrorCircleRadius)
        })
    }

    /**
     * Calculate the current scale for creating markers and resizing.
     */
    calculateScale() {
        this.currentZoom = this.map.getZoom();
        this.minZoom = this.map.getMinZoom();
        this.zoomDiff = this.currentZoom - this.minZoom;
        this.resizeFactor = Math.pow(2, (this.zoomDiff));
        this.resizeConst = this.zoomDiff * 30;
        this.scalableErrorCircleRadius = 200 * this.resizeFactor;
        this.scalableIconSize = config.surveillanceMap.iconOptions.iconSize + this.resizeConst
    }

    /**
     * Create the lbeacon and invisibleCircle markers
     */
    createLbeaconMarkers(){
        /** 
         * Creat the marker of all lbeacons onto the map 
         */
        let lbeaconsPosition = this.state.lbeaconsPosition !== null ? Array.from(this.state.lbeaconsPosition) :[];
        lbeaconsPosition.map(items => {
            let lbLatLng = items.split(",")
            // let lbeacon = L.circleMarker(lbLatLng,{
            //     color: 'rgba(0, 0, 0, 0)',
            //     fillColor: 'yellow',
            //     fillOpacity: 0.5,
            //     radius: 15,
            // }).addTo(this.map);

        /** 
         * Creat the invisible Circle marker of all lbeacons onto the map 
         */
            let invisibleCircle = L.circleMarker(lbLatLng,{
                color: 'rgba(0, 0, 0, 0',
                fillColor: 'rgba(0, 76, 238, 0.995)',
                fillOpacity: 0,
                radius: 60,
            }).addTo(this.map);

            // invisibleCircle.on('mouseover', this.handlemenu)
            // invisibleCircle.on('mouseout', function() {this.closePopup();})
        })
        if (!this.state.hasInvisibleCircle){
            this.setState({
                hasInvisibleCircle: true,
            })
        }
    }
    /**
     * When user click the coverage of one lbeacon, it will retrieve the object data from this.state.pbjectInfo.
     * It will use redux's dispatch to transfer datas, including isObjectListShown and selectObjectList
     * @param e the object content of the mouse clicking. 
     */
    handlemenu(e){

        let popupOptions = {
            minWidth: '400',
            maxWidth: '600',
            maxHeight: '500',
            className : 'customPopup',
        }

        const { objectInfo } = this.state
        const lbeacon_coorinate = Object.values(e.target._latlng).toString();
        let objectList = [], key;
        for (key in objectInfo) {
            if (objectInfo[key].currentPosition.toString() == lbeacon_coorinate) {
                objectList.push(objectInfo[key])
            }
        }
        if (objectList.length !== 0) {
            const popupContent = this.popupContent(objectList)
            e.target.bindPopup(popupContent, popupOptions).openPopup();
        }

        this.props.isObjectListShownProp(true);
        this.props.selectObjectListProp(objectList);
    }

    /**
     * Retrieve tracking data from redux store, and do the processing.
     */
    handleTrackingData() {
        let objectRows = this.props.objectInfo === undefined ? [] : this.props.objectInfo
        let lbsPosition = new Set(),
            objectInfoHash = {}
        let counter = 0;
        objectRows.map(items =>{
            /**
             * Every lbeacons coordinate sended by response will store in lbsPosition
             * Update(3/14): use Set instead.
             */
            const lbeaconCoordinate = this.createLbeaconCoordinate(items.lbeacon_uuid);
            lbsPosition.add(lbeaconCoordinate.toString());
            
            let object = {
                lbeaconCoordinate: lbeaconCoordinate,
                location_description: items.location_description,
                rssi: items.avg,
            }
            /**
             * If the object has not scanned by one lbeacon yet, 
             *  then the object is going to be append in objectInfoHash
             * Else, the object is already in objectInfoHash, 
             *  we will check if the object is stationary or moving first,
             *  then check if the current RSSI is the largest.
             */
            if (!(items.object_mac_address in objectInfoHash)) {
                objectInfoHash[items.object_mac_address] = {};
                objectInfoHash[items.object_mac_address].type = items.type
                objectInfoHash[items.object_mac_address].lbeaconDetectedNum = 1
                objectInfoHash[items.object_mac_address].maxRSSI = items.avg
                objectInfoHash[items.object_mac_address].currentPosition = lbeaconCoordinate
                objectInfoHash[items.object_mac_address].location_description = items.location_description
                objectInfoHash[items.object_mac_address].access_control_number = items.access_control_number
                objectInfoHash[items.object_mac_address].coverLbeaconInfo = {}
                objectInfoHash[items.object_mac_address].name = items.name
                objectInfoHash[items.object_mac_address].mac_address = items.object_mac_address
                objectInfoHash[items.object_mac_address].panic_button = items.panic_button;
                objectInfoHash[items.object_mac_address].geofence_type = items.geofence_type;
                objectInfoHash[items.object_mac_address].coverLbeaconInfo[lbeaconCoordinate] = object;
                objectInfoHash[items.object_mac_address].status = items.status;
                objectInfoHash[items.object_mac_address].transferred_location = items.transferred_location;
                objectInfoHash[items.object_mac_address].moving_status = items.avg_stable !== null ? 'stationary' : 'stationary';

            } else {
                let maxRSSI = objectInfoHash[items.object_mac_address].maxRSSI;
                let moving_status = objectInfoHash[items.object_mac_address].moving_status;
                let geofence_type = objectInfoHash[items.object_mac_address].geofence_type;
                let panic_button = objectInfoHash[items.object_mac_address].panic_button;
                
                if(items.geofence_type === config.geofence.type.FENCE){
                    if(geofence_type === null || geofence_type === config.geofence.type.PERIMETER || 
                        (geofence_type === config.geofence.type.FENCE &&  parseFloat(items.avg) > parseFloat(maxRSSI))) {
                            
                        objectInfoHash[items.object_mac_address].maxRSSI = items.avg;
                        objectInfoHash[items.object_mac_address].currentPosition = lbeaconCoordinate;
                        objectInfoHash[items.object_mac_address].location_description = items.location_description
                        objectInfoHash[items.object_mac_address].geofence_type = items.geofence_type;
                    }
                }else if(items.geofence_type === config.geofence.type.PERIMETER){
                    if(geofence_type === null || 
                        (geofence_type === config.geofence.type.PERIMETER && parseFloat(items.avg) > parseFloat(maxRSSI))) {
                            
                        objectInfoHash[items.object_mac_address].maxRSSI = items.avg;
                        objectInfoHash[items.object_mac_address].currentPosition = lbeaconCoordinate;
                        objectInfoHash[items.object_mac_address].location_description = items.location_description
                        objectInfoHash[items.object_mac_address].geofence_type = items.geofence_type;
                    }
                }else{
                    if(geofence_type !== null){
                        
                    }else{
                        if(items.panic_button){
                            objectInfoHash[items.object_mac_address].panic_button = items.panic_button;
                        }
                        
                        if(parseFloat(items.avg) > parseFloat(maxRSSI)){
                                    
                            objectInfoHash[items.object_mac_address].maxRSSI = items.avg;
                            objectInfoHash[items.object_mac_address].currentPosition = lbeaconCoordinate;
                            objectInfoHash[items.object_mac_address].location_description = items.location_description

                        } 
                    }
                }
            /*
                if(items.panic_button){
                    objectInfoHash[items.object_mac_address].panic_button = 1;
                }
                
                if( parseFloat(items.avg) > parseFloat(maxRSSI)) {
                    objectInfoHash[items.object_mac_address].maxRSSI = items.avg;
                    objectInfoHash[items.object_mac_address].currentPosition = lbeaconCoordinate;
                    
                    objectInfoHash[items.object_mac_address].geofence_type = items.geofence_type;
                }
                
                if (items.avg_stable !== null) {
                */    /** 
                        * If the RSSI of one object scanned by the the other lbeacon is larger than the previous one, then
                        * current position = new lbeacon location
                        * max rssi = new lbeacon rssi
                        */
                        /*
                    if ((moving_status === 'stationary' && parseFloat(items.avg) > parseFloat(maxRSSI))|| moving_status === 'moving' ){
                        objectInfoHash[items.object_mac_address].maxRSSI = items.avg;
                        objectInfoHash[items.object_mac_address].currentPosition = lbeaconCoordinate;
                        objectInfoHash[items.object_mac_address].moving_status = 'stationary'
                    } 
                    */
                /*    
                } else {
                    */
/*
                    if(moving_status === 'moving' && parseFloat(items.avg) > parseFloat(maxRSSI)) {
                        objectInfoHash[items.object_mac_address].maxRSSI = items.avg;
                        objectInfoHash[items.object_mac_address].currentPosition = lbeaconCoordinate;
                    }
*/						
/*
                }
                */
/*
                objectInfoHash[items.object_mac_address].coverLbeaconInfo[lbeaconCoordinate] = object;
*/
            }

            objectInfoHash[items.object_mac_address].lbeaconDetectedNum = Object.keys(objectInfoHash[items.object_mac_address].coverLbeaconInfo).length;
            // markerClusters.addLayer(L.marker(lbeaconCoordinate));
        })
        // console.log(objectInfoHash['c1:0f:00:0f:60:58'])
        if (this.isShownTrackingData === true ) (console.log(objectInfoHash)); 
        // this.map.addLayer(markerClusters);
        // markerClusters.on('clusterclick', this.handlemenu)

        /** Return Tracking data (searchableObjectData) to Search Container */
        this.props.transferSearchableObjectData(objectInfoHash)

        this.setState({
            data: this.props.objectInfo,
            lbeaconsPosition: lbsPosition,
            objectInfo: objectInfoHash,
            hasErrorCircle: false,
        })
    }

    /**
     * When handleTrackingData() is executed, handleObjectMarkes() will be called. That is, 
     * once the component is updated, handleObjectMarkers() will be executed.
     * Clear the old markersLayer.
     * Add the markers into this.markersLayer.
     * Create the markers' popup, and add into this.markersLayer.
     * Create the popup's event.
     * Create the error circle of markers, and add into this.markersLayer.
     */
    handleObjectMarkers(){
        const { hasSearchKey, searchResult, searchType } = this.props;
        const objects = this.state.objectInfo;

        /** Process the search object data */
        var searchedObjectDataMap= new Map();
        if (hasSearchKey) {
            searchResult.map( item => {
                searchedObjectDataMap.set(item.mac_address, item)
            })
        }





        

        /** Clear the old markerslayers. */
        this.markersLayer.clearLayers();
        this.errorCircle .clearLayers();


        /** Mark the objects onto the map  */
        this.calculateScale();

        const errorCircleOptions = {
            color: 'rgb(0,0,0,0)',
            fillColor: 'orange',
            fillOpacity: 0.5,
            radius: this.scalableErrorCircleRadius,
        }

        const iconSize = [this.scalableIconSize, this.scalableIconSize];

        /** Icon options for pin */
        // const stationaryIconOptions = L.icon({
        //     iconSize: iconSize,
        //     iconUrl: config.surveillanceMap.iconOptions.stationaryIconUrl,
        // });

        // const movingIconOptions = L.icon({
        //     iconSize: iconSize,
        //     iconUrl: config.surveillanceMap.iconOptions.movinfIconUrl,
        // });

        // const sosIconOptions = L.icon({
        //     iconSize: iconSize,
        //     iconUrl: config.surveillanceMap.iconOptions.sosIconUrl,
        // });
		
		//  const geofenceFIconOptions = L.icon({
        //     iconSize: iconSize,
        //     iconUrl: config.surveillanceMap.iconOptions.geofenceIconfence,
        // });
		
		// const geofencePIconOptions = L.icon({
        //     iconSize: iconSize,
        //     iconUrl: config.surveillanceMap.iconOptions.geofenceIconperimeter,
        // });

        // const searchedObjectIconOptions = L.icon({
        //     iconSize: iconSize,
        //     iconUrl: config.surveillanceMap.iconOptions.searchedObjectIconUrl
        // });
        
        /** Icon options for AwesomeNumberMarkers 
         * The process: 
         * 1. Add the declaration of the desired icon option
         * 2. Add the CSS description in leafletMarker.css
        */
        const stationaryAweIconOptions = {
            iconSize: iconSize,
            markerColor: config.surveillanceMap.iconColor.stationary,
        }

        const geofencePAweIconOptions = {
            iconSize: iconSize,
            markerColor: config.surveillanceMap.iconColor.geofenceP,
            numberColor: config.surveillanceMap.iconColor.number,
        }

        const geofenceFAweIconOptions = {
            iconSize: iconSize,
            markerColor: config.surveillanceMap.iconColor.geofenceF,
            numberColor: config.surveillanceMap.iconColor.number,
        }

        const searchedObjectAweIconOptions = {
            iconSize: iconSize,
            markerColor: config.surveillanceMap.iconColor.searched,
            numberColor: config.surveillanceMap.iconColor.number,
        }

        const sosIconOptions = {
            iconSize: iconSize,
            markerColor: config.surveillanceMap.iconColor.sos,
        };

        const unNormalIconOptions = {
            iconSize: iconSize,
            markerColor: config.surveillanceMap.iconColor.unNormal,
        };

        let popupOptions = {
            minWidth: '400',
            maxHeight: '300',
            className : 'customPopup',
        }
        
        let counter = 0;
        // console.log('been processed and hasSearchKey = ' + this.props.hasSearchKey  )
        for (var key in objects){

            /** Tag the searched object with searched and pinColor*/

            if(searchedObjectDataMap.has(key)) {
                objects[key] = searchedObjectDataMap.get(key)
                objects[key].searched = true;
            } else {
                objects[key].searched = false;
            }



            let detectedNum = objects[key].lbeaconDetectedNum;
            let position = this.macAddressToCoordinate(key.toString(), objects[key].currentPosition);

            /** 
             * Set the Marker's popup 
             * popupContent (objectName, objectImg, objectImgWidth)
             * More Style sheet include in Surveillance.css
            */
            let popupContent = this.popupContent([objects[key]])
            /**
             * Create the marker, if the 'moving_status' of the object is 'stationary', 
             * then the color will be black, or grey.
             */
            let iconOption = {}
            if (objects[key].status === 'Broken' || objects[key].status === 'Transferred') {
                iconOption = unNormalIconOptions;
            } else if (objects[key].geofence_type === config.geofence.type.FENCE){
                iconOption = geofenceFAweIconOptions;
                if (objects[key].searched && config.surveillanceMap.iconOptions.showNumber) {
                    iconOption = {
                        ...iconOption,
                        number: ++counter
                    }
                }
			} else if (objects[key].geofence_type === config.geofence.type.PERIMETER){
                iconOption = geofencePAweIconOptions;
                if (objects[key].searched && config.surveillanceMap.iconOptions.showNumber) {
                    iconOption = {
                        ...iconOption,
                        number: ++counter
                    }
                }
			} else if (objects[key].panic_button === 1) {
                iconOption = sosIconOptions;
            } else if (objects[key].searched && this.props.colorPanel) {
                iconOption = {
                    iconSize: iconSize,
                    markerColor: objects[key].pinColor,
                }
            } else if (objects[key].searched) {
                config.surveillanceMap.iconOptions.showNumber 
                ? 
                    iconOption = {
                        ...searchedObjectAweIconOptions,
                        number: ++counter, 
                    } 
                : iconOption = searchedObjectAweIconOptions    
            } else if (objects[key].moving_status === 'stationary') {
                iconOption = stationaryAweIconOptions;
            } else {
                iconOption = movingIconOptions;
            }

            /** Insert the object's mac_address to be the data when clicking the object's marker */
            iconOption = {
                ...iconOption,
                macAddress: objects[key].mac_address,
                currentPosition: objects[key].currentPosition
            }

            const option = new L.AwesomeNumberMarkers (iconOption)
            let marker =  L.marker(position, {icon: option}).bindPopup(popupContent, popupOptions).addTo(this.markersLayer)
            
            /** 
             * Set the z-index offset of the searhed object so that
             * the searched object icon will be on top of all others 
             */
            if (objects[key].searched) {
                marker.setZIndexOffset(1000);
            }
            /** Set the marker's event. */

            marker.on('mouseover', function () { this.openPopup(); })
            marker.on('click', this.handleMarkerClick);
            // marker.on('mouseout', function () { this.closePopup(); })
            

            /** Set the error circles of the markers. */
            if (detectedNum > 1 && objects[key].moving_status === 'stationary') {
                let errorCircle = L.circleMarker(position ,errorCircleOptions).addTo(this.errorCircle);
            }
        }

        /** Add the new markerslayers to the map */
        this.markersLayer.addTo(this.map);
        this.errorCircle .addTo(this.map);

        if (!this.state.hasErrorCircle) {
            this.setState({
                hasErrorCircle: true,
            })
        }
    }

    handleMarkerClick(e) {
        const currentPosition =  e.target.options.icon.options.currentPosition
        let objectList = this.collectObjectsByLatLng(currentPosition)
        console.log(objectList)
        this.props.handleMarkerClick(objectList)
    }

    collectObjectsByLatLng(currentPositionArray) {
        let objectList = []
        Object.values(this.state.objectInfo).map(item => {
            item.currentPosition.toString() === currentPositionArray.toString() ? objectList.push(item) : null;
        })
        return objectList 
    }


    /**
     * Retrieve the lbeacon's location coordinate from lbeacon_uuid.
     * @param   lbeacon_uuid The uuid of lbeacon retrieved from DB.
     */
    createLbeaconCoordinate(lbeacon_uuid){
        /** Example of lbeacon_uuid: 00000018-0000-0000-7310-000000004610 */
        const zz = lbeacon_uuid.slice(6,8);
        const xx = parseInt(lbeacon_uuid.slice(14,18) + lbeacon_uuid.slice(19,23));
        const yy = parseInt(lbeacon_uuid.slice(-8));
        return [yy, xx];
    }

    /**
     * Retrieve the object's offset from object's mac_address.
     * @param   mac_address The mac_address of the object retrieved from DB. 
     * @param   lbeacon_coordinate The lbeacon's coordinate processed by createLbeaconCoordinate().
     */
    macAddressToCoordinate(mac_address, lbeacon_coordinate){
        /** Example of lbeacon_uuid: 01:1f:2d:13:5e:33 
         *                           0123456789       16
         */
 
        // const xx = mac_address.slice(15,16);
        // const yy = mac_address.slice(16,17);
        // const xSign = parseInt(mac_address.slice(9,10), 16) % 2 == 1 ? 1 : -1 ;
        // const ySign = parseInt(mac_address.slice(10,11), 16) % 2 == 1 ? 1 : -1 ;

        // const xxx = lbeacon_coordinate[1] + xSign * parseInt(xx, 16) * 12;
        // const yyy = lbeacon_coordinate[0] + ySign * parseInt(yy, 16) * 12;

        const xx = mac_address.slice(12,14);
        const yy = mac_address.slice(15,17);

        const multiplier = config.surveillanceMap.markerDispersity; // 1m = 100cm = 1000mm, multipler = 1000/16*16 = 3
		const origin_x = lbeacon_coordinate[1] - parseInt(80, 16) * multiplier ; 
		const origin_y = lbeacon_coordinate[0] - parseInt(80, 16) * multiplier ;
		const xxx = origin_x + parseInt(xx, 16) * multiplier;
		const yyy = origin_y + parseInt(yy, 16) * multiplier;
        return [yyy, xxx];
        
    }

    /**
     * The html content of popup of markers.
     * @param {*} object The fields in object will present if only the field is add into objectInfoHash in handleTrackingData method
     * @param {*} objectImg  The image of the object.
     * @param {*} imgWidth The width of the image.
     */
    popupContent (objectsMap){
        let currentPosition = objectsMap[0].currentPosition
        let objectList = this.collectObjectsByLatLng(currentPosition)

        /* The style sheet is right in the src/css/Surveillance.css*/
        const content = 
            `
                <div>
                    <h4 class='border-bottom pb-1 px-2'>${objectsMap[0].location_description}</h4>
                    ${objectList.map( item =>{
                        const element =     
                            `
                                <div class='row popupRow mb-2 ml-1'>
                                    <div class='col-6 popupType d-flex align-items-center'>${item.type}</div>
                                    <div class='col-6 popupItem d-flex align-items-center'>${item.access_control_number}</div>
                                </div>
                            `
                                return element
                        }).join('')
                    }
                </div>
            `
        return content
    }

    render(){

        const style = {
            // map: {
            //     height: '65vh'
            // }
        }
        return(
            <>      
                <div id='mapid' style={style.map}>
                </div>
            </>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        isObjectListShownProp: value => dispatch(isObjectListShown(value)),
        selectObjectListProp: array => dispatch(selectObjectList(array)),
    }
}

const mapStateToProps = (state) => {
    return {
        shouldTrackingDataUpdate: state.retrieveTrackingData.shouldTrackingDataUpdate,
        objectInfo: state.retrieveTrackingData.objectInfo.rows,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Surveillance)

