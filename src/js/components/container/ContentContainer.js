/** React Plugin */
import React from 'react';

/** Import Container Component */
import ObjectManagementContainer from './ObjectManagementContainer';

/** Import Presentational Component */
import RecentSearches from '../presentational/RecentSearches';
import SeachableObject from '../presentational/SearchableObject';
import Surveillance from '../presentational/Surveillance';
import AxiosExample from '../../axiosExample';
import TabelContainer from './TableContainer';
import ReactTableContainer from './ReactTableContainer';
import dataAPI from '../../../js/dataAPI'
import axios from 'axios';
import moment from 'moment-timezone';

export default class ContentContainer extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            lbeaconData: [],
            lbeaconColumn: [],
            gatewayData: [],
            gatewayColunm: [],
            trackingData: [],
            trackingColunm: [],
        }
        this.getGatewayData = this.getGatewayData.bind(this)
        this.getLbeaconData = this.getLbeaconData.bind(this)
        this.getTrackingData = this.getTrackingData.bind(this)
    }

    componentDidMount(){
        this.getGatewayData();
        this.getLbeaconData();
        this.getTrackingData()
        this.getGatewayDataInterval = setInterval(this.getGatewayData,60000)
        this.getLbeaconDataInterval = setInterval(this.getLbeaconData,60000)
        this.getTrackingDataInterval = setInterval(this.getTrackingData,3000)
    }

    componentWillUnmount() {
        clearInterval(this.getGatewayDataInterval);
        clearInterval(this.getLbeaconDataInterval);
        clearInterval(this.getTrackingDataInterval);
    }

    getGatewayData(){
        axios.get(dataAPI.gatewayTable).then(res => {
            let column = [];
            res.data.fields.map(item => {
                let field = {};
                field.Header = item.name,
                field.accessor = item.name,
                column.push(field);
            })
            res.data.rows.map(item => {
                const localLastReportTimestamp = moment(item.last_report_timestamp);
                item.last_report_timestamp = localLastReportTimestamp.format();
            })
            this.setState({
                gatewayData: res.data.rows,
                gatewayColunm: column,

            })
        })
        .catch(function (error) {
            console.log(error);
        })
    }

    getLbeaconData(){
        axios.get(dataAPI.lbeaconTable).then(res => {
            let column = [];
            res.data.fields.map(item => {
                let field = {};
                field.Header = item.name,
                field.accessor = item.name,
                column.push(field);
                
            })
            res.data.rows.map(item => {
                const localLastReportTimestamp = moment(item.last_report_timestamp);
                item.last_report_timestamp = localLastReportTimestamp.format();
            })
            this.setState({
                lbeaconData: res.data.rows,
                lbeaconColumn: column,

            })


        })
        .catch(function (error) {
            console.log(error);
        })
    }

    getTrackingData(){
        axios.get(dataAPI.trackingData).then(res => {
            let column = [];
            res.data.fields.map(item => {
                let field = {};
                field.Header = item.name,
                field.accessor = item.name,
                column.push(field);
            })
            res.data.rows.map(item => {
                const localLastReportTimestamp = moment(item.last_report_timestamp);
                item.last_report_timestamp = localLastReportTimestamp.format();
                item.avg = item.avg.slice(0,6)
            })
            this.setState({
                trackingData: res.data.rows,
                trackingColunm: column,

            })
        })
        .catch(function (error) {
            console.log(error);
        })
    }

    
    render(){
        return(

            /** "page-wrap" the default id named by react-burget-menu */
            <div id="page-wrap" className='px-lg-4 py-md-4'>
                <div className=''>
                    <div className='d-flex w-100 justify-content-around'><Surveillance /></div>
                    <div className='row'>
                        <div className='col-4'>
                            <h1>lbeacon table</h1>
                            <ReactTableContainer data={this.state.lbeaconData} column={this.state.lbeaconColumn}/>
                        </div>
                        <div className='col-3'> 
                            <h1>gateway table</h1>
                            <ReactTableContainer data={this.state.gatewayData} column={this.state.gatewayColunm}/>
                        </div>
                        <div className='col-5'> 
                            <h1>tracking table</h1>
                            <ReactTableContainer data={this.state.trackingData} column={this.state.trackingColunm}/>
                        </div>

                    </div>                 
                    {/* <div className='col'><TabelContainer /></div> */}
                    {/* <div className='col'><ReactTableContainer /></div> */}
{/* 
                    <div className='col'><SeachableObject /></div>
                    <div className='col'><RecentSearches /></div> */}
                </div>
            </div>
        )
    }
}