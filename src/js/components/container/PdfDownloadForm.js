import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { 
    Button,
    Row,
}  from 'react-bootstrap';
import axios from 'axios';
import dataSrc from '../../dataSrc';
import QRCode from 'qrcode.react';
import config from '../../config'
import { AppContext } from '../../context/AppContext';

class PdfDownloadForm extends React.Component {

    static contextType = AppContext
    
    state = {
        show: false,
        savePath: "",
        data: null,
        alreadyUpdate: false,
        hasData: false,
        isDone: false,
    }


    sendSearchResultToBackend = (searchResultInfo, callBack) => {
        axios.post(dataSrc.generatePDF ,searchResultInfo)
            .then(res => {
                callBack(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }

    componentDidUpdate = (preProps) => {
        if(this.props.show && !this.state.show){

            let data = { 
                foundResult: [], 
                notFoundResult: [] 
            }

            for(var item of this.props.data){
                item.found ? data.foundResult.push(item) : data.notFoundResult.push(item)
            }

            let { locale, auth, stateReducer } = this.context
            let [{areaId}] = stateReducer
            let pdfPackage = config.getPdfPackage('searchResult', auth.user, data, locale, areaId)

            var searResultInfo = {
                userInfo: auth.user,
                pdfPackage,
            }
            this.sendSearchResultToBackend(searResultInfo,(path) => {
                this.setState({
                    savePath : path,
                    data: this.props.data,
                    show: this.props.show,
                    alreadyUpdate: true,
                    isDone: true,
                    hasData: true
                })  
            })
        }
    }
    
    handleClose = () => {
        this.props.handleClose()
        this.setState({
            show: false,
            alreadyUpdate:false,
            isDone: false,
        })
    }
    PdfDownloader = () => {
        window.open(this.state.savePath);
    }

    render() {
        const {
            hasData, 
            savePath, 
        } = this.state

        const { locale } = this.context

        return (
            <Modal 
                show={this.state.show}  
                onHide={this.handleClose} 
                className='text-capitalize'
                size="sm" 
            >
                <Modal.Header 
                    closeButton
                >
                    {locale.texts.PRINT_SEARCH_RESULT}
                </Modal.Header>
                <Modal.Body
                    className='d-flex flex-column'
                >
                    <Row className='d-flex justify-content-center mb-2'>
                        {hasData &&
                            <QRCode
                                value={dataSrc.pdfUrl(savePath)} 
                                size={128}
                            />
                        }
                    </Row>
                    <Row className='d-flex justify-content-center mb-2'> 
                        <Button 
                            onClick={this.PdfDownloader}
                            variant='outline-secondary'
                            className='text-capitalize'
                        >
                            {locale.texts.DOWNLOAD}
                        </Button>
                        <a ref="download" download style={{display: 'none'}}>hi</a>
                    </Row>
                </Modal.Body>
            </Modal>
        );
    }
}
  
export default PdfDownloadForm;