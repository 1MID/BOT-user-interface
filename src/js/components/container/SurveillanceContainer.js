import React from 'react';

import Surveillance from '../presentational/Surveillance';
import ToggleSwitch from './ToggleSwitch';
import Nav from 'react-bootstrap/Nav';
import ChangeStatusForm from './ChangeStatusForm';
import config from '../../config';
import LocaleContext from '../../context/LocaleContext';
import ConfirmForm from './ConfirmForm'
import axios from 'axios';
import dataSrc from '../../dataSrc';
import { connect } from 'react-redux'
import { shouldUpdateTrackingData } from '../../action/action'

class SurveillanceContainer extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            rssi: config.surveillanceMap.locationAccuracy.defaultVal,
            showEditObjectForm: false,
            showConfirmForm: false,
            selectedObjectData: [],
            formOption: [],
        }

        this.adjustRssi = this.adjustRssi.bind(this);
        this.handleChangeObjectStatusForm = this.handleChangeObjectStatusForm.bind(this);
        this.handleChangeObjectStatusFormClose = this.handleChangeObjectStatusFormClose.bind(this);
        this.handleChangeObjectStatusFormSubmit = this.handleChangeObjectStatusFormSubmit.bind(this);
        this.handleConfirmFormSubmit = this.handleConfirmFormSubmit.bind(this);
    }


    adjustRssi(adjustedRssi) {
        this.setState({
            rssi: adjustedRssi,
        })
    }


    handleChangeObjectStatusForm(objectData) {
        this.setState({
            showEditObjectForm: true,
            selectedObjectData: objectData,
        })
        this.props.shouldUpdateTrackingData(false)
    }

    handleChangeObjectStatusFormClose() {
        this.setState({
            showEditObjectForm: false,
            showConfirmForm: false,
        })
        this.props.shouldUpdateTrackingData(true);
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
                this.props.shouldUpdateTrackingData(false)
            }.bind(this),
            500
        )
    }

    handleConfirmFormSubmit(e) {
        const button = e.target
        const postOption = this.state.formOption;
        axios.post(dataSrc.editObject, {
            formOption: postOption
        }).then(res => {
            button.style.opacity = 0.4
            setTimeout(
                function() {
                    this.setState ({
                        showConfirmForm: false,
                        formOption: [],
                    }) 
                    this.props.shouldUpdateTrackingData(true)
                }
                .bind(this),
                1000
            )
        }).catch( error => {
            console.log(error)
        })
    }

    
    render(){
        const { rssi, 
                showEditObjectForm, 
                showConfirmForm, 
                selectedObjectData, 
                formOption, 
            } = this.state;
        const { hasSearchKey, 
                searchResult,
                searchType, 
                transferSearchableObjectData
            } = this.props;
        const locale = this.context;

        const style = {
            title: {
                color: 'grey',
                fontSize: 8,
            },
            searchMap: {
                // height: '100vh'
            }
        }

        return(
            <>
                <Surveillance 
                    rssi={rssi} 
                    hasSearchKey={hasSearchKey}
                    searchResult={searchResult}
                    searchType={searchType}
                    transferSearchableObjectData={transferSearchableObjectData}
                    handleChangeObjectStatusForm={this.handleChangeObjectStatusForm}
                    style={style.searchMap}
                    colorPanel={this.props.colorPanel}

                />
                <Nav className='d-flex align-items-center'>
                    <Nav.Item className='d-flex align-items-baseline'>
                        <small style={style.title}>{locale.location_accuracy.toUpperCase()}</small>
                        <ToggleSwitch adjustRssi={this.adjustRssi} leftLabel={locale.low} defaultLabel={locale.med} rightLabel={locale.high} />
                    </Nav.Item>
                    {/* <Nav.Item>
                        <ModalForm title='Add object'/>
                    </Nav.Item> */}
                </Nav>
                <ChangeStatusForm 
                    show={showEditObjectForm} 
                    title='Report device status' 
                    selectedObjectData={selectedObjectData} 
                    searchKey={null}
                    handleChangeObjectStatusFormClose={this.handleChangeObjectStatusFormClose}
                    handleChangeObjectStatusFormSubmit={this.handleChangeObjectStatusFormSubmit}
                />
                <ConfirmForm 
                    show={showConfirmForm}  
                    title='Thank you for reporting' 
                    selectedObjectData={formOption} 
                    handleChangeObjectStatusFormClose={this.handleChangeObjectStatusFormClose} 
                    handleConfirmFormSubmit={this.handleConfirmFormSubmit}
                />
            </>
        )
    }
}
SurveillanceContainer.contextType = LocaleContext;

const mapDispatchToProps = (dispatch) => {
    return {
        shouldUpdateTrackingData: value => dispatch(shouldUpdateTrackingData(value))
    }
}

export default connect(null, mapDispatchToProps)(SurveillanceContainer)