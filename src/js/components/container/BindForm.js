/**
 * EditObjectForm is the Modal in ObjectManagementContainer.
 * To increase the input in this form, please add the following code
 * 1. Creat the state of the desired input name in constructor and the html content in render function
 * 2. Add the corresponding terms in handleSubmit and handleChange
 * 3. Modify the query_editObject function in queryType
 */
import React, { Component } from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import config from '../../config';
import LocaleContext from '../../context/LocaleContext';
import axios from 'axios';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import KeyboardEventHandler from 'react-keyboard-event-handler';

import { 
    getImportData,
    editImportData
} from "../../dataSrc"


class BindForm extends React.Component {
    state = {
        show: this.props.show,
        inputValue:'',
        showDetail : false,
        objectName:'',
        objectType:'',
        mac_address:'',
        alertText:'',
    };
    

    componentDidUpdate = (prevProps) => {
        if (!(_.isEqual(prevProps, this.props))) {
            this.setState({
                show: this.props.show,
            })
        }
    }
  
    handleClose = () => {
        this.props.handleCloseForm()
    }

    handleSubmit = (postOption) => {

         var pattern = new RegExp("^[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}$");
            if( this.state.mac_address.match(pattern)) 
            {
                    if (this.state.showDetail){
                        let formOption = []
                        formOption.push(this.state.inputValue)
                        formOption.push(this.state.mac_address)
                        console.log(formOption)
                        axios.post(editImportData, 
                            {
                                formOption
                            }).then(res => {
                                setTimeout(this.props.handleSubmitForm(),1000)
                            }).catch( error => {
                                console.log(error)
                            })
                    }
                    else{
                        setTimeout(this.props.handleSubmitForm(),1000)
                        alert("連結失敗，表裡沒有這個ASN");
                    }    
            } 
            else{
                setTimeout(this.props.handleSubmitForm(),1000)
                alert("連結失敗，MAC格式錯誤");
            } 
        

         this.setState({
                inputValue:'',
                showDetail : false,
                objectName:'',
                objectType:'',
                mac_address:''
        })
    }

    handleMacAddress(event){
        this.setState({mac_address : event.target.value })
    }


    updateInput(event){
     this.setState({inputValue : event.target.value })
        setTimeout(() => {
            this.handleChange()   
         }, 500);
    }


    handleChange(){
    //   console.log(this.state.inputValue)
    //   console.log(this.props.data)
    this.setState({showDetail : false}) 
        this.props.data.map(item => {
            if(item.asset_control_number == this.state.inputValue )
              this.setState({showDetail : true}) 
    })


       
   this.state.showDetail ?
        axios.post(getImportData, {
                formOption: this.state.inputValue
            }).then(res => {
                res.data.rows.map(item => {
                    this.setState({
                         objectName: item.name,
                         objectType: item.type,
                     }) 
                })
              
            }).catch( error => {
                console.log(error)
            })
        :
        null

    
    }




    render() {
        const locale = this.context

        const options = Object.keys(config.transferredLocation).map(location => {
            return {
                value: location,
                label: locale.texts[location.toUpperCase().replace(/ /g, '_')],
                options: config.transferredLocation[location].map(branch => {
                    return {
                        value: `${location},${branch}`,
                        label: locale.texts[branch.toUpperCase().replace(/ /g, '_')],

                    }
                })
            }
        })

        const areaOptions = Object.values(config.mapConfig.areaOptions).map(area => {
            return {
                value: area,
                label: locale.texts[area.toUpperCase().replace(/ /g, '_')]
            };
        })

        const style = {
            input: {
                borderRadius: 0,
                borderBottom: '1 solid grey',
                borderTop: 0,
                borderLeft: 0,
                borderRight: 0,
                
            },
            errorMessage: {
                width: '100%',
                marginTop: '0.25rem',
                marginBottom: '0.25rem',
                fontSize: '80%',
                color: '#dc3545'
            },
        }

        const { title, selectedObjectData } = this.props;
        const { 
            name,
            type
        } = selectedObjectData


     
        return (
            <Modal show={this.state.show} onHide={this.handleClose} size='md'>
                <Modal.Header closeButton className='font-weight-bold text-capitalize'>
                    {'好強好帥'}
                </Modal.Header >
                <Modal.Body>
                    <Formik                    
                        initialValues = {{
                            asset_control_number: this.state.inputValue
                        }}


                        validationSchema = {
                        //     Yup.object().shape({
                        //         asset_control_number: Yup.string().required(locale.texts.ASSET_CONTROL_NUMBER_IS_REQUIRED)
                        // })
                        null
                        }


                       
                        onSubmit={(values, { setStatus, setSubmitting }) => {
                                this.handleSubmit()
                        }}




                        render={({ values, errors, status, touched, isSubmitting, setFieldValue, submitForm }) => (
                            <Form className="text-capitalize">
                         

                                   <Field 
                                    type="text"
                                    name="asset_control_number"
                                    placeholder="Asset control number" 
                                    className={'form-control' + (errors.asset_control_number && touched.asset_control_number ? ' is-invalid' : '')} 
                                    value={this.state.inputValue}
                                     onChange={this.updateInput.bind(this)}
                                    />
                                      <ErrorMessage name="asset_control_number" component="div" className="invalid-feedback" />
                            
                                     

                                {/* { console.log(this.state.inputValue)}
                                {console.log(this.props.data)} */}
                                <hr/>

                             <div className="form-group">
                                {this.state.showDetail ? (
                                    <div className="form-group">
                                       <small id="TextIDsmall" className="form-text text-muted">你要的名稱.</small>
                                        <input type="readOnly" className="form-control" id="TextID" placeholder="名稱" disabled = {true}  value={this.state.objectName} ></input>  
                                    </div>
                                ) : (
                                  null
                                )}
                             </div>
                                    
                             <div className="form-group">
                                {this.state.showDetail ? (
                                    <div className="form-group">
                                       <small id="TextTypesmall" className="form-text text-muted">你要的類型.</small>
                                        <input type="readOnly" className="form-control" id="TextType" placeholder="類型" disabled = {true} value={this.state.objectType}></input>  
                                    </div>
                                ) : (
                                  null
                                )}
                             </div>

                        
                           

                             <div className="form-group">
                                {this.state.showDetail ? (
                                    <div className="form-group">
                                       <small id="inputMacAddresssmall" className="form-text text-muted">要綁定哪個mac_address?</small>
                                        <input type="text" className="form-control" id="MacAddress" placeholder="mac_address" value={this.state.mac_address}  onChange={this.handleMacAddress.bind(this)}></input>  
                                    </div>
                                ) : (
                                  null
                                )}
                             </div>


              
               
                                <Modal.Footer>
                                    <Button variant="outline-secondary" className="text-capitalize" onClick={this.handleClose}>
                                        {locale.texts.CANCEL}
                                    </Button>
                                    <Button 
                                        type="button" 
                                        className="text-capitalize" 
                                        variant="primary" 
                                        disabled={isSubmitting}
                                        onClick={submitForm}
                                    >
                                        {locale.texts.SAVE}
                                    </Button>
                                </Modal.Footer>

                                   
                            </Form>
                        )}
                    />
                </Modal.Body>
            </Modal>
        );
    }
}

BindForm.contextType = LocaleContext;
  
export default BindForm;