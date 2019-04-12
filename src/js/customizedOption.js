import pin from '../img/pin.png'
import black_pin from '../img/black_pin_v2.svg'
import black_drip from '../img/black_drip.svg'
import white_pin from '../img/white_pin.svg'
import grey_pin from '../img/grey_pin.svg';
import darkGrey_pin from '../img/darkGrey_pin_v2.svg';


/** Custom Option of surveillance component  */
const mapOptions = {
    crs: L.CRS.Simple,
    minZoom: -5,
    maxZoom: 0,
    zoomControl: true,
    attributionControl: false,
    dragging: true,
    doubleClickZoom: false,
    scrollWheelZoom: false
}

const iconOptions = {
    iconSize: 50,
    stationaryIconUrl: black_pin,
    movinfIconUrl: darkGrey_pin,
}

/**
 * The html content of popup of markers.
 * @param {*} objectName The user friendly name of the object.
 * @param {*} objectImg  The image of the object.
 * @param {*} imgWidth The width of the image.
 */
function popupContent (objectName, objectImg, imgWidth){
    const content = 
        `
        <a href='#'>
            <div class='contentBox'>
                <div class='textBox'>
                    <div>
                        <h2 className="mb-1">${objectName}</h2>
                        <small>詳細資料</small>
                    </div>
                    <small></small>
                </div> 
                <div class='imgBox'>
                    <span className="pull-left ">
                        <img src=${objectImg} width=${imgWidth} className="img-reponsive img-rounded" />
                    </span>
                </div>
            </div>
        </a>
        `
    
    return content
}


export { 
    mapOptions,
    popupContent,
    iconOptions
}