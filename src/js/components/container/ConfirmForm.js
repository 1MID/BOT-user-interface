import React from 'react';
import { Modal, Button, Row, Col, Image, ButtonToolbar} from 'react-bootstrap'
import config from '../../config';
import LocaleContext from '../../context/LocaleContext';
import moment from 'moment';
import tempImg from '../../../img/doppler.jpg'
import { Formik, Form } from 'formik';
  
class ConfirmForm extends React.Component {
    
    state = {
        show: this.props.show,
        isShowForm: false,
    };

  
    handleClose = (e) => {
        if(this.props.handleChangeObjectStatusFormClose) {
            this.props.handleChangeObjectStatusFormClose();
        }
        this.setState({ 
            show: false ,
        });
    }
  
    handleShow = () => {
        this.setState({ 
            show: true 
        });
    }


    componentDidUpdate = (prevProps) => {
        if (prevProps != this.props) {
            this.setState({
                show: this.props.show,
                isShowForm: true,
            })
        }
    }

    handleChange = (e) => {
        const { name }  = e.target
        this.setState({
            [name]: e.target.value
        })
    }

    render() {

        const style = {
            input: {
                borderRadius: 0,
                borderBottom: '1 solid grey',
                borderTop: 0,
                borderLeft: 0,
                borderRight: 0,
                
            },
            deviceList: {
                maxHeight: '20rem',
                overflow: 'hidden scroll' 
            }
        }

        const { 
            title,
            selectedObjectData
        } = this.props;

        const colProps = {
            titleCol: {
                xs: 3,
                sm: 3
            },
            inputCol: {
                xs: 9,
                sm: 9,
            }
        }

        const locale = this.context

        moment.locale(locale.abbr);

        return (
            <>  
                <Modal 
                    id='confirmForm' 
                    show={this.state.show} 
                    onHide={this.handleClose} 
                    size="md"
                >
                    <Modal.Header 
                        closeButton 
                        className='font-weight-bold text-capitalize'
                    >
                        {title}
                    </Modal.Header >
                    <Modal.Body>
                        <div className='modalDeviceListGroup' style={style.deviceList}>
                            {selectedObjectData.map((item,index) => {
                                return (
                                    <div key={index} >
                                        {index > 0 ? <hr/> : null}
                                        <Row noGutters={true} className='text-capitalize'>
                                            <Col>
                                                <Row>
                                                    <Col {...colProps.titleCol}>
                                                        {locale.texts.NAME}
                                                    </Col>
                                                    <Col {...colProps.inputCol} className='text-muted pb-1'>
                                                        {item.name}
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col {...colProps.titleCol}>
                                                        {locale.texts.TYPE}
                                                    </Col>
                                                    <Col {...colProps.inputCol} className='text-muted pb-1'>
                                                        {item.type}
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col {...colProps.titleCol}>
                                                        {locale.texts.ACN}
                                                    </Col>
                                                    <Col {...colProps.inputCol} className='text-muted pb-1'>
                                                        {item.access_control_number}
                                                    </Col>
                                                </Row>
                                            </Col>
                                            {/* <Col xs={3} sm={3} className='d-flex align-items-center'>
                                                <Image src={tempImg} width={80}/>
                                            </Col> */}
                                        </Row>
                                    </div>
                                )
                            })}
                        </div>
                        <hr/>
                        <Row>
                            <Col className='d-flex justify-content-center text-capitalize'>
                                <h5>
                                    {selectedObjectData.length > 0 && locale.texts[selectedObjectData[0].status.toUpperCase()]}
                                    {selectedObjectData.length > 0 && selectedObjectData[0].status === config.objectStatus.TRANSFERRED
                                        ? ' ' + locale.texts.TO + ' ' + selectedObjectData[0].transferred_location.label
                                        : null
                                    }
                                </h5>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='d-flex justify-content-center'>
                                <h6>{moment().format('LLLL')}</h6>    
                            </Col>
                        </Row>
                        {selectedObjectData.status === config.objectStatus.RESERVE && 
                            <>
                                <hr/>
                                <Row className='d-flex justify-content-center'>
                                    <ButtonToolbar >
                                        <Button variant="outline-secondary" className='mr-2' onClick={this.handleClick}>
                                            {locale.texts.DELAY_BY}
                                        </Button>
                                    </ButtonToolbar>
                                </Row>
                            </>
                        }
                        <Formik    
                            onSubmit={({ radioGroup, select }, { setStatus, setSubmitting }) => {
                                this.props.handleConfirmFormSubmit()
                            }}

                            render={({ values, errors, status, touched, isSubmitting, setFieldValue }) => (
                                <Form>
                                    <Modal.Footer>
                                        <Button 
                                            variant="outline-secondary" 
                                            onClick={this.handleClose}
                                            className="text-capitalize"
                                        >
                                            {locale.texts.CANCEL}
                                        </Button>
                                        <Button 
                                            type="submit" 
                                            className="text-capitalize" 
                                            variant="primary" 
                                            disabled={isSubmitting}
                                        >
                                            {locale.texts.SEND}
                                        </Button>
                                    </Modal.Footer>
                                </Form>
                            )}
                        />
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}

ConfirmForm.contextType = LocaleContext;
  
export default ConfirmForm;