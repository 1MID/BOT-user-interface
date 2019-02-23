/** Import React */
import React from 'react';

/** Import survelliance general map  */
import SMap from '../../../img/surveillanceMap.png'
import Logo from '../../../img/BOT.png';

/** Import Axios */
import axios from 'axios';


/** Import leaflet.js */
import L from 'leaflet';


const PAGENAME = 'Surveillance';

// API url
const API = 'http://localhost:3000/users';

import { dispatch } from "../../../globalState"
import { updateMenuOption } from '../../../action';

export default class surveillance extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            data:[],
            isUpdate: false,
            objCounter_1: 0,
            objCounter_2: 0,
            isPopup : false,
            lbeaconIfo :[],
        }
        this.map = null;

        this.handlemenu = this.handlemenu.bind(this)
        this.getObjData = this.getObjData.bind(this)
        this.randomNumber = this.randomNumber.bind(this)
        // this.initMap = this.initMap.bind(this)
    }

    handlemenu(){
        dispatch(updateMenuOption({
            isOpen: true,
        }))
    }

    initMap(){
        let mapOptions = {
            crs: L.CRS.Simple,
            minZoom: 0,
            maxZoom: 1,
            zoomControl: false,
            attributionControl: false,
            dragging: false,
            doubleClickZoom: false,
            scrollWheelZoom: false
        }
        // this.map = L.map('mapid',mapOptions).setView([37.92388861359015,115.22048950195312], 16);
        let pos_1 = [200,100];
        let pos_2 = [700,700];


        let map = L.map('mapid', mapOptions)
        let bounds = [[0,0], [900,900]]
        let image = L.imageOverlay(SMap, bounds).addTo(map)
        map.fitBounds(bounds)
        this.map = map

        var lbeacon_1 = L.circleMarker(pos_1,{
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 1,
            radius: 10
        }).addTo(map);

        lbeacon_1.on('click', this.handlemenu)

        var lbeacon_2 = L.circleMarker(pos_2,{
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 1,
            radius: 10
        }).addTo(map);

        

        // var sol7 = L.latLng([500,520 ]);
        // var sol8 = L.marker([500,500]).addTo(map);
        // var circle = L.circle([300, 300], {
        //     color: 'red',
        //     fillColor: '#f03',
        //     fillOpacity: 0,
        //     radius: 10
        // }).addTo(map);
        
        // var myIcon = L.icon({
        //     iconSize: [38, 95],
        //     iconUrl: Logo,
        // });

        // L.marker([500, 500], {icon: myIcon}).addTo(map);
        // L.marker(sol).addTo(map);
        // L.marker(sol2).addTo(map);

        // L.tileLayer(SMap, {
        //   subdomains: "1234",
        //   attribution: '高德地图'
        // }).addTo(this.map);
    }

    componentDidMount(){
        this.initMap();   
        this.getObjData(); 
        console.log('DIDMOUNT')
    }

    getObjData(){
        axios.get(API).then(res => {
            console.log('Get data successfully')
            console.log(res.data.rows)
            let object = res.data.rows;
            object.map(items =>{
                var objCounter_1 = this.state.objCounter_1;
                var objCounter_2 = this.state.objCounter_2;
                let popupContent = `
                    <b>${items.object_mac_address}</b>     <i class="fas fa-user-alt mr-2"></i>
                `
                let customOptions = {
                    'minWidth': '300',
                    'maxHeight': '300',
                    'className' : 'custom'
                }
                var marker;
                if (items.lbeacon_uuid === '00000015-0000-0a22-2222-00006e222222'){
                    var num = this.randomNumber();
                    var num2 = this.randomNumber()
                    
                    marker = L.marker([200 + num, 100 + num2]).addTo(this.map)
                    marker.bindPopup(popupContent, customOptions);

                    marker.on('mouseover', function () {
                        this.openPopup();
                    });
                    marker.on('mouseout', function () {
                        this.closePopup()
                    });
                    this.setState({
                        objCounter_2: this.state.objCounter_2 + 1,
                    })
                }else{
                    // marker = L.marker([200 + objCounter_2 * 5, 100 + objCounter_2 * 5]).addTo(this.map)
                    var num = this.randomNumber();
                    var num2 = this.randomNumber()

                    marker = L.marker([700 + num, 700 + num2]).addTo(this.map)

                    marker.bindPopup(popupContent, customOptions);
                    marker.on('mouseover', function () {
                        this.openPopup();
                    });
                    marker.on('mouseout', function () {
                        this.closePopup();
                    });
                    this.setState({
                        objCounter_1: this.state.objCounter_1 + 1,
                    })
                }
            })
            this.setState({
                data: res.data.rows,
            })
        }).catch(function (error) {
            console.log(error);
        })
    }

    randomNumber(){
        var num = Math.floor(Math.random() * 70) + 1; // this will get a number between 1 and 99;
        num *= Math.floor(Math.random() * 2) == 1 ? 1 : -1; // this will add minus sign in 50% of cases
        return num;
    }

    render(){
        return(
            <div>
                <h2>{PAGENAME}</h2>
                {console.log('render!')}
                {/* <table>
                    <tbody>
                        <tr>
                            <th>time</th>
                            <th>object_mac_address</th>
                            <th>lbeacon_uuid</th> 
                            <th>rssi</th>
                        </tr>
                        {this.state.data.map(items => {
                            return (
                                <tr>
                                    <td>{items.thirty_seconds}</td>
                                    <td>{items.object_mac_address}</td>
                                    <td>{items.lbeacon_uuid}</td>
                                    <td>{items.avg}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table> */}
                <div id='mapid'></div>
             </div>
        )
    }
}
