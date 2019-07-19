import React from 'react';
import { Modal, Button, Form, Row, Col, Image, ButtonToolbar} from 'react-bootstrap'
import Select from 'react-select';
import config from '../../config';
import LocaleContext from '../../context/LocaleContext';
import moment from 'moment';
import tempImg from '../../../img/doppler.jpg'
import ChangeStatusForm from './ChangeStatusForm';
import AddDeviceForm from './AddDeviceForm'

const transferredLocations = config.transferredLocation;

const options = transferredLocations.map( location => {
    let locationObj = {};
    locationObj["value"] = location;
    locationObj["label"] = location;
    return locationObj
})
  
class ConfirmForm extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            show: this.props.show,
            isShowForm: false,
            showAddDeviceForm: false,
            formOption: {
                name: '',
                type: '',
                status: '', 
                transferredLocation: null,
            },
            showNotesControl: false,
            notesText:'',
            addedDevices: []
        };


        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.addedDevice = this.addedDevice.bind(this);
        this.handleAddDeviceFormClose = this.handleAddDeviceFormClose.bind(this)
    }
  
    handleClose(e) {
        if(this.props.handleChangeObjectStatusFormClose) {
            this.props.handleChangeObjectStatusFormClose();
        }
        this.setState({ 
            show: false ,
            addedDevices: []
        });
    }
  
    handleShow() {
        this.setState({ 
            show: true 
        });
    }


    componentDidUpdate(prevProps) {
        if (prevProps != this.props) {
            this.setState({
                show: this.props.show,
                isShowForm: true,
                formOption: {
                    name: this.props.selectedObjectData.name,
                    type: this.props.selectedObjectData.type,
                    status: this.props.selectedObjectData.status,
                    transferredLocation: this.props.selectedObjectData.transferred_location ? {
                        'value' : this.props.selectedObjectData.transferred_location,
                        'label' : this.props.selectedObjectData.transferred_location
                    } : null,
                }
            })
        }
    }

    handleSubmit(e) {
        this.props.handleConfirmFormSubmit(e, this.state.addedDevices)
    }

    handleChange(e) {
        const { name }  = e.target
        this.setState({
            [name]: e.target.value
        })
    }

    handleClick(e) {
        const item = e.target.innerText;
        switch(item.toLowerCase()) {
            case 'add device':
                this.setState({
                    showAddDeviceForm: true
                })
                break;
            case 'remove device':
                console.log(item)
                break;
            case 'add notes':
            case 'hide notes':
                this.setState({
                    showNotesControl: !this.state.showNotesControl
                })
                break;

        }
    }

    addedDevice(selectedDevice) {
        this.setState({
            addedDevices: selectedDevice,
            showAddDeviceForm: false,
        })
    }

    handleAddDeviceFormClose() {
        this.setState({
            showAddDeviceForm: false
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
            notesControl: {
                display: this.state.showNotesControl ? null : 'none', 
            }
        }

        const { title } = this.props;

        const colProps = {
            titleCol: {
                xs: 5,
                sm: 5
            },
            inputCol: {
                xs: 7,
                sm: 7,
            }
        }

        return (
            <>  
                <Modal show={this.state.show} onHide={this.handleClose} size="md">
                    <Modal.Header closeButton className='font-weight-bold'>{title}</Modal.Header >
                    <Modal.Body>
                        <Form >
                            <Row>
                                <Col xs={12} sm={8}>
                                    <Row>
                                        <Col {...colProps.titleCol}>
                                            Device Type
                                        </Col>
                                        <Col {...colProps.inputCol} className='text-muted pb-1'>
                                            {this.props.selectedObjectData.type}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col {...colProps.titleCol}>
                                            Device Name
                                        </Col>
                                        <Col {...colProps.inputCol} className='text-muted pb-1'>
                                            {this.props.selectedObjectData.name}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col {...colProps.titleCol}>
                                            ACN
                                        </Col>
                                        <Col {...colProps.inputCol} className='text-muted pb-1'>
                                            {this.props.selectedObjectData.access_control_number}
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={12} sm={4} className='d-flex align-items-center'>
                                    <Image src={tempImg} width={60}/>
                                </Col>
                            </Row>
                            {this.state.addedDevices.length !== 0 
                                ? 
                                    this.state.addedDevices.map((item,index) => {
                                        return (
                                            <>
                                                <hr/>
                                                <Row >
                                                    <Col xs={12} sm={10}>
                                                        <Row>
                                                            <Col {...colProps.titleCol}>
                                                                Device Type
                                                            </Col>
                                                            <Col {...colProps.inputCol} className='text-muted pb-1'>
                                                                {item.type}
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col {...colProps.titleCol}>
                                                                Device Name
                                                            </Col>
                                                            <Col {...colProps.inputCol} className='text-muted pb-1'>
                                                                {item.name}
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col {...colProps.titleCol}>
                                                                ACN
                                                            </Col>
                                                            <Col {...colProps.inputCol} className='text-muted pb-1'>
                                                                {item.access_control_number}
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    <Col xs={12} sm={2} className='d-flex align-items-center'>
                                                        <Image src={tempImg} width={60}/>
                                                    </Col>
                                                </Row>
                                            </>
                                        )
                                    })   
                                : null
                            }
                        </Form>
                        
                        <hr/>
                        <Row>
                            <Col className='d-flex justify-content-center text-capitalize'>
                                <h5>{this.props.selectedObjectData.status}
                                    {this.props.selectedObjectData.status === 'Transferred' 
                                        ? '  to  ' + this.props.selectedObjectData.transferredLocation.value 
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
                        {this.props.selectedObjectData.status === 'Transferred' && 
                            <>
                                <hr/>
                                <Row className='d-flex justify-content-center'>
                                    <ButtonToolbar >
                                        <Button variant="outline-secondary" className='mr-2' onClick={this.handleClick}>Add Device</Button>
                                        <Button variant="outline-secondary" className='mr-2' onClick={this.handleClick}>Remove Device</Button>
                                        <Button variant="outline-secondary" className='mr-2' onClick={this.handleClick}>
                                            {this.state.showNotesControl ? 'Add Notes' : 'Hide Notes'}
                                        </Button>
                                    </ButtonToolbar>
                                </Row>
                            </>
                        }

                        <Form style={style.notesControl}>
                        <hr/>
                            <Form.Group controlId="exampleForm.ControlTextarea1">
                                <Form.Control 
                                    as="textarea" 
                                    rows="3" 
                                    placeholder='notes...' 
                                    value={this.state.notesText}
                                    name='notesText'
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={this.handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.handleSubmit}>
                            Send
                        </Button>
                    </Modal.Footer>
                </Modal>
                <AddDeviceForm
                    show={this.state.showAddDeviceForm}  
                    title='Add device' 
                    searchableObjectData={this.props.searchableObjectData}
                    addedDevice={this.addedDevice}
                    handleAddDeviceFormClose={this.handleAddDeviceFormClose}
                    searchResult={this.props.searchResult}
                    selectedObjectData={this.props.selectedObjectData}
                />
            </>
        );
    }
}

ConfirmForm.contextType = LocaleContext;
  
export default ConfirmForm;