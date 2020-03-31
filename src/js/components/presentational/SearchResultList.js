import React from 'react';
import { 
    Button,
    Col, 
    Row, 
} from 'react-bootstrap'
import ChangeStatusForm from '../container/ChangeStatusForm';
import ConfirmForm from '../container/ConfirmForm';
import SignatureForm from '../container/UserContainer/SignatureForm';
import dataSrc from '../../dataSrc';
import _ from 'lodash';
import axios from 'axios';
import AccessControl from './AccessControl';
import SearchResultListGroup from '../presentational/SearchResultListGroup'
import { AppContext } from '../../context/AppContext';
import DownloadPdfRequestForm from '../container/DownloadPdfRequestForm'
import config from '../../config'
import {
    BrowserView,
    TabletView,
    MobileOnlyView
} from 'react-device-detect'
import moment from 'moment'
import ScrollArea from 'react-scrollbar'
import ToastNotification from '../presentational/ToastNotification'
import messageGenerator from '../../helper/messageGenerator'
import PatientViewModal from './PatientViewModal';


class SearchResult extends React.Component {

    static contextType = AppContext

    state = {
        showEditObjectForm: false,
        showSignatureForm:false,
        showConfirmForm: false,
        selectedObjectData: [],
        showNotFoundResult: false,
        showPatientResult: false,
        selection: [],
        editedObjectPackage: [],
        showAddDevice: false,
        showDownloadPdfRequest: false,
        showPath: false,
        signatureName:'',
        showPatientView: false,
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (!(_.isEqual(prevProps.searchKey, this.props.searchKey))) {
            this.setState({
                showNotFoundResult: false
            })
        } 
    }

    onSelect = (eventKey) => {
        let { 
            stateReducer
         } = this.context

        let [{}, dispatch] = stateReducer

        const eventItem = eventKey.split(':');
        const isFound = parseInt(eventItem[0])
        const number = parseInt(eventItem[1])
        let selectItem = isFound 
                ? this.props.searchResult.filter(item => item.found)[number]
                : this.props.searchResult.filter(item => !item.found)[number]

        if (selectItem.object_type == 0) {
            /** The reason using array to encapture the selectedObjectData is to have the consisten data form passed into ChangeStatusForm */
            this.toggleSelection(number, isFound)
            this.props.highlightSearchPanel(true)
            dispatch({
                type: 'setUpdateTrackingData',
                value: false
            })
        } else {
            this.setState({
                showPatientView: true,
                selectedObjectData: selectItem
            })
        }

    }

    toggleSelection = (number, isFound) => {
        let selection = [...this.state.selection]
        let selectItem = isFound ? this.props.searchResult.filter(item => item.found)[number]
                                : this.props.searchResult.filter(item => !item.found)[number]
        let mac = selectItem.mac_address
        const index = selection.indexOf(mac);

        let selectedObjectData = [...this.state.selectedObjectData]
        if (this.state.showAddDevice) {
            if (index >= 0) {
                if (selection.length === 1) return;
                selection = [...selection.slice(0, index), ...selection.slice(index + 1)];
                selectedObjectData = [...selectedObjectData.slice(0, index), ...selectedObjectData.slice(index + 1)]
            } else {
                selection.push(mac)
                selectedObjectData.push(selectItem)
            }
        } else {
            selection = [mac]
            selectedObjectData = [selectItem]
        }
        this.setState({
            showEditObjectForm: true,
            selection,
            selectedObjectData
        })
    }

    handleChangeObjectStatusFormClose = () => {
        let { stateReducer } = this.context
        let [{}, dispatch] = stateReducer
        this.setState({
            showEditObjectForm: false,
            showSignatureForm:false,
            showConfirmForm: false,
            selection: [],
            selectedObjectData: [],
            showAddDevice: false
        })
        dispatch({
            type: 'setUpdateTrackingData',
            value: true
        })
        this.props.highlightSearchPanel(false)
    }

    handleChangeObjectStatusFormSubmit = values => {

        let editedObjectPackage = _.cloneDeep(this.state.selectedObjectData).map(item => {
            item.status = values.status.toLowerCase(),
            item.transferred_location = values.transferred_location ? values.transferred_location : '';
            item.notes = values.notes
            return item
        })
        this.setState({
            showEditObjectForm: false,
            editedObjectPackage :editedObjectPackage ,
        })
        if (values.status == 'transferred') { 
            this.setState({
                showSignatureForm:true
            })
        }else{ 
            setTimeout(
                function() {
                    this.setState({
                        showConfirmForm: true,
                    })
                    this.props.highlightSearchPanel(false)
                }.bind(this),
                500
            )
        }
    }

