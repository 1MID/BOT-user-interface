import React from "react";
import Map from "../presentational/Map";
import { 
    Nav, 
    Button,
    ButtonGroup
}  from "react-bootstrap";
import PdfDownloadForm from "./PdfDownloadForm"
import config from "../../config";
import AccessControl from "../presentational/AccessControl"
import { AppContext } from "../../context/AppContext";
import { 
    BrowserView, 
    TabletView, 
    MobileOnlyView, 
} from "react-device-detect";
import QRcodeContainer from './QRcode'
import InfoPrompt from '../presentational/InfoPrompt'
import GeneralConfirmForm from '../presentational/GeneralConfirmForm'

class SurveillanceContainer extends React.Component {

    static contextType = AppContext

    state = {
        showPdfDownloadForm: false,
        showConfirmForm: false,
    }

    handleConfirmFormSubmit = (e) => {
        this.props.setMonitor(this.state.type)
        this.handleCloseModal()
    }

    handleClickButton = (e) => {
        const { name, value } = e.target
        switch(name) {
            case "clear":
                this.props.handleClearButton();
                break;
            case "save":
                this.setState({
                    showPdfDownloadForm: true,
                })
                break;
                
            case "geofence":
                this.setState({
                    showConfirmForm: true,
                    type: name
                })
                break;
            case "location":
                this.setState({
                    showConfirmForm: true,
                    type: name
                })
                break;
            case "clearAlerts":
                this.props.clearAlerts()
                break;
            case "searchedObjectType":
                this.props.setShowedObjects(value)
                break;
            case "cleanPath":
                this.props.handleClosePath();
                break;
        }
    }

    handleCloseModal = () => {
        this.setState({
            showPdfDownloadForm: false,
            showConfirmForm: false
        })
    }

