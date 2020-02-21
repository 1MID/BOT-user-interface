import React from 'react';
import { Form, Button,Container,   ButtonToolbar,Row,Col } from 'react-bootstrap';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { AppContext } from '../../context/AppContext';
import ReactTable from 'react-table'; 
import selecTableHOC from 'react-table/lib/hoc/selectTable';
import XLSX from "xlsx";
import InputFiles from "react-input-files";
import axios from 'axios';
import DeleteConfirmationForm from '../presentational/DeleteConfirmationForm'
const SelectTable = selecTableHOC(ReactTable);
import { 
    objectImport,
    deleteImportData,
} from "../../dataSrc"


class ImportObjectTable extends React.Component{
    static contextType = AppContext   
    
    state = { 
        selection: [],
        selectAll: false,
        showDeleteConfirmation:false
    }


    componentDidUpdate = (prevProps, prevState) => {
       
    }

    handleClose = () => {
        this.setState({
            showDeleteConfirmation:false
        })
    }

    handleSubmitForm = () => {
        this.setState({
            showDeleteConfirmation:false
        })
        this.props.handleSubmitForm()
    }


    toggleSelection = (key, shift, row) => {
        let selection = [...this.state.selection];
        key = key.split('-')[1] ? key.split('-')[1] : key
        const keyIndex = selection.indexOf(key);
        if (keyIndex >= 0) {
            selection = [
            ...selection.slice(0, keyIndex),
            ...selection.slice(keyIndex + 1)
            ];
        } else {
            selection.push(key);
        }
        this.setState({ 
            selection 
        });
    };

    toggleAll = () => {

        const selectAll = this.state.selectAll ? false : true;
        let selection = [];
        if (selectAll) {
            const wrappedInstance = this.selectTable.getWrappedInstance();
            const currentRecords = wrappedInstance.props.data
            
            // const currentRecords = wrappedInstance.getResolvedState().sortedData;
           
            currentRecords.forEach(item => {
                selection.push(item.id);
            });
        }else{
            selection = [];
        }
         this.setState({ selectAll, selection });

    };

    isSelected = (key) => {
        return this.state.selection.includes(key);
    };

 deleteRecordImport = () => {
            let idPackage = []
            var deleteArray = [];
            var deleteCount = 0;
        
         
            axios.post(deleteImportData, {
               idPackage: this.state.selection
            })
            .then(res => {
                this.setState({
                    selection: [],
                    selectAll: false,
                })
            })
            .catch(err => {
                console.log(err)
            })
    
            this.handleSubmitForm()
        }
 
    handleClickButton = (e) => {
   
 
        let { name } = e.target
        switch(name) {
            case "delete import data":
                    this.setState({
                        showDeleteConfirmation: true,
                        warningSelect : 2
                   })
                break;  
        }

    }


        onImportExcel = files => {
     
            // 獲取上傳的文件對象
            //const { files } = file.target; // 通過FileReader對象讀取文件
            const fileReader = new FileReader();
            //console.log(fileReader);
            for (let index = 0; index < files.length; index++) {
                fileReader.name = files[index].name;
            }
          
            fileReader.onload = event => {
                try {
                    // 判斷上傳檔案的類型 可接受的附檔名
                    const validExts = new Array(".xlsx", ".xls");
                    const fileExt = event.target.name;
         
                    if (fileExt == null) {
                        throw "檔案為空值";
                    }
        
                    const fileExtlastof = fileExt.substring(fileExt.lastIndexOf("."));
                    if (validExts.indexOf(fileExtlastof) == -1) {
                        throw "檔案類型錯誤，可接受的副檔名有：" + validExts.toString();
                    }
      
                    const { result } = event.target; // 以二進制流方式讀取得到整份excel表格對象
                    const workbook = XLSX.read(result, { type: "binary" });
                    let data = []; // 存儲獲取到的數據 // 遍歷每張工作表進行讀取（這裡默認只讀取第一張表）
                    for (const sheet in workbook.Sheets) {
                        if (workbook.Sheets.hasOwnProperty(sheet)) {
                            // 利用 sheet_to_json 方法將 excel 轉成 json 數據
                            data = data.concat(
                                XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
                            ); // break; // 如果只取第一張表，就取消註釋這行
                        }
                    } 
    
                    // ＩＭＰＯＲＴ時把ＡＣＮ重複的擋掉
                    let newData = []
                    let reapetFlag = false;
                    let DataNameIsNull = '';
                    let ReapeName = ''; 
                    data.map(importData =>{
                        reapetFlag = false;
                        this.props.dataImport.map(dataOrigin=>{
                           importData.asset_control_number === dataOrigin.asset_control_number ? reapetFlag=true : null
                           importData.asset_control_number == dataOrigin.asset_control_number ? reapetFlag=true : null
                        })
                       if( reapetFlag == false) {
                           if(importData.asset_control_number !=undefined ){
                                 newData.push(importData) 
                           }else{
                               DataNameIsNull += importData.name + ','
                           }
                        }else{
                            ReapeName += importData.name   + ','
                        }
                    })
    
    
    
                    DataNameIsNull!='' ? alert('ASN必須不等於空:' + DataNameIsNull) : null 
                    ReapeName!='' ?    alert(ReapeName + '的ASN與其他筆資料重複')  : null
                    //沒被擋掉的存到newData後輸出
            
                     let { locale } = this.context
                 
                    axios.post(objectImport, {
                        locale: locale.abbr ,
                        newData
                    })
                    .then(res => {
                    })
                    .catch(err => {
                        console.log(err)
                        
                    })
                this.handleSubmitForm()
    
                } catch (e) {
                    // 這裡可以拋出文件類型錯誤不正確的相關提示
                    alert(e);
                    //console.log("文件類型不正確");
                    return;
                }
           
            }; // 以二進制方式打開文件
             fileReader.readAsBinaryString(files[0]);
        };
    


    render(){
        const { locale } = this.context 
        
        const {   
            selectAll,
            selectType,
        } = this.state
       
        const {
            toggleSelection,
            toggleAll,
            isSelected,
        } = this;

        const extraProps = {
            selectAll,
            isSelected,
            toggleAll,
            toggleSelection,
            selectType
        };

       
        return(
            <div> 
                         <ButtonToolbar>
                            <InputFiles accept=".xlsx, .xls" onChange={this.onImportExcel}>
                                <Button 
                                variant="outline-primary" 
                                className="btn btn-primary mr-2 mb-1"
                                >
                                {locale.texts.IMPORT_OBJECT}
                                </Button>
                            </InputFiles>
                            <Button 
                                variant="outline-primary" 
                                className='text-capitalize mr-2 mb-1'
                                name="delete import data"
                                onClick={this.handleClickButton}
                            >
                                {locale.texts.DELETE}
                            </Button>
                        </ButtonToolbar>
                        <SelectTable
                            keyField='id'
                            data={this.props.dataImport}
                            columns={this.props.columnImport}
                            ref={r => (this.selectTable = r)}
                            className="-highlight"
                            style={{height:'75vh'}}
                            {...extraProps}
                        />
                        <DeleteConfirmationForm
                            show={this.state.showDeleteConfirmation} 
                            handleClose={this.handleClose}
                            handleSubmit={
                               this.state.warningSelect ==2 ?  this.deleteRecordImport : null 
                            }
                        />
            </div>
            
        )
    }

}export default ImportObjectTable
