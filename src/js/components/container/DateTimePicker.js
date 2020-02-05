
import React from 'react';
import Select from 'react-select';
import { AppContext } from '../../context/AppContext';
import styleConfig from "../../styleConfig"

class DateTimePicker extends React.Component {

    static contextType = AppContext

    state = {
        length: 24,
    }

    onChange = (value) => {
        let id = this.props.id
        this.props.getValue(value, this.props.name, id)
    }

    render() {

        let options = Array.from(Array(this.state.length + 1).keys())
            .filter(index => {
                return index >= parseInt(this.props.start) && index <= parseInt(this.props.end)
            })
            .map(index => {
                return {
                    value: `${index}:00`,
                    label: `${index}:00`
                }
            })
        let defaultValue = {
            value: this.props.value,
            label: this.props.value
        }

        return (
            <Select
                name="timepicker"
                value={defaultValue}
                onChange={value => this.onChange(value)}
                options={options}
                isSearchable={false}
                styles={styleConfig.reactSelect}
                controlHeigh={20}
                components={{
                    IndicatorSeparator: () => null
                }}
            />
        )
    }
}

export default DateTimePicker;