    handleSignatureSubmit = values => {
        
        // let editedObjectPackage = _.cloneDeep(this.state.selectedObjectData).map(item => {
        //     item.signature = values.name
        //     return item
        // })
        
        this.setState({
            showSignatureForm:false,
            signatureName : values.name
            // editedObjectPackage : editedObjectPackage
        })
    
        setTimeout(
            function() {
                this.setState({
                    showConfirmForm: true,
                })
                this.props.highlightSearchPanel(false)
            }.bind(this),
            500
        )
    }


    handleConfirmFormSubmit = (isDelayTime) => {
        let signatureName = this.state.signatureName
        let { editedObjectPackage } = this.state;
        let { locale, auth, stateReducer } = this.context
        let [{}, dispatch] = stateReducer
        let username = auth.user.name
        let shouldCreatePdf = config.statusToCreatePdf.includes(editedObjectPackage[0].status)
        let status = editedObjectPackage[0].status
        let reservedTimestamp = isDelayTime ? moment().add(10, 'minutes').format() : moment().format()
        /** Create the pdf package, including pdf, pdf setting and path */

        editedObjectPackage.map(editedObject => {
            if(editedObject.transferred_location){
                let transferred_location = editedObject.transferred_location.value
                editedObject.transferred_location_label = editedObject.transferred_location.label
                editedObject.transferred_location = `${transferred_location.branch.id},${transferred_location.departmentId}`
            }
            

        })

        let pdfPackage = shouldCreatePdf && config.getPdfPackage(status, auth.user, this.state.editedObjectPackage, locale,signatureName)
 
        axios.post(dataSrc.editObjectPackage, {
            locale,
            formOption: editedObjectPackage[0],
            username,
            pdfPackage,
            reservedTimestamp
        }).then(res => {
            setTimeout(
                () => {
                    this.setState ({
                        showConfirmForm: shouldCreatePdf,
                        showAddDevice: false,
                        showDownloadPdfRequest: shouldCreatePdf,
                        pdfPath: shouldCreatePdf && pdfPackage.path,
                        selection: []
                    }, () => {
                        dispatch({
                            type: 'setUpdateTrackingData',
                            value: true
                        })
                        messageGenerator.setSuccessMessage(
                            'edit object success'
                        )
                    })

                },
                1000
            )
        }).catch( error => {
            console.log(error)
        })
    } 

    handleToggleNotFound = (e) => {
        e.preventDefault()
        this.setState({ 
            showNotFoundResult: !this.state.showNotFoundResult 
        })
    }

    handleAdditionalButton = (text) => {
        let selection = []
        let selectedObjectData = []
        if (this.state.showAddDevice) {
            selection.push(this.state.selection[0])
            selectedObjectData.push(this.state.selectedObjectData[0])
        }
        this.setState({
            showAddDevice: !this.state.showAddDevice,
            selection: this.state.showAddDevice ? selection : this.state.selection,
            selectedObjectData: this.state.showAddDevice ? selectedObjectData : this.state.selectedObjectData
        })
    }

    handleRemoveButton = (e) => {
        let mac = e.target.getAttribute('name')
        let selection = [...this.state.selection]
        let selectedObjectData = [...this.state.selectedObjectData]
        let index = selection.indexOf(mac)
        if (index > -1) {
            selection = [...selection.slice(0, index), ...selection.slice(index + 1)]
            selectedObjectData = [...selectedObjectData.slice(0, index), ...selectedObjectData.slice(index + 1)]
        } else {
            return 
        }
        this.setState({
            selection,
            selectedObjectData
        })
    }

    handleClose = (callback) =>{
        this.setState({
            showDownloadPdfRequest: false,
            showConfirmForm: false,
            showPatientView: false,
            selectedObjectData: [],
            selection: [],
            editedObjectPackage: [],
            showSignatureForm: false
        }, callback)
    }

    handlePatientView = values => {
        let {
            auth
        } = this.context
        let objectPackage = {
            userId: auth.user.id,
            record: values.record,
            id: this.state.selectedObjectData.id
        }
        axios.post(dataSrc.addPatientRecord, {
            objectPackage
        })
        .then(res => {
            let callback = () => messageGenerator.setSuccessMessage(
                'save success'
            )
            this.setState({
                showDownloadPdfRequest: false,
                showConfirmForm: false,
                showPatientView: false,
            }, callback)
        })
        .catch(err => {
            console.log(`add patient record failed ${err}`)
        })
    }

