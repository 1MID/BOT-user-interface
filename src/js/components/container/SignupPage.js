import React from 'react';
import { Modal, Image, Row, Col } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import config from '../../config';
import LocaleContext from '../../context/LocaleContext';

class SignupPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            isSignin: false,
        }
        this.handleClose = this.handleClose.bind(this)
    }

    componentDidUpdate(preProps) {

        if (preProps != this.props)
        this.setState({
            show: this.props.show,
        })
    }

    handleClose() {
        this.props.handleSignFormClose()
        this.setState({
            show: false
        })
    }

    render() {

        const style = {
            input: {
                padding: 10
            }
        }

        const { show } = this.state;
        const locale = this.context;
        return (
            <Modal show={show} size="md" onHide={this.handleClose}>
                <Modal.Body>
                    <Row className='d-flex justify-content-center'>
                        <Image src={config.image.logo} rounded width={72} height={72} ></Image>
                    </Row>
                    <Row className='d-flex justify-content-center mb-2 mt-1'>
                        <h4 className='text-capitalize'>{locale.SIGN_UP}</h4>
                    </Row>
                    <Formik
                        initialValues = {{
                            username: '',
                            password: ''
                        }}

                        validationSchema = {
                            Yup.object().shape({
                                username: Yup.string().required('Username is required'),
                                password: Yup.string().required('Password is required')
                            })
                        }

                        onSubmit={({ username, password }, { setStatus, setSubmitting }) => {

                            this.props.signup(username, password)
                                .then(res => {
                                    if (res.data.message) {
                                        setStatus(res.data.message)
                                    } else {
                                        this.props.handleSignupFormSubmit()
                                    }
                                })
                                .catch(error => {
                                    console.log(error)
                                })
                        }}

                        render={({ errors, status, touched, isSubmitting }) => (
                            <Form>
                                <div className="form-group">
                                    {/* <label htmlFor="username">Username</label> */}
                                    <Field name="username" type="text" style={style.input} className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} placeholder='Username'/>
                                    <ErrorMessage name="username" component="div" className="invalid-feedback" />
                                </div>
                                <br/>
                                <div className="form-group">
                                    {/* <label htmlFor="password">Password</label> */}
                                    <Field name="password" type="password" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} placeholder='Password' />
                                    <ErrorMessage name="password" component="div" className="invalid-feedback" />
                                </div>
                                <br/>
                                <div className="form-group pb-1">
                                    <button type="submit" className="btn btn-primary btn-block text-capitalize"  disabled={isSubmitting}>{locale.SIGN_UP}</button>
                                </div>
                                {status &&
                                    <div className='alert alert-danger'>{status}</div>
                                }
                            </Form>
                        )}
                    />
                </Modal.Body>
            </Modal>
        )
    }
}

SignupPage.contextType = LocaleContext

export default SignupPage