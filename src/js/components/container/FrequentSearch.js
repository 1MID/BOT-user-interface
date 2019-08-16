import React  from 'react';
import { Col, ListGroup, Row, Button } from 'react-bootstrap';
import LocaleContext from '../../context/LocaleContext';
import axios from 'axios';
import dataSrc from '../../dataSrc';
import { connect } from 'react-redux';
import { shouldUpdateTrackingData } from '../../action/action';
import config from '../../config';
import AuthenticationContext from '../../context/AuthenticationContext';


class FrequentSearch extends React.Component {
    

    constructor(){
        super()
        this.state = {
            searchKey: '',
        }

        this.handleClick = this.handleClick.bind(this);
        this.getSearchKey = this.getSearchKey.bind(this);
    }

    componentDidUpdate(prepProps) {
        if (prepProps.clearSearchResult !== this.props.clearSearchResult && !prepProps.clearSearchResult) {
            this.setState({
                searchKey: '',
            })
        }
        if (prepProps.hasGridButton !== this.props.hasGridButton && this.props.hasGridButton) {
            this.setState({
                searchKey: ''
            })
        }
    }

    handleClick(e) {
        const itemName = e.target.name.toLowerCase();
        this.getSearchKey(itemName)
    }

    getSearchKey(itemName) {
        this.props.getSearchKey(itemName)
        this.setState({
            searchKey: itemName
        })
    }

    render() {
        const style = {
            titleText: {
                color: 'rgb(80, 80, 80, 1)'
            }, 
        }

        const locale = this.context


        return (
            <AuthenticationContext.Consumer className="text-capitalize">
                {auth => (
                    <>
                        <Row className='d-flex justify-content-center' style={style.titleText}>
                            <h4 className='text-capitalize'>{locale.FREQUENT_SEARCH}</h4>
                        </Row>
                        <div className='d-inline-flex flex-column mb-3' id='frequentSearch' >
                            {auth.authenticated && auth.user.searchHistory
                                && auth.user.searchHistory.filter( (item,index) => {
                                return item.name !== 'All' && index < config.userPreference.searchHistoryNumber
                            }).map( (item, index) => {
                                
                                return (
                                    <Button
                                        variant="outline-custom"
                                        onClick={this.handleClick} 
                                        active={this.state.searchKey === item.name.toLowerCase()} 
                                        key={index}
                                        name={item.name}
                                        className="text-capitalize"
                                    >
                                        {item.name}
                                    </Button>
                                )
                            })}
                            &nbsp;
                            {auth.authenticated && auth.user.myDevice &&
                                <Button
                                    variant="outline-custom"
                                    onClick={this.handleClick} 
                                    active={this.state.searchKey === 'my devices'}
                                    name='my devices'
                                >
                                    {locale.MY_DEVICE}
                                </Button>
                            }
                                <Button 
                                    variant="outline-custom"
                                    onClick={this.handleClick} 
                                    active={this.state.searchKey === 'all devices'}
                                    name='all devices'
                                >
                                    {locale.ALL_DEVICE}
                                </Button>
                        </div>
                    </>
                )}
            </AuthenticationContext.Consumer>
        )
    }
}

FrequentSearch.contextType = LocaleContext;

const mapDispatchToProps = (dispatch) => {
    return {
        shouldUpdateTrackingData: value => dispatch(shouldUpdateTrackingData(value))
    }
}

export default connect(null, mapDispatchToProps)(FrequentSearch);