    handleShowSignatureForm = () =>{
        this.setState({
            showSignatureForm:true
        })
    }

    render() {
        const { locale } = this.context;
        const { searchKey } = this.props;
        const style = {
            noResultDiv: {
                color: 'grey',
                fontSize: '1rem',
            },
            titleText: {
                color: 'rgb(80, 80, 80, 0.9)',
            }, 
            downloadPdfRequest: {
                zIndex: 3000,
                top: '30%',
                right: 'auto',
                bottom: 'auto',
                padding: 0,
            },
            searchResultListForMobile: {
                maxHeight: this.props.showMobileMap ? '35vh' : '65vh',
                dispaly: this.props.searchKey ? null : 'none',
            },
            searchResultListForTablet: {
                dispaly: this.props.searchKey ? null : 'none',
                maxHeight: '28vh'
            }
        }

        let foundResult = this.props.searchResult.filter(item => item.found)
        let notFoundResult = this.props.searchResult.filter(item => !item.found)
        let searchResult = this.state.showNotFoundResult 
            ? notFoundResult
            : foundResult

        let title = this.state.showNotFoundResult 
            ? locale.texts.SEARCH_RESULTS_NOT_FOUND
            : locale.texts.SEARCH_RESULTS_FOUND

        return(
            <div className='text-capitalize'>
                <BrowserView>
                    <div>
                        <Row className='d-flex justify-content-center' style={style.titleText}>
                            <div className='title'>
                                {title}
                            </div>
                        </Row>
                        <Row>
                            {searchResult.length === 0 
                                ?   <Col className='d-flex justify-content-center font-weight-lighter' style={style.noResultDiv}>
                                        <div className='searchResultForDestop'>{locale.texts.NO_RESULT}</div>
                                    </Col> 
                                :   
                                    <Col className="searchResultListGroup d-flex justify-content-center">
                                        <ScrollArea 
                                            smoothScrolling={true}
                                            horizontal={false}
                                        >                 
                                            <AccessControl
                                                permission={'form:edit'}
                                                renderNoAccess={() => (
                                                    <SearchResultListGroup 
                                                        data={searchResult}
                                                        selection={this.state.selection}
                                                    />
                                                )}
                                            >
                                                <SearchResultListGroup 
                                                    data={searchResult}
                                                    onSelect={this.onSelect}
                                                    selection={this.state.selection}
                                                    action
                                                />

                                            </AccessControl>
                                        </ScrollArea>
                                    </Col>
                            }
                        </Row>
                        <Row className='d-flex justify-content-center mt-3'>
                            <Button
                                variant="link"
                                onClick={this.handleToggleNotFound}
                                size="lg"
                                disabled={false}
                            >
                                {this.state.showNotFoundResult
                                    ? locale.texts.SHOW_SEARCH_RESULTS_FOUND
                                    : locale.texts.SHOW_SEARCH_RESULTS_NOT_FOUND
                                }
                            </Button>
                        </Row>
                    </div>
                </BrowserView>
                <TabletView>
                    <div>
                        <Row className='d-flex justify-content-center' style={style.titleText}>
                            <h4>
                                {title}
                            </h4>
                        </Row>
                        <Row>
                            {searchResult.length === 0 
                                ?   <Col className='d-flex justify-content-center font-weight-lighter' style={style.noResultDiv}>
                                        <div className='searchResultForDestop'>{locale.texts.NO_RESULT}</div>
                                    </Col> 
                                :   
                                    <Col className="searchResultListGroupForTablet d-flex justify-content-center">
                                        <ScrollArea 
                                            style={style.searchResultListForTablet} 
                                            smoothScrolling={true}
                                        >                 
                                            <AccessControl
                                                permission={'form:edit'}
                                                renderNoAccess={() => (
                                                    <SearchResultListGroup 
                                                        data={searchResult}
                                                        selection={this.state.selection}
                                                    />
                                                )
                                                }
                                            >
                                                <SearchResultListGroup 
                                                    data={searchResult}
                                                    onSelect={searchResult[0].object_type == 0 
                                                        ? this.onSelect
                                                        : null
                                                    }
                                                    selection={this.state.selection}
                                                    action={
                                                        searchResult[0].object_type == 0 && !this.state.showNotFoundResult
                                                            ? true
                                                            : false
                                                    }
                                                />

                                            </AccessControl>
                                        </ScrollArea>
                                    </Col>
                            }
                        </Row>
                        <Row className='d-flex justify-content-center mt-3'>
                            <Button
                                variant="link"
                                onClick={this.handleToggleNotFound}
                                size="lg"
                                disabled={false}
                            >
                                {this.state.showNotFoundResult
                                    ? locale.texts.SHOW_SEARCH_RESULTS_FOUND
                                    : locale.texts.SHOW_SEARCH_RESULTS_NOT_FOUND
                                }

                            </Button>
                        </Row>
                    </div>
                </TabletView>
                <MobileOnlyView>
                <div>
                    <Row className='d-flex justify-content-center' style={style.titleText}>
                        <h4 className='text-capitalize'>
                            {title}
                        </h4>
                    </Row>
                    <Row>
                    
                        {searchResult.length === 0 
                            ?   <Col className='d-flex justify-content-center font-weight-lighter' style={style.noResultDiv}>
                                    <div className='searchResultForDestop'>{locale.texts.NO_RESULT}</div>
                                </Col> 
                            :   
                                
                                <Col className="searchResultListGroupForMobile d-flex justify-content-center">  
                                    <ScrollArea style={style.searchResultListForMobile} smoothScrolling={true}>                 
                                        <AccessControl
                                            permission={'form:edit'}
                                            renderNoAccess={() => (
                                                <SearchResultListGroup 
                                                    data={searchResult}
                                                    selection={this.state.selection}
                                                />
                                            )}
                                        >
                                            <SearchResultListGroup 
                                                data={searchResult}
                                                onSelect={searchResult[0].object_type == 0 
                                                    ? this.onSelect
                                                    : null
                                                }
                                                selection={this.state.selection}
                                                action={
                                                    searchResult[0].object_type == 0 && !this.state.showNotFoundResult
                                                        ? true
                                                        : false
                                                }
                                            />

                                        </AccessControl>
                                    </ScrollArea>
                                </Col>
                            }
                        </Row>
                        <Row className='d-flex justify-content-center mt-3'>
                            <Button
                                variant="link"
                                onClick={this.handleToggleNotFound}
                                size="lg"
                                disabled={false}
                            >
                                {this.state.showNotFoundResult
                                    ? locale.texts.SHOW_SEARCH_RESULTS_FOUND
                                    : locale.texts.SHOW_SEARCH_RESULTS_NOT_FOUND
                                }

                            </Button>
                        </Row>
                    </div>
                </MobileOnlyView>

                <ChangeStatusForm
                    handleShowPath={this.props.handleShowPath} 
                    show={this.state.showEditObjectForm} 
                    title='report device status' 
                    selectedObjectData={this.state.selectedObjectData} 
                    searchKey={searchKey}
                    handleChangeObjectStatusFormClose={this.handleChangeObjectStatusFormClose}
                    handleChangeObjectStatusFormSubmit={this.handleChangeObjectStatusFormSubmit}
                    handleAdditionalButton={this.handleAdditionalButton}
                    showAddDevice={this.state.showAddDevice}
                    handleRemoveButton={this.handleRemoveButton}
                />
                <PatientViewModal
                    show={this.state.showPatientView} 
                    title="patient record"
                    handleClose={this.handleClose}
                    handleSubmit={this.handlePatientView}
                    data={this.state.selectedObjectData} 
                />
                
                <SignatureForm
                    show={this.state.showSignatureForm} 
                    title={locale.texts.SIGNATURE} 
                    handleClose={this.handleClose}
                    handleSubmit= {this.handleSignatureSubmit}
                />

                <ConfirmForm 
                    show={this.state.showConfirmForm}  
                    title={'thank you for reporting'}
                    selectedObjectData={this.state.editedObjectPackage} 
                    handleChangeObjectStatusFormClose={this.handleChangeObjectStatusFormClose} 
                    handleConfirmFormSubmit={this.handleConfirmFormSubmit}
                    showDownloadPdfRequest={this.state.showDownloadPdfRequest}
                />
                <DownloadPdfRequestForm
                    show={this.state.showDownloadPdfRequest} 
                    pdfPath={this.state.pdfPath}
                    handleClose={this.handleClose}
                />
            </div>
        )
    }
}

export default SearchResult
