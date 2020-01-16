import React from 'react';
import { 
    Button,
    Col, 
    Row, 
} from 'react-bootstrap'
import ChangeStatusForm from '../container/ChangeStatusForm';
import ConfirmForm from '../container/ConfirmForm';
import dataSrc from '../../dataSrc';
import _ from 'lodash';
import axios from 'axios';
import AccessControl from './AccessControl';
import SearchResultListGroup from '../presentational/SearchResultListGroup'
import { AppContext } from '../../context/AppContext';
import DownloadPdfRequestForm from '../container/DownloadPdfRequestForm'
import config from '../../config'

class SearchResult extends React.Component {

    static contextType = AppContext

    state = {
        showEditObjectForm: false,
        showConfirmForm: false,
        selectedObjectData: [],
        showNotFoundResult: false,
        showPatientResult: false,
        selection: [],
        editedObjectPackage: [],
        showAddDevice: false,
        showDownloadPdfRequest: false,
        showPath: false
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (!(_.isEqual(prevProps.searchKey, this.props.searchKey))) {
            this.setState({
                showNotFoundResult: false
            })
        } 
    }

    handleSelectResultItem = (eventKey) => {
        const eventItem = eventKey.split(':');
        const isFound = parseInt(eventItem[0])
        const number = parseInt(eventItem[1])

        /** The reason using array to encapture the selectedObjectData is to have the consisten data form passed into ChangeStatusForm */
        this.toggleSelection(number, isFound)
        this.props.highlightSearchPanel(true)
        let { stateReducer } = this.context
        let [{}, dispatch] = stateReducer
        dispatch({
            type: 'setUpdateTrackingData',
            value: false
        })
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
            showConfirmForm: false,
            selection: [],
            selectedObjectData: [],
            showAddDevice: false
        })
        setTimeout(
            function (){
                this.setState({
                    selectedObjectData: [],
                })
            }.bind(this),
            200
        )
        dispatch({
            type: 'setUpdateTrackingData',
            value: true
        })
        this.props.highlightSearchPanel(false)
    }

    handleChangeObjectStatusFormSubmit = values => {
        let editedObjectPackage = _.cloneDeep(this.state.selectedObjectData).map(item => {
            item.status = values.radioGroup.toLowerCase(),
            item.transferred_location = values.select ? values.select: '';
            item.notes = values.notes
            return item
        })
        this.setState({
            showEditObjectForm: false,
            editedObjectPackage,
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

    handleConfirmFormSubmit = (e,isDelayTime) => {
        let { editedObjectPackage } = this.state;
        let { locale, auth, stateReducer } = this.context
        let [{}, dispatch] = stateReducer
        let username = auth.user.name
        let shouldCreatePdf = config.statusToCreatePdf.includes(editedObjectPackage[0].status)
        let status = editedObjectPackage[0].status

        /** Create the pdf package, including pdf, pdf setting and path */
        let pdfPackage = shouldCreatePdf && config.getPdfPackage(status, auth.user, this.state.editedObjectPackage, locale)
     
        editedObjectPackage.isDelayTime = e
     
        axios.post(dataSrc.editObjectPackage, {
            locale,
            formOption: editedObjectPackage,
            username,
            pdfPackage,
            isDelayTime:e
        }).then(res => {
            setTimeout(
                function() {
                    this.setState ({
                        showConfirmForm: shouldCreatePdf,
                        showAddDevice: false,
                        showDownloadPdfRequest: shouldCreatePdf,
                        pdfPath: shouldCreatePdf && pdfPackage.path
                    })
                    dispatch({
                        type: 'setUpdateTrackingData',
                        value: true
                    })
                }
                .bind(this),
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

    handleFormClose = () =>{
        this.setState({
            showDownloadPdfRequest: false,
            showConfirmForm: false
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
            alertTextTitle: {
                fontWeight: 1000,
                color: 'rgba(101, 111, 121, 0.78)'
            },
            downloadPdfRequest: {
                zIndex: 3000,
                top: '30%',
                // left: '-10%',
                right: 'auto',
                bottom: 'auto',
                padding: 0,
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
                            <Col className="searchResultListGroup d-flex justify-content-center">
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
                                        handleSelectResultItem={searchResult[0].object_type == 0 
                                            ? this.handleSelectResultItem
                                            : null
                                        }
                                        selection={this.state.selection}
                                        action={searchResult[0].object_type == 0
                                            ? true
                                            : false
                                        }
                                    />
                                </AccessControl>
                            </Col>
                    }
                </Row>
                <Row className='d-flex justify-content-center mt-3'>
                    <Button
                        variant="link"
                        className="text-capitalize"
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
                <ChangeStatusForm
                    handleShowPath={this.props.handleShowPath} 
                    show={this.state.showEditObjectForm} 
                    title={'report device status'} 
                    selectedObjectData={this.state.selectedObjectData} 
                    searchKey={searchKey}
                    handleChangeObjectStatusFormClose={this.handleChangeObjectStatusFormClose}
                    handleChangeObjectStatusFormSubmit={this.handleChangeObjectStatusFormSubmit}
                    handleAdditionalButton={this.handleAdditionalButton}
                    showAddDevice={this.state.showAddDevice}
                    handleRemoveButton={this.handleRemoveButton}
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
                    close={this.handleFormClose}
                />
            </div>
        )
    }
}

export default SearchResult
