import React from 'react';
import Searchbar from '../presentational/Searchbar';
import { Col, Row, Nav, ListGroup} from 'react-bootstrap'

import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

import SearchableObjectType from '../presentational/SeachableObjectType';
import FrequentSearch from './FrequentSearch';

class SearchContainer extends React.Component {

    constructor(){
        super()
        this.state = {
            sectionIndexList:['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
            isShowSectionTitle: false,
            hasSearchKey: false,
            isShowSearchOption: false,
            searchKey:'',
            sectionTitleList: [],
            sectionIndex:'',
            searchResult: [],
            hasSearchableObjectData: false,
            notFoundList: [],
        }
    
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
        
        this.getObjectType = this.getObjectType.bind(this);
        this.getResultData = this.getResultData.bind(this);
    }

    

    componentDidMount() {
        const targetElement = document.body;
        document.body.style.position = "fixed";

        // disableBodyScroll(targetElement);
    }

    componentDidUpdate(prepProps) {
        if (this.props.searchableObjectData != null && this.state.hasSearchableObjectData === false) {
            this.getObjectType();
            this.setState({
                hasSearchableObjectData: true,
            })
        }
        if (prepProps.hasSearchKey !== this.props.hasSearchKey) {
            this.setState({
                hasSearchKey: this.props.hasSearchKey,
            })
        }

    }

    // shouldComponentUpdate(nextProps, nextState){
    //     console.log(this.props.searchableObjectData)
    //     return this.state !== nextState;
    // }

    // componentWillUnmount() {
    //     clearAllBodyScrollLocks();
    // }


    /**
     * Get the searchable object type. 
     * The data is retrieving from Surveillance -> MainContain -> SearchContainer
     */
    getObjectType() {
        const titleElementStyle = {
            background: 'rgba(227, 222, 222, 0.619)',
            fontWeight: 'bold',
            fontSize: 10,
            padding: 5,
        }

        const itemElementStyle = {
            padding: 5
        }
        

        /** Creat a set that stands for the unique object in this searching area */
        const { searchableObjectData } = this.props;
        
        let objectTypeSet = new Set();
        let objectTypeMap = new Map();
        
        for (let object in searchableObjectData) {
            objectTypeSet.add(searchableObjectData[object].type)
        }

        /** Creat the titleList by inserting the item in the objectTypeSet
         *  Also, create the character title element
         */
        let sectionTitleList = [];
        let groupLetter = '';
        let elementIndex = 0;

        Array.from(objectTypeSet).map( item => {
            // let currentLetter = item.toUpperCase().slice(0,1);
            let currentLetter = item ? item.toUpperCase().charAt(0) : item;
            if(!(groupLetter === currentLetter)) {
                groupLetter = currentLetter;
                let titleElement = <a id={groupLetter} key={elementIndex} className='titleElementStyle'><ListGroup.Item style={titleElementStyle}>{groupLetter}</ListGroup.Item></a>;
                sectionTitleList.push(titleElement)
                elementIndex++;
            }
            let itemElement = <a onClick={this.getResultData} key={elementIndex}><ListGroup.Item action style={itemElementStyle} >{item}</ListGroup.Item></a>;
            sectionTitleList.push(itemElement);
            elementIndex++;
        })
        this.setState({
            sectionTitleList: sectionTitleList,
        })
    }

 

    /**
     * Handle the cursor hover events in device that can use mouse.
     */
    handleMouseOver(e) {
        // document.getElementById('sectionTitle').display = null;
        // document.getElementById(e.target.innerText).scrollIntoView({behavior: "instant", block: "start", inline: "nearest"})
        location.href = '#' + e.target.innerText;
        this.setState({
            isShowSectionTitle: true,
            sectionIndex: e.target.innerText,
        })
    }

    /**
     * Handle the touch start events in mobile device
     */
    handleTouchStart(e) { 
        if (e.target.classList.contains("sectionIndexItem")) {
            location.href = '#' + sectionIndex;
        }
        this.setState({
            isShowSectionTitle: true,
            sectionIndex: e.target.innerText,
        })
    }

    /**
     * Handle the touch move events in mobile device
     */
    handleTouchMove(e) { 
        
        const pageX = e.changedTouches[0].pageX;
        const pageY = e.changedTouches[0].pageY;
        const element = document.elementFromPoint(pageX, pageY);

        if (element.classList.contains("sectionIndexItem")) {
            // document.getElementById('sectionTitle').display = null;
            // document.getElementById(element.innerText).scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
            location.href = '#' + element.innerText;
            this.setState({
                isShowSectionTitle: true,
                sectionIndex: element.innerText,
            })
        }
    }

    /**
     * Fired once the user click the item in object type list or in frequent seaerch
     * Also, popout the searchResult component.
     */
    getResultData(e) {
        let isMydevice = false;
        var searchType = '';
        if (typeof e === 'string') {
            if(e === '') {
                return;
            } 
            var searchKey = e
        } else if (e.target) {
            var searchKey = e.target.innerText;
        } else {
            isMydevice = true;
            var searchKey = e;

            /** The variable is to check the unfound object */
            var duplicatedSearchKey = new Set(searchKey)
        }

        /** this.props.searchableObjectData data path: Surveillance -> SurveillanceContainer -> MainContainer -> SearchContainer  */
        const searchableObjectData = this.props.searchableObjectData;

        let searchResult = [];
        let notFoundList = [];
        for (let object in searchableObjectData) {
            if (isMydevice) {
                if (searchKey.has(searchableObjectData[object].access_control_number)) {
                    // if (searchableObjectData[object].status.toLowerCase() !== 'normal') {
                    //     notFoundList.push(searchableObjectData[object])
                    // } else {
                        searchResult.push(searchableObjectData[object])
                        // duplicatedSearchKey.delete(searchableObjectData[object].access_control_number)
                    // }
                }
            } else if (searchableObjectData[object].type == searchKey) {
                searchResult.push(searchableObjectData[object])
            } else if (searchableObjectData[object].type.toLowerCase().indexOf(searchKey.toLowerCase()) === 0){
                searchResult.push(searchableObjectData[object])
            }
        }

        this.setState({
            hasSearchKey: true,
            searchKey: searchKey,
            searchResult: searchResult,
            notFoundList: notFoundList
        })

        /** Transfer the searched object data from SearchContainer to MainContainer */
        this.props.transferSearchResult(searchResult, null)
    }

    render() {
        /** Customized CSS of searchResult */
        const searchOptionStyle = {
            display: this.state.hasSearchKey ? 'none' : null,
        }

        // const { searchResult, searchKey, sectionIndexList, sectionIndex, isShowSectionTitle } = this.state;
        const { trackingData, searchableObjectData, transferSearchResult } = this.props
        
        return (
            <div id='searchContainer' className="" onTouchMove={this.handleTouchMove}>
                <div id='searchBar' className='d-flex justify-content-center align-items-center pt-4 pb-2'>
                    <Searchbar 
                        placeholder={this.state.searchKey}
                        getResultData={this.getResultData}    
                    />
                    
                </div>

                <div id='searchOption' className='pt-2'>
                    
                        <FrequentSearch 
                            searchableObjectData={searchableObjectData}
                            getResultData={this.getResultData}  
                            transferSearchResult={transferSearchResult}  
                            getResultData={this.getResultData}    
                        />
                        {/* <Col id='searchableObjectType' md={6} sm={6} xs={6} className='px-0'>
                            <h6 className="font-weight-bold">{}</h6>
                            <SearchableObjectType 
                                sectionTitleList={this.state.sectionTitleList} 
                                sectionIndexList={this.state.sectionIndexList} 
                                sectionIndex={this.state.sectionIndex} 
                                handleMouseOver={this.handleMouseOver} 
                                handleTouchStart={this.handleTouchStart} 
                                handleTouchMove={this.handleTouchMove} 
                                isShowSectionTitle={this.state.isShowSectionTitle}
                                clientHeight={this.state.clientHeight}
                            />
                        </Col> */}
                    
                </div>

            </div>
        );
    }
}


export default SearchContainer;