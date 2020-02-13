import React from 'react';
import AuthenticationContext from './context/AuthenticationContext';
import Cookies from 'js-cookie';
import axios from 'axios';
import dataSrc from './dataSrc';
import config from './config';
import { locale } from 'moment';

let defaultUser = {
    roles: "guest",
    areas_id: [config.mapConfig.defaultAreaId.toString()],
    permissions:[
        "form:view",
    ],
    locale: config.locale.defaultLocale,
}

class Auth extends React.Component {

    state = {
        authenticated: Cookies.get('authenticated') ? true : false,
        user: Cookies.get('user') ? {...JSON.parse(Cookies.get('user'))} : defaultUser,
        accessToken: ""
    }

    signin = (userInfo) => {
        Cookies.set('authenticated', true)
        Cookies.set('user', userInfo)
        this.setState({
            authenticated: true,
            user: userInfo
        })
    };
  
    signout = () => {
        Cookies.remove('authenticated')
        Cookies.remove('user')
        this.setState({
            authenticated: false,
            user: defaultUser,
            accessToken: ""
        });
    };

    async signup (values) {
        let { 
            name, 
            password, 
            roles, 
            area, 
        } = values

        return await axios.post(dataSrc.signup, {
            name: name.toLowerCase(),
            password,
            roles,
            area_id: config.mapConfig.areaModules[area].id,
        })
    }

    async setUser (values) {
        return await axios.post(dataSrc.setUserRole, {
            name: values.name,
            ...values
        })
    }
  
    handleAuthentication = () => {
    };
  
    setSession(authResult) {
    }

    setCookies(key, value) {
        Cookies.set(key, value)
    }

    setSearchHistory = (searchHistory) => {
        let userInfo = {
            ...this.state.user,
            searchHistory,
        }
        this.setCookies('user', userInfo)
        this.setState({
            ...this.state,
            user: {
                ...this.state.user,
                searchHistory,
            }
        })
    } 

    setMyDevice = (myDevice) => {
        this.setState({
            ...this.state,
            user: {
                ...this.state.user,
                myDevice
            }
        })
    }

    setUserInfo = (status, value) =>{
        this.setState({
            ...this.state,
            user: {
                ...this.state.user,
                [status]: value,
            }
        })
        this.setCookies('user', {
                ...this.state.user,
                [status]: value,
            })
    }

    render() {
        const authProviderValue = {
            ...this.state,
            signin: this.signin,
            signup: this.signup,
            signout: this.signout,
            handleAuthentication: this.handleAuthentication,
            setSearchHistory: this.setSearchHistory,
            setMyDevice: this.setMyDevice,
            setUserInfo: this.setUserInfo,
            setCookies: this.setCookies,
            setUser: this.setUser
        };

        return (
            <AuthenticationContext.Provider value={authProviderValue}>
                {this.props.children}
            </AuthenticationContext.Provider>
        );
      }
}

export default Auth;