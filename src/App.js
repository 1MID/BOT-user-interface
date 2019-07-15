import React from 'react';

/** Container Component */
import { BrowserRouter as Router,Switch, Route,  } from "react-router-dom";
import NavbarContainer from './js/components/presentational/NavbarContainer'
import { matchRoutes,renderRoutes } from 'react-router-config';
import routes from './js/routes';
import locale from './js/locale';
import LocaleContext from './js/context/LocaleContext';
import config from './js/config';
import Axios from 'axios';
import dataSrc from './js/dataSrc';
import { 
    retrieveTrackingData,
    retrieveObjectTable
} from './js/action/action';
import { connect } from 'react-redux';

class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = { 
            locale: locale.changeLocale(config.locale.defaultLocale),
            shouldTrackingDataUpdate: props.shouldTrackingDataUpdate
        }
        this.handleChangeLocale = this.handleChangeLocale.bind(this);
        this.getTrackingData = this.getTrackingData.bind(this);
    }

    handleChangeLocale(changedLocale){
        this.setState({
            locale: locale.changeLocale(changedLocale)
        })
    }

    componentDidMount() {
        this.getObjectTable()
        this.props.shouldTrackingDataUpdate ? this.getTrackingData() : null;
        this.interval = this.props.shouldTrackingDataUpdate ? setInterval(this.getTrackingData, config.surveillanceMap.intevalTime) : null;
    }

    componentDidUpdate(prepProps) {
        if (prepProps.shouldTrackingDataUpdate !== this.props.shouldTrackingDataUpdate) {
            this.interval = this.props.shouldTrackingDataUpdate ? setInterval(this.getTrackingData, config.surveillanceMap.intevalTime) : null;
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }
    
    getTrackingData() {

        const locationAccuracyMapToDefault = config.surveillanceMap.locationAccuracyMapToDefault;
        const locationAccuracyMapToDB =  config.surveillanceMap.locationAccuracyMapToDB;

        Axios.post(dataSrc.getTrackingData, {
            accuracyValue: this.props.locationAccuracy,
            locationAccuracyMapToDefault,
            locationAccuracyMapToDB,
        }).then(res => {
            this.props.retrieveTrackingData(res.data)
        })
        .catch(error => {
            console.log(error)
        })
    }

    getObjectTable() {
        Axios.get(dataSrc.getObjectTable).then(res => {
            this.props.retrieveObjectTable(res.data)
        }).catch(err => {
            console.log(err)
        })
    }

    render() { 
        const { locale } = this.state;
        return (
            <LocaleContext.Provider value={locale}>
                <Router>         
                    <NavbarContainer changeLocale={this.handleChangeLocale} locale={locale} trackingData={this.retrievingTrackingData}/>
                    <Switch>
                        {renderRoutes(routes)}
                    </Switch>
                </Router>
            </LocaleContext.Provider>
        );
    }  
};

const mapStateToProps = (state) => {
    return {
        shouldTrackingDataUpdate: state.retrieveTrackingData.shouldTrackingDataUpdate,
        locationAccuracy: state.retrieveTrackingData.locationAccuracy
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        retrieveTrackingData: object => dispatch(retrieveTrackingData(object)),
        retrieveObjectTable: objectArray => dispatch(retrieveObjectTable(objectArray))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)



