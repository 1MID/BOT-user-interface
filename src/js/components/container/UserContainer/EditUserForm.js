import React from 'react';
import { 
    Modal, 
    Row, 
    Col,
    Button, 
} from 'react-bootstrap';
import { 
    Formik, 
    Field, 
    Form, 
} from 'formik';
import Select from 'react-select';
import * as Yup from 'yup';
import config from '../../../config';
import axios from 'axios';
import dataSrc from '../../../dataSrc';
import CheckboxGroup from '../CheckboxGroup'
import Checkbox from '../../presentational/Checkbox'
import FormikFormGroup from '../../presentational/FormikFormGroup'
import styleConfig from '../../../styleConfig';
import LocaleContext from '../../../context/LocaleContext';

const EditUserForm = ({
    show,
    title,
    selectedUser,
    handleSubmit,
    handleClose,
    roleName
}) => {

    let locale = React.useContext(LocaleContext)

    const areaOptions = Object.values(config.mapConfig.areaOptions).map(name => {
        return {
            value: name,
            label: locale.texts[name.toUpperCase().replace(/ /g, '_')]
        };
    })

    return (
        <Modal 
            show={show} 
            size="sm" 
            onHide={handleClose}
            className='text-capitalize'
        >
            <Modal.Header 
                closeButton 
            >
                {locale.texts[title.toUpperCase().replace(/ /g, '_')]}
            </Modal.Header >
            <Modal.Body>
                <Formik                    
                    initialValues = {{
                        name: selectedUser ? selectedUser.name : '',
                        password: '',
                        roles: selectedUser ? selectedUser.role_type : config.defaultRole,
                        area: '',
                    }}

                    validationSchema = {
                        Yup.object().shape({
                            name: Yup.string()
                                .required(locale.texts.USERNAME_IS_REQUIRED)
                                .test({
                                    name: 'name', 
                                    message: locale.texts.THE_USERNAME_IS_ALREADY_TAKEN,
                                    test: value => {
                                        return value !== undefined && new Promise((resolve, reject) => {
                                            axios.post(dataSrc.validateUsername, {
                                                name: value.toLowerCase()
                                            })
                                            .then(res => {
                                                resolve(res.data.precheck)
                                            })
                                            .catch(err => {
                                                console.log(err)
                                            })
                                        })
                                    },
                                })
                                .max(100),
                            area: Yup.string().required(locale.texts.AREA_IS_REQUIRED),
                            password: selectedUser ? '' : Yup.string().required(locale.texts.PASSWORD_IS_REQUIRED),
                        })
                    }

                    onSubmit={(values, { setStatus, setSubmitting }) => {
                        handleSubmit(values)
                    }}

                    render={({ values, errors, status, touched, isSubmitting, setFieldValue }) => (
                        <Form className="text-capitalize">
                            <FormikFormGroup 
                                type="text"
                                name="name"
                                label={locale.texts.NAME}
                                error={errors.name}
                                touched={touched.name}
                                placeholder={locale.texts.USERNAME}
                                
                            />
                            <FormikFormGroup 
                                type="text"
                                name="password"
                                label={locale.texts.PASSWORD}
                                error={errors.password}
                                touched={touched.password}
                                placeholder={locale.texts.PASSWORD}
                                display={!selectedUser}
                            />
                            <hr/>
                            <FormikFormGroup 
                                name="roles"
                                label={locale.texts.ROLES}
                                error={errors.roles}
                                touched={touched.roles}
                                component={() => (
                                    <CheckboxGroup
                                        id="roles"
                                        value={values.roles}
                                        onChange={setFieldValue}                                            
                                    >
                                        {roleName
                                            .filter(roleName => roleName.name !== 'guest' && roleName.name !== 'dev')
                                            .map((roleName, index) => {
                                                return (
                                                    <Field
                                                        component={Checkbox}
                                                        key={index}
                                                        name="roles"
                                                        id={roleName.name}
                                                        label={locale.texts[roleName.name.toUpperCase()]}
                                                    />
                                                )
                                        })}
                                    </CheckboxGroup>
                                )}
                            />
                            <hr/>
                            <FormikFormGroup 
                                type="text"
                                name="area"
                                label={locale.texts.AUTH_AREA}
                                error={errors.area}
                                touched={touched.area}
                                placeholder={locale.texts.USERNAME}
                                component={() => (
                                    <Select
                                        placeholder = {locale.texts.SELECT_AREA}
                                        name="area"
                                        value = {values.area.value}
                                        onChange={value => setFieldValue("area", value.value)}
                                        options={areaOptions}
                                        styles={styleConfig.reactSelect}
                                        components={{
                                            IndicatorSeparator: () => null
                                        }}
                                    />
                                )}
                            />
                            <Modal.Footer>
                                <Button 
                                    variant="outline-secondary" 
                                    onClick={handleClose}
                                >
                                    {locale.texts.CANCEL}
                                </Button>
                                <Button 
                                    type="submit" 
                                    variant="primary" 
                                    disabled={isSubmitting}
                                >
                                    {locale.texts.SAVE}
                                </Button>
                            </Modal.Footer>
                        </Form>
                    )}
                />
            </Modal.Body>
        </Modal>
    )
}

export default EditUserForm