    render(){
        const style = {
            title: {
                color: "grey",
                fontSize: "1rem",
                maxWidth: "9rem",
                height: "5rem",
                lineHeight: "3rem"
            },
            mapForMobile: {
                // width: '90vw',
                border: "solid 2px rgba(227, 222, 222, 0.619)",
                padding: "5px",
            },
            mapBlock: {
                border: "solid 2px rgba(227, 222, 222, 0.619)",
                padding: "5px",
            },
            MapAndQrcode: {
                height: '42vh'
            },
            qrBlock: {
                width: '10vw',
            },
            mapBlockForTablet: {
                border: "solid 2px rgba(227, 222, 222, 0.619)",
                padding: "5px",
                width: '60vw'
            },
            button: {
                fontSize: "0.8rem"
            }
        }
        const { 
            locale,
            stateReducer,
            auth
        } = this.context;

        const { 
            hasSearchKey,
            geofenceConfig,
            locationMonitorConfig,
            searchedObjectType,
            showedObjects
        } = this.props;

        let [{areaId}] = stateReducer
        return(
            <div>
                <BrowserView>
                    <div id="surveillanceContainer" style={style.surveillanceContainer} className="overflow-hidden">
                        <div style={style.mapBlock}>
                            <Map
                                pathMacAddress={this.props.pathMacAddress}
                                hasSearchKey={hasSearchKey}
                                colorPanel={this.props.colorPanel}
                                proccessedTrackingData={this.props.proccessedTrackingData}
                                lbeaconPosition={this.props.lbeaconPosition}
                                geofenceConfig={this.props.geofenceConfig}
                                locationMonitorConfig={this.props.locationMonitorConfig}
                                getSearchKey={this.props.getSearchKey}
                                areaId={areaId}
                                searchedObjectType={this.props.showedObjects}
                                mapConfig={config.mapConfig}
                                pathData={this.state.pathData}
                                handleClosePath={this.props.handleClosePath}
                                handleShowPath={this.props.handleShowPath}
                                showPath={this.props.showPath}
                            />
                        </div>
                        <div>
                            <Nav className="d-flex align-items-start text-capitalize bd-highlight">
                                <Nav.Item className="mt-2">
                                    <Button 
                                        variant="outline-primary" 
                                        className="mr-1 ml-2 text-capitalize" 
                                        onClick={this.handleClickButton} 
                                        name="clear"
                                        disabled={!this.props.hasSearchKey}
                                    >
                                        {locale.texts.CLEAR}
                                    </Button>
                                </Nav.Item>
                                <AccessControl
                                    permission={"user:saveSearchRecord"}
                                    renderNoAccess={() => null}
                                >
                                    <Nav.Item className="mt-2">
                                        <Button 
                                            variant="outline-primary" 
                                            className="mr-1 ml-2 text-capitalize" 
                                            onClick={this.handleClickButton} 
                                            name="save"
                                            disabled={!this.props.hasSearchKey || this.state.showPdfDownloadForm}
                                        >
                                            {locale.texts.SAVE}
                                        </Button>
                                    </Nav.Item>
                                </AccessControl>
                                <AccessControl
                                    permission={"user:toggleShowDevices"}
                                    renderNoAccess={() => null}
                                >
                                    <Nav.Item className="mt-2">
                                        <Button 
                                            variant="primary" 
                                            className="mr-1 ml-2 text-capitalize" 
                                            onClick={this.handleClickButton} 
                                            name="searchedObjectType"
                                            value={[-1, 0]}
                                            active={(this.props.showedObjects.includes(0) || this.props.showedObjects.includes(-1)) }
                                            disabled={
                                                !(searchedObjectType.includes(-1) ||
                                                searchedObjectType.includes(0))
                                            }
                                        >
                                            {!(showedObjects.includes(0) || showedObjects.includes(-1)) 
                                                ?   locale.texts.SHOW_DEVICES 
                                                :   locale.texts.HIDE_DEVICES 
                                            }
                                        </Button>
                                    </Nav.Item>
                                </AccessControl>
                                <AccessControl
                                    permission={"user:toggleShowResidents"}
                                    renderNoAccess={() => null}
                                >
                                    <Nav.Item className="mt-2">
                                        <Button 
                                            variant="primary" 
                                            className="mr-1 ml-2 text-capitalize" 
                                            onClick={this.handleClickButton} 
                                            name="searchedObjectType"
                                            value={[-2, 1, 2]}
                                            active={(this.props.showedObjects.includes(1) || this.props.showedObjects.includes(2))}
                                            disabled={
                                                !(searchedObjectType.includes(1) ||
                                                searchedObjectType.includes(2))
                                            }
                                        >
                                            {!(showedObjects.includes(1) || showedObjects.includes(2)) 
                                                ?   locale.texts.SHOW_RESIDENTS
                                                :   locale.texts.HIDE_RESIDENTS 
                                            }
                                        </Button>
                                    </Nav.Item>
                                </AccessControl>

                                {process.env.IS_TRACKING_PATH_ON == 1 && 
                                    <AccessControl
                                        permission={"user:cleanPath"}
                                        renderNoAccess={()=>null}
                                    >
                                        <Nav.Item className="mt-2">
                                            <Button
                                                variant="primary"
                                                className="mr-1 ml-2 text-capitalize"
                                                onClick={this.handleClickButton}
                                                name="cleanPath"
                                                disabled={(this.props.pathMacAddress == '')}
                                            >
                                                {locale.texts.CLEAN_PATH}
                                            </Button>
                                        </Nav.Item>
                                    </AccessControl>
                                }

                                <div
                                    className="d-flex bd-highligh ml-auto"
                                >
                                    {locationMonitorConfig &&
                                        Object.keys(locationMonitorConfig).includes(areaId.toString()) &&
                                            <Nav.Item className="mt-2 bd-highligh">    
                                                <Button 
                                                    variant="warning" 
                                                    className="mr-1 ml-2" 
                                                    onClick={this.handleClickButton} 
                                                    name="location"
                                                    value={locationMonitorConfig[areaId].enable}
                                                    active={!locationMonitorConfig[areaId].enable}                                                            
                                                >
                                                    {locationMonitorConfig[areaId].enable 
                                                        ? locale.texts.LOCATION_MONITOR_ON 
                                                        : locale.texts.LOCATION_MONITOR_OFF
                                                    }
                                                </Button>
                                        </Nav.Item>                              
                                    }

                                    {geofenceConfig &&
                                        Object.keys(geofenceConfig).includes(areaId.toString()) &&
                                            <div className="d-flex">
                                                <Nav.Item className="mt-2 bd-highligh">    
                                                    <Button 
                                                        variant="warning" 
                                                        className="mr-1 ml-2" 
                                                        onClick={this.handleClickButton} 
                                                        name="geofence"
                                                        value={geofenceConfig[areaId].enable}
                                                        active={!geofenceConfig[areaId].enable}                                                            
                                                    >
                                                        {geofenceConfig[areaId].enable 
                                                            ? locale.texts.FENCE_ON 
                                                            : locale.texts.FENCE_OFF
                                                        }
                                                    </Button>
                                                </Nav.Item>
                                                <Nav.Item className="mt-2">
                                                    <Button 
                                                        variant="outline-primary" 
                                                        className="mr-1 ml-2" 
                                                        onClick={this.handleClickButton} 
                                                        name="clearAlerts"
                                                    >
                                                        {locale.texts.CLEAR_ALERTS}
                                                    </Button>
                                                </Nav.Item>
                                            </div>
                                    }
                                </div>
                            </Nav>
                        </div>
                    </div>
                </BrowserView>
                <TabletView>
                    <div id="surveillanceContainer" className="w-100 h-100 d-flex flex-column">
                        <div className="d-flex w-100 h-100 flex-column">
                            <div className="w-100 d-flex flex-row align-items justify-content" style={style.MapAndQrcode}>
                                <div style={style.qrBlock} className="d-flex flex-column align-items">
                                    <div>
                                        <QRcodeContainer
                                            data={this.props.proccessedTrackingData.filter(item => item.searched)}
                                            userInfo={auth.user}
                                            searchKey={this.props.searchKey}
                                            isSearched = {this.props.isSearched}
                                        /> 
                                        <InfoPrompt
                                            searchKey={this.props.searchKey}
                                            searchResult={this.props.searchResult}
                                            title={locale.texts.FOUND} 
                                            title2={locale.texts.NOT_FOUND} 
                                        />
                                    </div>
                                </div>
                                <div style={style.mapBlockForTablet}>
                                    <Map
                                        pathMacAddress={this.props.pathMacAddress}
                                        hasSearchKey={hasSearchKey}
                                        colorPanel={this.props.colorPanel}
                                        proccessedTrackingData={this.props.proccessedTrackingData}
                                        lbeaconPosition={this.props.lbeaconPosition}
                                        geofenceConfig={this.props.geofenceConfig}
                                        getSearchKey={this.props.getSearchKey}
                                        areaId={areaId}
                                        searchedObjectType={this.props.showedObjects}
                                        mapConfig={config.mapConfig}
                                        pathData={this.state.pathData}
                                        handleClosePath={this.props.handleClosePath}
                                        handleShowPath={this.props.handleShowPath}
                                        showPath={this.props.showPath}
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <Nav style={style.button} className="d-flex align-items-start text-capitalize bd-highlight">
                                    <Nav.Item className="mt-2">
                                        <Button 
                                            variant="outline-primary" 
                                            className="mr-1 ml-2 text-capitalize" 
                                            onClick={this.handleClickButton} 
                                            name="clear"
                                            disabled={!this.props.hasSearchKey}
                                        >
                                            {locale.texts.CLEAR}
                                        </Button>
                                    </Nav.Item>
                                    <AccessControl
                                        permission={"user:saveSearchRecord"}
                                        renderNoAccess={() => null}
                                    >
                                        <Nav.Item className="mt-2">
                                            <Button 
                                                variant="outline-primary" 
                                                className="mr-1 ml-2 text-capitalize" 
                                                onClick={this.handleClickButton} 
                                                name="save"
                                                disabled={!this.props.hasSearchKey || this.state.showPdfDownloadForm}
                                            >
                                                {locale.texts.SAVE}
                                            </Button>
                                        </Nav.Item>
                                    </AccessControl>
                                    <AccessControl
                                        permission={"user:toggleShowDevices"}
                                        renderNoAccess={() => null}
                                    >
                                        <Nav.Item className="mt-2">
                                            <Button 
                                                variant="primary" 
                                                className="mr-1 ml-2 text-capitalize" 
                                                onClick={this.handleClickButton} 
                                                name="searchedObjectType"
                                                value={[-1, 0]}
                                                active={(this.props.showedObjects.includes(0) || this.props.showedObjects.includes(-1)) }
                                                disabled={
                                                    !(this.props.searchedObjectType.includes(-1) ||
                                                    this.props.searchedObjectType.includes(0))
                                                }
                                            >
                                                {!(this.props.showedObjects.includes(0) || this.props.showedObjects.includes(-1)) 
                                                    ?   locale.texts.SHOW_DEVICES 
                                                    :   locale.texts.HIDE_DEVICES 
                                                }
                                            </Button>
                                        </Nav.Item>
                                    </AccessControl>
                                    <AccessControl
                                        permission={"user:toggleShowResidents"}
                                        renderNoAccess={() => null}
                                    >
                                        <Nav.Item className="mt-2">
                                            <Button 
                                                variant="primary" 
                                                className="mr-1 ml-2 text-capitalize" 
                                                onClick={this.handleClickButton} 
                                                name="searchedObjectType"
                                                value={[-2, 1, 2]}
                                                active={(this.props.showedObjects.includes(1) || this.props.showedObjects.includes(2))}
                                                disabled={
                                                    !(this.props.searchedObjectType.includes(1) ||
                                                    this.props.searchedObjectType.includes(2))
                                                }
                                            >
                                                {!(this.props.showedObjects.includes(1) || this.props.showedObjects.includes(2)) 
                                                    ?   locale.texts.SHOW_RESIDENTS
                                                    :   locale.texts.HIDE_RESIDENTS 
                                                }
                                            </Button>
                                        </Nav.Item>
                                    </AccessControl>
                                    {process.env.IS_TRACKING_PATH_ON == 1 && 
                                        <AccessControl
                                            permission={"user:cleanPath"}
                                            renderNoAccess={()=>null}
                                        >
                                            <Nav.Item className="mt-2">
                                                <Button
                                                    variant="primary"
                                                    className="mr-1 ml-2 text-capitalize" 
                                                    onClick={this.handleClickButton}
                                                    name="cleanPath"
                                                    disabled={(this.props.pathMacAddress==='')}
                                                >
                                                    {locale.texts.CLEAN_PATH}
                                                </Button>
                                            </Nav.Item>
                                        </AccessControl>
                                    }
                                </Nav>
                            </div>
                        </div>
                    </div>
                </TabletView>
                <MobileOnlyView>
                    <div style={style.mapForMobile}>
                        <Map
                            pathMacAddress={this.props.pathMacAddress}
                            hasSearchKey={hasSearchKey}
                            colorPanel={this.props.colorPanel}
                            proccessedTrackingData={this.props.proccessedTrackingData}
                            lbeaconPosition={this.props.lbeaconPosition}
                            geofenceConfig={this.props.geofenceConfig}
                            getSearchKey={this.props.getSearchKey}
                            areaId={areaId}
                            searchedObjectType={this.props.showedObjects}
                            mapConfig={config.mapConfig}
                            pathData={this.state.pathData}
                            handleClosePath={this.props.handleClosePath}
                            handleShowPath={this.props.handleShowPath}
                            showPath={this.props.showPath}
                            style={{border:'solid'}}
                        />
                    </div>
                </MobileOnlyView>
                <PdfDownloadForm 
                    show={this.state.showPdfDownloadForm}
                    data={this.props.searchResult}
                    handleClose={this.handleCloseModal}
                    userInfo={auth.user}
                />
                <GeneralConfirmForm
                    show={this.state.showConfirmForm}
                    handleSubmit={this.handleConfirmFormSubmit}
                    handleClose={this.handleCloseModal}
                    signin={auth.signin}
                    stateReducer ={stateReducer[0].areaId}
                    auth={auth}
                />    
            </div>
        )
    }
}

export default SurveillanceContainer