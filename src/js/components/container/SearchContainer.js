import React from 'react';
import Searchbar from '../presentational/Searchbar';
import Nav from 'react-bootstrap/Nav';
import ListGroup from 'react-bootstrap/ListGroup';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import TabContainer from 'react-bootstrap/TabContainer'
import TabContent from 'react-bootstrap/TabContent'
import TabPane from 'react-bootstrap/TabPane'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import Alert from 'react-bootstrap/Alert';


import Table from 'react-bootstrap/Table';

import axios from 'axios';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import bladderScannerP from '../../../img/bladder_scanner_p.png'
import bladderScannerM from '../../../img/bladder_scanner_m.png'
import wheelChair from '../../../img/wheel_chair.jpg';
import alarmClock from '../../../img/alarm_clock.jpg';
import cardiacMonitor from '../../../img/cardiac_monitor.jpeg';
import sonosite from '../../../img/sonosite.jpg';
import doppler from '../../../img/doppler.jpg';
import blankerWarmer from '../../../img/blanket_warmer.jpg';




/** API url */
import dataAPI from '../../../js/dataAPI';
import SearchableObjectType from '../presentational/SeachableObjectType';


export default class SearchContainer extends React.Component {

    constructor(){
        super()
        this.state = {
            sectionIndexList:['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
            isShowSectionTitle: false,
            hasSearchResult: false,
            isShowSearchOption: false,
            searchKey:'',
            data: [
                {
                    type: 'Alarm',
                    name: 'Portable alarm',
                    ACN: '1234-2234-1011',
                    status: 'IN USE',
                    location: "Room 401",
                    img: alarmClock,
                    
                },
                {
                    type: 'Artificial pacemaker',
                    name: "Artificial pacemaker",
                    ACN: '8511-3213-4233',
                    status: 'IDLE',
                    location: "Room 402",
                    img: doppler,

                },
                {
                    type: 'Alarm',
                    name: "Alarm",
                    ACN: '1234-2234-1411',
                    status: 'IN USE',
                    location: "Room 402",
                    img: alarmClock,
                    
                },
                {
                    type: 'Bladder Scanner',
                    name: 'Mobile Bladder Scanner',
                    ACN: '1111-1111-0001',
                    status: 'IDLE',
                    location: "Room 405",
                    img: bladderScannerM,
                },
                {
                    type: 'Bladder Scanner',
                    name: 'Mobile Bladder Scanner',
                    ACN: '1111-1111-0002',
                    status: 'IDLE',
                    location: "Room 402",
                    img: bladderScannerM,
                },
                {
                    type: 'Bladder Scanner',
                    name: "Portable Bladder Scanner",
                    ACN: '1111-1111-0003',
                    status: 'IN USE',
                    location: "Room 411",
                    img: bladderScannerP,
                },
                {
                    type: 'Bladder Scanner',
                    name: "Portable Bladder Scanner",
                    ACN: '1111-1111-0004',
                    status: 'IN USE',
                    location: "Room 411",
                    img: bladderScannerP,
                },
                {
                    type: 'Bladder Scanner',
                    name: "Portable Bladder Scanner",
                    ACN: '1111-1111-0005',
                    status: 'IN USE',
                    location: "Room 412",
                    img: bladderScannerP,
                },
                {
                    type: 'Bladder Scanner',
                    name: "Portable Bladder Scanner",
                    ACN: '1111-1111-0006',
                    status: 'IN USE',
                    location: "Room 413",
                    img: bladderScannerP,
                },
                {
                    type: 'Bladder Scanner',
                    name: "Portable Bladder Scanner",
                    ACN: '1111-1111-0007',
                    status: 'IN USE',
                    location: "Room 418",
                    img: bladderScannerP,
                },

                {
                    type: 'Blanket warmer',
                    name: "Blanket warmer",
                    ACN: '1234-2234-5521',
                    status: 'IDLE',
                    location: "Room 401",
                    img: blankerWarmer,
                },
                {
                    type: 'Cardiac Monitor',
                    name: "Cardiac Monitor",
                    ACN: '1234-2234-9948',
                    status: 'IDLE',
                    location: "Room 411",
                    img: cardiacMonitor,
                },
                {
                    type: 'Cranial drill',
                    name: "Cranial drill",
                    ACN: '1234-2234-9948',
                    status: 'IDLE',
                    location: "Room 411",
                    img: cardiacMonitor,
                },
                {
                    type: 'Disposable gloves',
                    name: "Disposable gloves",
                    ACN: '1234-2234-9948',
                    status: 'IDLE',
                    location: "Room 411",
                    img: cardiacMonitor,
                },
                {
                    type: 'Doppler',
                    name: "Doppler",
                    ACN: '1111-2234-2212',
                    status: 'IDLE',
                    location: "Room 402",
                    img: doppler,

                },
                {
                    type: 'Enema bulb',
                    name: "Enema bulb",
                    ACN: '1111-2234-2212',
                    status: 'IDLE',
                    location: "Room 402",
                    img: doppler,

                },
                {
                    type: 'Forceps',
                    name: "Bulldogs forceps",
                    ACN: '1111-2234-2212',
                    status: 'IDLE',
                    location: "Room 402",
                    img: doppler,

                },
                {
                    type: 'Gauze sponge',
                    name: "Gauze sponge",
                    ACN: '1111-2234-2212',
                    status: 'IDLE',
                    location: "Room 402",
                    img: doppler,

                },
                {
                    type: 'Head mirror',
                    name: "Head mirror",
                    ACN: '1111-2234-2212',
                    status: 'IDLE',
                    location: "Room 402",
                    img: doppler,

                },
                {
                    type: 'Infusion pump',
                    name: "Infusion pump",
                    ACN: '0909-2342-3123',
                    status: 'IDLE',
                    location: "Room 402",
                    img: doppler,

                },
                {
                    type: 'Kidney dish',
                    name: "Kidney dish",
                    ACN: '0909-2342-3123',
                    status: 'IDLE',
                    location: "Room 402",
                    img: doppler,

                },
                {
                    type: 'Medical halogen penlight',
                    name: "Medical halogen penlight",
                    ACN: '0909-2342-3123',
                    status: 'IDLE',
                    location: "Room 402",
                    img: doppler,

                },
                {
                    type: 'Nasogastric tube',
                    name: "Nasogastric tube",
                    ACN: '0909-2342-3123',
                    status: 'IDLE',
                    location: "Room 402",
                    img: doppler,

                },
                {
                    type: 'Nebulizer',
                    name: "Nebulizer",
                    ACN: '0909-2342-3123',
                    status: 'IDLE',
                    location: "Room 402",
                    img: doppler,

                },
                {
                    type: 'Osteotome',
                    name: "Osteotome",
                    ACN: '0909-2342-3123',
                    status: 'IDLE',
                    location: "Room 402",
                    img: doppler,

                },
                {
                    type: 'Proctoscopy',
                    name: "Proctoscopy",
                    ACN: '0909-2342-3123',
                    status: 'IDLE',
                    location: "Room 402",
                    img: doppler,

                },
                {
                    type: 'Reflex hammer',
                    name: "Reflex hammer",
                    ACN: '0909-2342-3123',
                    status: 'IDLE',
                    location: "Room 402",
                    img: doppler,

                },
                {
                    type: 'Stethoscope',
                    name: "stethoscope",
                    ACN: '0909-2342-3123',
                    status: 'IDLE',
                    location: "Room 402",
                    img: doppler,

                },
                {
                    type: 'scalpels',
                    name: "scalpels",
                    ACN: '0909-2342-3123',
                    status: 'IDLE',
                    location: "Room 402",
                    img: doppler,

                },
                {
                    type: 'Scissors',
                    name: "Mayo scissors",
                    ACN: '0909-2342-3123',
                    status: 'IDLE',
                    location: "Room 402",
                    img: doppler,

                },
                {
                    type: 'Scissors',
                    name: "Bandage Scissors",
                    ACN: '0909-2342-3123',
                    status: 'IDLE',
                    location: "Room 402",
                    img: doppler,

                },
                {
                    type: 'Scissors',
                    name: "Metzenbaum scissors",
                    ACN: '0909-2342-3123',
                    status: 'IDLE',
                    location: "Room 402",
                    img: doppler,

                },
                
                {
                    type: 'Sonosite ultrasound',
                    name: "Sonosite ultrasound",
                    ACN: '1111-2234-0093',
                    status: 'IDLE',
                    location: "Room 411",
                    img: sonosite,
                },
                {
                    type: 'Tongue depressor',
                    name: "Tongue depressor",
                    ACN: '8491-3423-1546',
                    status: 'IDLE',
                    location: "Room 402",
                    img: doppler,

                },
                {
                    type: 'Tenaculum',
                    name: "Tenaculum",
                    ACN: '8491-3423-1546',
                    status: 'IDLE',
                    location: "Room 402",
                    img: doppler,

                },
                {
                    type: 'ventilator',
                    name: "ventilator",
                    ACN: '8491-3423-1546',
                    status: 'IDLE',
                    location: "Room 402",
                    img: doppler,

                },
                {
                    type: 'Wheel chair',
                    name: "Wheel chair",
                    ACN: '1111-2111-2222',
                    status: 'IN USED',
                    location: "Room 402",
                    img: wheelChair,
                },
                {
                    type: 'Wartenbergwheel',
                    name: "Wartenbergwheel",
                    ACN: '1111-2111-2222',
                    status: 'IN USED',
                    location: "Room 402",
                    img: wheelChair,
                },
                {
                    type: 'Yankauer Suction Tip',
                    name: 'Yankauer Suction Tip',
                    ACN: '8491-3423-1546',
                    status: 'IDLE',
                    location: "Room 402",
                    img: doppler,

                },

                

            ],
            sectionTitleList: [],
            sectionIndex:'',
            searchResult: [],
            clientHeight: '',
        }
    
        this.handleSectionTitleClick = this.handleSectionTitleClick.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.getSearchableObjectData = this.getSearchableObjectData.bind(this);
        
    }

    

    componentDidMount() {
        this.getSearchableObjectData();
        const targetElement = document.body;
        this.setState({
            clientHeight: document.body.clientHeight,
        })
        // disableBodyScroll(targetElement);
    }

    shouldComponentUpdate(){
        return true
    }
    componentWillUnmount() {
        clearAllBodyScrollLocks();
    }

    getSearchableObjectData() {
        // axios.get(dataAPI.objectTable).then(res => {
        //     console.log(res.data.rows)

        //     let sectionTitleList = [];
        //     res.data.rows.map( item => {
        //         console.log(item.name)
        //         return <ListGroup.Item>{item.name}</ListGroup.Item>
        //     })
        //     this.setState({
        //         sectionTitleList:res.data.rows
        //     })
        // }).catch(function (error) {
        //     console.log(error);
        // })
        const titleElementStyle = {
            background: 'rgba(227, 222, 222, 0.619)',
            fontWeight: 'bold',
            fontSize: this.clientHeight,
            padding: 5,
        }

        const itemElementStyle = {
            fontSize: 25,
            padding: 5
        }

        let objectTypeSet = new Set();
        this.state.data.map(item => {
            objectTypeSet.add(item.type);
        })
        
        let sectionTitleList = [];
        let groupLetter = '';

        Array.from(objectTypeSet).map( item => {
            // let currentLetter = item.toUpperCase().slice(0,1);
            let currentLetter = item.toUpperCase().charAt(0);
            if(!(groupLetter === currentLetter)) {
                groupLetter = currentLetter;
                let titleElement = <a id={groupLetter} className='titleElementStyle'><ListGroup.Item style={titleElementStyle}>{groupLetter}</ListGroup.Item></a>;
                sectionTitleList.push(titleElement)
            }
            let itemElement = <a onClick={this.handleSectionTitleClick}><ListGroup.Item action style={itemElementStyle}>{item}</ListGroup.Item></a>;
            sectionTitleList.push(itemElement);
        })
        this.setState({
            sectionTitleList: sectionTitleList,
        })
    }



    handleMouseOver(e) {
        location.href = '#' + e.target.innerText;
        this.setState({
            isShowSectionTitle: true,
            sectionIndex: e.target.innerText,
        })
    }

    handleSectionTitleClick(e){
        let searchResult = [];
        this.state.data.map(item => {
            if (item.type === e.target.innerText) {
                searchResult.push(item);
            }
        })
        this.setState({
            hasSearchResult: true,
            searchKey:e.target.innerText,
            searchResult: searchResult,
        })
    }

    handleTouchStart(e) { 
        if (e.target.classList.contains("sectionIndexItem")) {
            location.href = '#' + sectionIndex;
        }
        this.setState({
            isShowSectionTitle: true,
            sectionIndex: e.target.innerText,
        })
    }

    handleTouchMove(e) { 
        
        const pageX = e.changedTouches[0].pageX;
        const pageY = e.changedTouches[0].pageY;
        const element = document.elementFromPoint(pageX, pageY);
        if (element.classList.contains("sectionIndexItem")) {
            location.href = '#' + element.innerText;
            this.setState({
                isShowSectionTitle: true,
                sectionIndex: element.innerText,
            })
        }
    }


    render() {

        /** Customized CSS of searchResult */
        const searchResultStyle = {
            display: this.state.hasSearchResult ? null : 'none',
        }

        const searchResultContentStyle = {
            // border: '1px solid rgb(227, 222, 222)',
            // paddingLeft: 30,
            // paddingRight: 30,
            // padding: 0,
            // marginBottom: 40,
            minHeight: 300,
        }

        const SearchContainerStyle = {
            // position: 'fixed',
            // width: 'auto',   
        }

        const searchOptionStyle = {
            display: this.state.hasSearchResult ? 'none' : null,
        }
        
        
        return (
            <div style={SearchContainerStyle} className="ml-3" style={{height:'100%'}} onTouchMove={this.handleTouchMove}>
                <div id='searchBar' className='d-flex w-100 justify-content-center align-items-center'>
                    <Searchbar placeholder={this.state.searchKey}/>
                </div>

                <div id='searchResult' style={searchResultStyle}>
                    <Alert variant={"secondary"} className='text-left py-2'>
                        <h6 className='d-inline font-weight-bold'>SEARCH RESULT</h6> 
                            <h6 className="d-inline pl-3">{this.state.searchResult.length}</h6>
                                <h6 className="d-inline pl-3">{this.state.searchKey}</h6>
                                    <h6 className="d-inline pl-2">on</h6>
                                        <h6 className="d-inline pl-2">F4</h6>
                    </Alert>
                    <Tab.Container id="left-tabs-example" defaultActiveKey="#0">
                        <Row className=''style={{height:'100%'}} >
                            <Col sm={5} className='border px-0 overflow-auto'>
                                <ListGroup variant="flush">
                                    {this.state.searchResult.map((item,index) => {
                                        let element = 
                                            <ListGroup.Item href={'#' + index} className='searchResultList' >
                                                {/* <Row>
                                                    <Col className="font-weight-bold" sm={4}>{item.name}</Col>
                                                    <Col sm={4}>{item.ACN}</Col>
                                                    <Col sm={4}>{item.location}</Col>
                                                </Row> */}
                                                <div className="d-flex flex-column text-left">
                                                    <div className="font-weight-bold py-1">{item.name}</div>
                                                    <small>last 4 ACN: {item.ACN.slice(10,14)}</small>
                                                    <small>location: {item.location}</small>
                                                </div>
                                            </ListGroup.Item>
                                        return element
                                    })}
                                </ListGroup>
                            </Col>
                            <Col sm={7} className=' border px-0' >
                                <Tab.Content >
                                    {this.state.searchResult.map((item,index) => {
                                        let element = 
                                            <Tab.Pane eventKey={'#' + index} className=''>
                                                <img src={item.img} width='200' className='py-4' />
                                                <Table>
                                                    <tbody className="text-uppercase">
                                                        <tr className="table-tr" >
                                                            <th className="text-right font-weight-bold">Name</th>
                                                            <td className="text-left ">{item.name}</td>
                                                        </tr>
                                                        <tr className="table-tr">
                                                            <th className="text-right font-weight-bold">Object Type</th>
                                                            <td className="text-left">{item.type}</td>
                                                        </tr>
                                                        <tr className="table-tr">
                                                            <th className="text-right table_th">Latest known location</th>
                                                            <td className="text-left">{item.location}</td>
                                                        </tr>
                                                        <tr className="table-tr">
                                                            <th className="text-right table_th">Status</th>
                                                            <td className="text-left">{item.status}</td>
                                                        </tr>
                                                        <tr className="table-tr">
                                                            <th className="text-right table_th">Access control number</th>
                                                            <td className="text-left">{item.ACN}</td>
                                                        </tr>
                                                        <tr className="table-tr">
                                                            <th className="text-right table_th">Manufacturer ID</th>
                                                            <td className="text-left">{Math.floor(Math.random() * 1000)}</td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </Tab.Pane>
                                        return element
                                    })}
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
                </div>

                <div id='searchOption' style={searchOptionStyle} className='pt-2'>
                                    
                    <div className='row'>
                        <div id='frequentSearch' className='col-6'>
                            <h6 className="font-weight-bold">FREQUENT SEARCHES</h6>
                            <ListGroup variant="flush">
                                <ListGroup.Item onClick={this.handleSectionTitleClick}>Bladder Scanner</ListGroup.Item>
                                <ListGroup.Item onClick={this.handleSectionTitleClick}>Alarm</ListGroup.Item>
                            </ListGroup>
                        </div>
                        <SearchableObjectType sectionTitleList={this.state.sectionTitleList} 
                            sectionIndexList={this.state.sectionIndexList} sectionIndex={this.state.sectionIndex} 
                                handleMouseOver={this.handleMouseOver} handleTouchStart={this.handleTouchStart} 
                                    handleTouchMove={this.handleTouchMove} isShowSectionTitle={this.state.isShowSectionTitle}
                                        clientHeight={this.state.clientHeight}/>
                    </div>
                </div>
            </div>
        );
    }
}