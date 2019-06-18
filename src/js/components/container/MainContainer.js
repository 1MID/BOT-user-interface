/** React Plugin */
import React from 'react';

/** Import Container Component */
import ObjectManagementContainer from './ObjectManagementContainer';
import SearchContainer from './SearchContainer';

/** Import Presentational Component */
import dataSrc from '../../dataSrc'
import axios from 'axios';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import ModalForm from './ModalForm';
import Navs from '../presentational/Navs'


import { Row, Col, Hidden, Visible } from 'react-grid-system';
import SurveillanceContainer from './SurveillanceContainer';

export default class ContentContainer extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            trackingData: [],
            trackingColunm: [],
            hasSearchKey: false,
            searchableObjectData: null,
            searchResult: [],
        }

        this.transferSearchableObjectData = this.transferSearchableObjectData.bind(this)
        this.transferSearchResultFromSearchToMap = this.transferSearchResultFromSearchToMap.bind(this);
    }



    transferSearchableObjectData(processedData){
        this.setState({
            searchableObjectData: processedData
        })
    }

    transferSearchResultFromSearchToMap(searchResult) {
        this.setState({
            hasSearchKey: true,
            searchResult: searchResult,
        })
    }

    
    render(){

        const { hasSearchKey, searchResult, searchableObjectData } = this.state;

        const style = {
            container: {
                // height: '100vh'
            }
        }
        return(

            /** "page-wrap" the default id named by react-burget-menu */
            <div id="page-wrap" className='' style={style.container}>
                <Row className='d-flex w-100 justify-content-around mx-0'>
                    <Col xl={8} >
                        <Hidden xs sm md lg>
                            <br/>
                            <SurveillanceContainer 
                                hasSearchKey={hasSearchKey} 
                                searchResult={searchResult}
                                transferSearchableObjectData={this.transferSearchableObjectData}
                            />
                        </Hidden>
                    </Col>

                    <Col xs={12} sm={12} md={12} xl={4} className="w-100">
                        <SearchContainer 
                            searchableObjectData={searchableObjectData} 
                            transferSearchResultFromSearchToMap={this.transferSearchResultFromSearchToMap}
                        />
                    </Col>
                </Row>
            </div>
            
        )
    }
}