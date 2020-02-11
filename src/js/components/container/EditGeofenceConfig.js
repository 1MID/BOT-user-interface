import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap'
import Select from 'react-select';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DateTimePicker from './DateTimePicker'
import { AppContext } from '../../context/AppContext';
import Switcher from './Switcher'
import styleConfig from '../../styleConfig';
import LocaleContext from '../../context/LocaleContext';
import FormikFormGroup from '../presentational/FormikFormGroup'
import RadioButtonGroup from './RadioButtonGroup';
import RadioButton from '../presentational/RadioButton'

class EditGeofenceConfig extends React.Component {

    static contextType = AppContext
    
    state = {
        show: false
    }

    pathOnClickHandler = () => {
        this.props.selectedObjectData.map((item,index)=>{
            this.props.handleShowPath(item.mac_address);
        })
        this.handleClose()
    }  

    handleClose = () => {
        this.props.handleClose()
    }

    parseLbeaconsGroup = (type, index) => {
        return [...type.slice(0, index), ...type.slice(index + 1)]
    }

    transferTypeToString = (typeGroup, rssi) => {
        return [
            typeGroup.length,
            ...typeGroup,
            rssi
        ].join(',')+','        
    }
    
    render() {
        const { 
            locale,
            auth
        } = this.context

        let { 
            selectedData,
            isEdited
        } = this.props;

        let areaOptions = auth.user.areas_id
            .filter(item => {
                return this.props.areaOptions[item]
            })
            .map(item => {
                return {
                    value: this.props.areaOptions[item],
                    label: locale.texts[this.props.areaOptions[item]],
                    id: item
                }        
            })

        return (
            <Modal  
                show={this.props.show} 
                onHide={this.handleClose} 
                size="md" 
                id='EditGeofenceConfig' 
                enforceFocus={false}
            >
                <Modal.Header 
                    closeButton 
                    className='font-weight-bold text-capitalize'
                >
                    {locale.texts[this.props.title.toUpperCase().replace(/ /g, '_')]}
                </Modal.Header >
                <Modal.Body>
                    <Formik
                        initialValues = {{
                            enable: selectedData ? selectedData.enable : '',
                            name: selectedData ? selectedData.name : '',
                            area: selectedData ? selectedData.area : '',
                            start_time: selectedData ? selectedData.start_time : '',
                            end_time: selectedData ? selectedData.end_time : '',
                            p_lbeacon: selectedData ? selectedData.parsePerimeters.lbeacons : [],
                            f_lbeacon: selectedData ? selectedData.parseFences.lbeacons : [],
                            p_rssi: selectedData ? selectedData.parsePerimeters.rssi : '',
                            f_rssi: selectedData ? selectedData.parseFences.rssi : '',
                            selected_p_lbeacon: null,
                            selected_f_lbeacon: null,
                            isGlobal: selectedData ? selectedData.is_global_fence : '',
                        }}

                        validationSchema = {
                            Yup.object().shape({
                                name: Yup.string().required(locale.texts.NAME_IS_REQUIRED),   
                                p_rssi: Yup.string().required("must be negative number"),   
                                f_rssi: Yup.string().required("must be negative number"),   
                        })}

                        onSubmit={(values, { setStatus, setSubmitting }) => {
                            let monitorConfigPackage = {
                                ...values,
                                id: isEdited ? selectedData.id : '',
                                type: this.props.type,
                                perimeters: this.transferTypeToString(values.p_lbeacon, values.p_rssi),
                                fences: this.transferTypeToString(values.f_lbeacon, values.f_rssi),
                                area_id: values.area.id,
                                action: isEdited ? 'set' : 'add',
                                is_global_fence: values.isGlobal
                            }
                            this.props.handleSubmit(monitorConfigPackage)
                        }}

                        render={({ values, errors, status, touched, isSubmitting, setFieldValue }) => (
                            <Form className="text-capitalize">
                                <Row className="d-flex align-items-center">
                                    <Col>
                                        <Switcher
                                            leftLabel="on"
                                            rightLabel="off"
                                            onChange={e => {
                                                let { value }= e.target
                                                setFieldValue('enable', value)
                                            }}
                                            status={values.enable}
                                            type={this.props.type}
                                        />
                                    </Col>
                                    <Col>
                                        <FormikFormGroup 
                                            name="isGlobal"
                                            label={locale.texts.IS_GLOBAL_FENCE}
                                            errors={errors.isGlobal}
                                            touched={touched.isGlobal}
                                            placeholder=""
                                            component={() => (
                                                <RadioButtonGroup
                                                    value={parseInt(values.isGlobal)}
                                                >
                                                    <div className="d-flex justify-content-start form-group my-1">
                                                        <Field  
                                                            component={RadioButton}
                                                            name="isGlobal"
                                                            id={1}
                                                            label={locale.texts.YES}
                                                        />
                                                        <Field
                                                            component={RadioButton}
                                                            name="isGlobal"
                                                            id={0}
                                                            label={locale.texts.NO}
                                                        />
            
                                                    </div>
                                                </RadioButtonGroup>  
                                            )}
                                        /> 
                                    </Col>
                                </Row>

                                <hr/>
                                <Row noGutters>
                                    <Col>
                                        <FormikFormGroup 
                                            type="text"
                                            name="name"
                                            label={locale.texts.NAME}
                                            error={errors.name}
                                            touched={touched.name}
                                            placeholder=""
                                        />
                                    </Col>
                                    <Col>
                                        <FormikFormGroup 
                                            label={locale.texts.AREA}
                                            error={errors.area}
                                            touched={touched.area}
                                            placeholder=""
                                            component={() => (
                                                <Select
                                                    placeholder={locale.texts.SELECT_AREA}
                                                    name='area'
                                                    options={areaOptions}
                                                    value={values.area}
                                                    styles={styleConfig.reactSelect}
                                                    isDisabled={isEdited}
                                                    onChange={value => setFieldValue('area', value)}
                                                    components={{
                                                        IndicatorSeparator: () => null,
                                                    }}
                                                />
                                            )}
                                        />
                                    </Col>
                                </Row>
                                <Row noGutters>
                                    <Col>
                                        <small  className="form-text text-muted">{locale.texts.ENABLE_START_TIME}</small>
                                        <DateTimePicker
                                            value={values.start_time}
                                            getValue={value => {
                                                setFieldValue("start_time", value.value)
                                                if (parseInt(values.end_time.split(':')[0]) <= parseInt(value.value.split(':')[0])) {
                                                    let resetTime = [parseInt(value.value.split(':')[0]) + 1, values.end_time.split(':')[1]].join(':')
                                                    setFieldValue("end_time", resetTime)
                                                }
                                            }}
                                            name="start_time"
                                            start="0"
                                            end="23"
                                        />
                                    </Col>
                                    <Col>
                                        <small  className="form-text text-muted">{locale.texts.ENABLE_END_TIME}</small>
                                        <DateTimePicker
                                            value={values.end_time}
                                            getValue={value => setFieldValue("end_time", value.value)}
                                            name="end_time"
                                            start={parseInt(values.start_time.split(':')[0]) + 1}
                                            end="24"
                                        />
                                    </Col>
                                </Row>
                                <hr/>
                                <TypeGroup 
                                    type='perimeters'
                                    abbr='p'
                                    title={locale.texts.PERIMETERS_GROUP}
                                    repository={values.p_lbeacon}
                                    values={values}
                                    errors={errors}
                                    setFieldValue={setFieldValue}
                                    parseLbeaconsGroup={this.parseLbeaconsGroup}
                                    lbeaconsTable={this.props.lbeaconsTable}
                                />
                                <hr/>
                                <TypeGroup 
                                    type='fences'
                                    abbr='f'
                                    title={locale.texts.FENCES_GROUP}
                                    repository={values.f_lbeacon}
                                    values={values}
                                    errors={errors}
                                    setFieldValue={setFieldValue}
                                    parseLbeaconsGroup={this.parseLbeaconsGroup}
                                    lbeaconsTable={this.props.lbeaconsTable}
                                />

                                <Modal.Footer>
                                    <Button 
                                        variant="outline-secondary" 
                                        className="text-capitalize" 
                                        onClick={this.handleClose}
                                    >
                                        {locale.texts.CANCEL}
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        className="text-capitalize" 
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
        );
    }
}
  
export default EditGeofenceConfig;

const TypeGroup = ({
    type,
    abbr,
    title,
    repository,
    values,
    errors,
    setFieldValue,
    parseLbeaconsGroup,
    lbeaconsTable
}) => {
    const locale = React.useContext(LocaleContext);

    let lbeaconOptions = lbeaconsTable.filter(item => {
        let uuid = item.uuid.replace(/-/g, '')
        return !values.p_lbeacon.includes(uuid) &&
            !values.f_lbeacon.includes(uuid)
    }).reduce((options, item, index) => {
        let uuid = item.uuid.replace(/-/g, '')
        options.push({
            id: item.id,
            value: uuid,
            label: `${item.description}[${uuid}]`
        })
        return options
    }, [])

    let style = {
        icon: {
            minus: {
               color: 'red',
               cursor: 'pointer'
            },
            add: {
                color: 'rgb(0, 123, 255, 0.6)',
                cursor: 'pointer'
            }
        },
    }

    let typeRssi = `${abbr}_rssi`
    
    return (
        <div className="form-group">
            <small className="form-text">
                {title}
            </small>
            <FormikFormGroup 
                type="text"
                name={typeRssi}
                label={locale.texts.RSSI}
                error={errors[typeRssi]}
                touched={null}
                placeholder=""
            />
            <small className="form-text text-muted">
                UUID
            </small>
            {repository.map((item, index) => {
                return (
                    <Row noGutters className="py-1" key={index}>
                        <Col 
                            lg={1}
                            className="d-flex align-items-center justify-content-center"
                        >
                            <i 
                                className="fas fa-minus-circle"
                                style={style.icon.minus}
                                type={type}
                                name='remove'
                                value={index}
                                onClick={() => {
                                    let typeGroup = `${abbr}_lbeacon`
                                    let value = parseLbeaconsGroup(values[typeGroup], index)
                                    setFieldValue(typeGroup, value)
                                }}
                            ></i>
                        </Col>
                        <Col lg={11} className="pr-1">
                            <Field  
                                name={`p-${index + 1}-uuid`} 
                                type="text" 
                                className={'form-control' + (errors.name ? ' is-invalid' : '')} 
                                placeholder={item}
                                value={item}
                                disabled
                            />
                        </Col>
                    </Row>
                )
            })}
            <Row noGutters className="py-1">
                <Col 
                    lg={1}
                    className="d-flex align-items-center justify-content-center"
                >
                    <i 
                        className='fa fa-plus'
                        name='add'
                        style={style.icon.add}
                        type={type}
                        disabled={true}
                        onClick={(e) => {
                            let typeGroup = `${abbr}_lbeacon`
                            if (!values[`selected_${typeGroup}`]) return 
                            let group = values[typeGroup]
                            group.push(values[`selected_${typeGroup}`].value)
                            setFieldValue(typeGroup, group)
                            setFieldValue(`selected_${abbr}_lbeacon`, null)
                        }}
                    ></i>
                </Col>
                <Col lg={11} className="pr-1">
                    <Select
                        placeholder={locale.texts.SELECT_LBEACON}
                        name={`${abbr}_lbeacon`}
                        options={lbeaconOptions}
                        value={values[`selected_${abbr}_lbeacon`]}
                        styles={styleConfig.reactSelect}
                        onChange={value => setFieldValue(`selected_${abbr}_lbeacon`, value)}
                        components={{
                            IndicatorSeparator: () => null,
                        }}
                    />
                </Col>
            </Row>
        </div>
    )
} 