import React from 'react';


import { Alert, Tab, ListGroup, Col, Row, Nav } from 'react-bootstrap'
import LocaleContext from '../../context/LocaleContext';
import ChangeStatusForm from '../container/ChangeStatusForm';
import ConfirmForm from '../container/ConfirmForm';
import shallowCompare from 'react-addons-shallow-compare'
import { connect } from 'react-redux'
import { shouldUpdateTrackingData } from '../../action/action';
import axios from 'axios';
import dataSrc from '../../dataSrc';
import _ from 'lodash';
import { deepEqual } from 'assert';



class SearchResult extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            showEditObjectForm: false,
            showConfirmForm: false,
            selectedObjectData: [],
            formOption: [],
            thisComponentShouldUpdate: true,
            foundResult: [],
            notFoundResult: [],
            showNotResult: false,

        }
        
        this.handleClickResultItem = this.handleClickResultItem.bind(this)
        this.handleChangeObjectStatusFormSubmit = this.handleChangeObjectStatusFormSubmit.bind(this)
        this.handleConfirmFormSubmit = this.handleConfirmFormSubmit.bind(this)
        this.handleChangeObjectStatusFormClose = this.handleChangeObjectStatusFormClose.bind(this);
        this.handleToggleNotFound = this.handleToggleNotFound.bind(this);
    }
    
    componentDidUpdate(prepProps) {
        if(!(_.isEqual(prepProps.searchResult, this.props.searchResult))) {
            let notFoundResult = [];
            let foundResult = [];
            this.props.searchResult.map(item => {
                if (item.status.toLowerCase() !== 'normal') {
                    notFoundResult.push(item)
                }
            })
            foundResult = this.props.searchResult.filter(item => item.status.toLowerCase() === 'normal')
            this.setState({
                foundResult: foundResult,
                notFoundResult: notFoundResult,
            })
        }        
    }

    handleClickResultItem(eventKey) {
        const eventItem = eventKey.split(':');
        const isFound = eventItem[0]
        const number = eventItem[1]
        this.setState({
            showEditObjectForm: true,

            /** The reason using array to encapture the selectedObjectData is to have the consisten data form passed into ChangeStatusForm */
            selectedObjectData: isFound.toLowerCase() === 'found' ? [this.state.foundResult[number]] : [this.state.notFoundResult[number]]
        })
        this.props.shouldUpdateTrackingData(false)
    }

    handleChangeObjectStatusFormClose() {
        this.setState({
            showEditObjectForm: false,
            showConfirmForm: false,
        })
        this.props.shouldUpdateTrackingData(true)
    }

    handleChangeObjectStatusFormSubmit(postOption) {
        this.setState({
            selectedObjectData: {
                ...this.state.selectedObjectData,
                ...postOption,
            },
            showEditObjectForm: false,
        })
        setTimeout(
            function() {
                this.setState({
                    showConfirmForm: true,
                    formOption: postOption,
                })
            }.bind(this),
            500
        )
    }

    handleConfirmFormSubmit(e, addedDevices) {
        const button = e.target
        const postOption = this.state.formOption;
        const { status, transferredLocation } = postOption

        const colorPanel = this.props.colorPanel ? this.props.colorPanel : null;

        let editObjectPackages = [];
        let editObjectIdSet = new Set();

        /** Add the original edit device into editObjectPackages */
        editObjectPackages.push(postOption)
        editObjectIdSet.add(postOption.mac_address)

        /** Add the added device into editObjectPackages */
        if (addedDevices) {
            addedDevices.map( item => {
                item.status = status
                delete item.transferred_location
                item.transferredLocation = transferredLocation
                editObjectPackages.push(item)
                editObjectIdSet.add(item.mac_address)
            })
        }

        let changedStatusSearchResult = this.props.searchResult.map(item => {
            if (editObjectIdSet.has(item.mac_address)) {
                item = {
                    ...item,
                    status: postOption.status,
                    transferredLocation: postOption.transferredLocation
                }
            }
            return item
        })

        axios.post(dataSrc.editObjectPackage, {
            formOption: editObjectPackages
        }).then(res => {
            button.style.opacity = 0.4
            setTimeout(
                function() {
                    this.setState ({
                        showConfirmForm: false,
                        formOption: [],
                    })
                    this.props.transferSearchResult(changedStatusSearchResult, colorPanel )
                    this.props.shouldUpdateTrackingData(true)
                }
                .bind(this),
                1000
            )
        }).catch( error => {
            console.log(error)
        })
    } 

    handleToggleNotFound(e) {
        e.preventDefault()
        this.setState({
            showNotResult: !this.state.showNotResult
        })
        
    }

    render() {
        const locale = this.context;
        const { searchResult, searchKey} = this.props;

        const style = {
            listItem: {
                position: 'relative',
                zIndex: 6,
            }, 
            noResultDiv: {
                color: 'grey',
                fontSize: 30,
                fontWeight: 300
            },
            firstText: {
                paddingLeft: 15,
                paddingRight: 0,
                // background: 'rgb(227, 222, 222)',
                // height: 30,
                // width: 30,
            },
            middleText: {
                paddingLeft: 2,
                paddingRight: 2,
            },
            lastText: {
                // textAlign: 'right'
            },
            titleText: {
                color: 'rgb(80, 80, 80, 0.9)'
            }, 
            notFoundResultDiv: {
                display: this.state.showNotResult ? null : 'none',
            },
            foundResultDiv: {
                display: this.state.showNotResult ? 'none' : null,
                // height: '300px',
                // minHeight: '400px',
                // maxHeight: '500px',
                // overflow: 'scroll'
            },

            resultListGroup: {
                maxHeight: '45vh',
                overflow: 'hidden scroll',
            },
            alertTextTitle: {
                fontWeight: 1000,
                color: 'rgba(101, 111, 121, 0.78)'
            }

        }

        return(
            <>
                <Row className='d-flex justify-content-center' style={style.titleText}>
                    <h4>Search Result</h4>
                </Row>
                <Row className='w-100 searchResultForMobile'>
                    <Alert variant='secondary' className='d-flex justify-content-start'>
                        <div style={style.alertTextTitle}>{'Found '}</div>
                        &nbsp;
                        &nbsp;

                        <div style={style.alertText}>{this.state.foundResult.length}</div>
                        &nbsp;
                        <div style={style.alertText}>devices</div>
                        &nbsp;
                    </Alert>
                </Row>
                <Row className='' style={style.foundResultDiv}>
                    {this.state.foundResult.length === 0 
                    ?   <Col className='d-flex justify-content-center font-italic font-weight-lighter' style={style.noResultDiv}>
                            <div className='searchResultForDestop'>No Result</div>
                        </Col> 
                    
                    :   
                            <Col className=''>
                                <ListGroup onSelect={this.handleClickResultItem} id='searchResultListGroup'>
                                    {searchResult.filter(item => item.status.toLowerCase() === 'normal').map((item,index) => {
                                        let element = 
                                            <ListGroup.Item href={'#' + index} action style={style.listItem} className='searchResultList' eventKey={'found:' + index} key={index}>
                                                <Row className="d-flex justify-content-around">
                                                    <Col xs={1} sm={1} lg={1} className="font-weight-bold d-flex align-self-center" style={style.firstText}>{index + 1}</Col>
                                                    <Col xs={3} sm={3} lg={3} className="d-flex align-self-center justify-content-center" style={style.middleText}>{item.type}</Col>
                                                    <Col xs={4} sm={4} lg={4} className="d-flex align-self-center text-muted" style={style.middleText}>ACN: xxxx-xxxx-{item.access_control_number.slice(10, 14)}</Col>
                                                    <Col xs={3} sm={3} lg={3} className="d-flex align-self-center text-muted justify-content-center" style={style.lastText}>near {item.location_description}</Col>
                                                </Row>
                                            </ListGroup.Item>
                                        return element
                                    })}
                                </ListGroup>
                            </Col>
                    }
                </Row>
                {this.state.notFoundResult.length !== 0 
                ? 
                    <>
                        <Row className='d-flex justify-content-center mt-3' style={style.titleText}>
                            <h4>
                                <a href="" onClick={this.handleToggleNotFound}>
                                    {this.state.showNotResult ? 'Hide' : 'Show' + ' ' + this.state.notFoundResult.length} Devices Not Found 
                                </a>
                            </h4>
                        </Row>
                        {/* <Row className='text-left mt-3' style={style.titleText}>
                            <h5>Devices not found</h5>
                        </Row> */}
                        <Row style={style.notFoundResultDiv}>
                            <Col className=''>
                                <ListGroup onSelect={this.handleClickResultItem} className=''>
                                    {this.state.notFoundResult.map((item,index) => {
                                        let element = 
                                            <ListGroup.Item href={'#' + index} action style={style.listItem} className='searchResultList' eventKey={'notfound:' + index} key={index}>
                                                <Row className="">
                                                    <Col xs={1} sm='1' lg='1' className="font-weight-bold d-flex align-self-center" style={style.firstText}>{index + 1}</Col>
                                                    <Col xs={3} sm='3' lg='3' className="d-flex align-self-center justify-content-center" style={style.middleText}>{item.type}</Col>
                                                    <Col xs={4} sm='4' lg='4' className="d-flex align-self-center text-muted" style={style.middleText}>ACN: xxxx-xxxx-{item.access_control_number.slice(10, 14)}</Col>
                                                    <Col xs={3} sm='3' lg='3' className="d-flex align-self-center text-muted justify-content-center" style={style.lastText}>near {item.location_description}</Col>
                                                </Row>
                                            </ListGroup.Item>
                                        return element
                                    })}
                                </ListGroup>
                            </Col> 
                        </Row>
                    </>
                : null}
            


                <ChangeStatusForm 
                    show={this.state.showEditObjectForm} 
                    title='Report device status' 
                    selectedObjectData={this.state.selectedObjectData} 
                    searchKey={searchKey}
                    handleChangeObjectStatusFormClose={this.handleChangeObjectStatusFormClose}
                    handleChangeObjectStatusFormSubmit={this.handleChangeObjectStatusFormSubmit}
                />
                <ConfirmForm 
                    show={this.state.showConfirmForm}  
                    title='Thank you for reporting' 
                    selectedObjectData={this.state.formOption} 
                    handleChangeObjectStatusFormClose={this.handleChangeObjectStatusFormClose} 
                    handleConfirmFormSubmit={this.handleConfirmFormSubmit}
                    searchResult={this.props.searchResult}
                />
            </>
        )
    }
}
SearchResult.contextType = LocaleContext;

const mapDispatchToProps = (dispatch) => {
    return {
        shouldUpdateTrackingData: value => dispatch(shouldUpdateTrackingData(value))
    }
}

export default connect(null, mapDispatchToProps)(SearchResult);

