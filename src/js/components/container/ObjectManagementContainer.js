import React from 'react';

/** Import Presentational Component */
import ObjectOperation from '../presentational/ObjectOperation.js';
import FormContainer from './FormContainer.js';
import TableContainer from './ObjectListContainer';
import Navs from '../presentational/Navs'
import ListGroup from 'react-bootstrap/ListGroup';
import dataSrc from "../../../js/dataSrc";
import axios from 'axios';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Col, Row, Button, Nav, Container} from 'react-bootstrap';
import EditObjectForm from './EditObjectForm'

export default class ObjectManagement extends React.Component{

    constructor() {
        super();
        this.state = {
            data:[],
            column:[],
            filterData:[],
            isShowModal: false,
            selectedRowData: {},
        }
        this.handleType = this.handleType.bind(this);
        this.handleModalForm = this.handleModalForm.bind(this);
        this.getObjectData = this.getObjectData.bind(this);
        this.handleSubmitForm = this.handleSubmitForm.bind(this);
    }

    componentDidMount(){
        this.getObjectData();
    }

    getObjectData() {
        axios.get(dataSrc.objectTable).then(res => {
            let column = [];
            res.data.fields.map(item => {
                let field = {};
                field.Header = item.name,
                field.accessor = item.name,
                column.push(field);
            })
            this.setState({
                data: res.data.rows,
                filterData: res.data.rows,
                column: column,
            })
        })
        .catch(function (error) {
            console.log(error);
        })
    }

    handleType(e){
        let filterData = [];
        // switch(e.target.innerText) {
        //     case 'ALL':
        //         searchType = 0;
        //         break;
        //     case 'Inpatient':
        //         searchType = 1;
        //         break;
        //     case 'Medical device':
        //         searchType = 2;
        //         break;
        // }
        // this.setState({
        //     searchType : searchType,
        // })
        if (e.target.innerText === 'All') {
            this.setState({
                filterData: this.state.data,
            })
        } else {
            this.state.data.map(item => {
                if (item.type === e.target.innerText) {
                    filterData.push(item);
                }
            });
            this.setState({
                filterData:filterData,
            })
        }
    }

    handleModalForm() {
        this.setState({
            isShowModal: true,
        }) 
    }

    handleSubmitForm() {
        this.setState({
            isShowModal: false
        })
    }

    render(){
        const { isShowModal, selectedRowData } = this.state

        return (
            <Container fluid className='py-2'>
                {/* <Navs navsItem={this.state.navsItem}/> */}
                {/* <div className="d-flex w-100 justify-content-around"> */}
                <Nav className='d-flex align-items-center'>
                    {/* <Button variant="primary" onClick = {this.handleModalForm}>Add Object</Button> */}
                </Nav>
                {/* <Nav variant="pills" defaultActiveKey="/home">
                    <Nav.Item>
                        <Nav.Link href="/home">Active</Nav.Link>
                    </Nav.Item>
                </Nav> */}
                <Row className='d-flex w-100 justify-content-around'>

                    {/* {console.log(this.state.data)} */}
                    {/* <div className='col-2'>
                        <h2>Objects </h2>
                        <ListGroup variant="flush">
                            <ListGroup.Item onClick={this.handleType} value={0}>All</ListGroup.Item>
                            <ListGroup.Item onClick={this.handleType} value={1}>Inpatient</ListGroup.Item>
                            <ListGroup.Item onClick={this.handleType} value={2}>Medical device</ListGroup.Item>
                        </ListGroup>
                    </div> */}
                    <Col className='py-2'>
                        <ReactTable 
                            data = {this.state.filterData} 
                            columns = {this.state.column} 
                            showPagination = {false}
                            noDataText="No Data Available"
                            className="-highlight"
                            getTrProps={(state, rowInfo, column, instance) => {
                                return {
                                    onClick: (e, handleOriginal) => {
                                        this.setState({
                                            selectedRowData: rowInfo.original,
                                            isShowModal: true,
                                        })
                                
                                        // IMPORTANT! React-Table uses onClick internally to trigger
                                        // events like expanding SubComponents and pivots.
                                        // By default a custom 'onClick' handler will override this functionality.
                                        // If you want to fire the original onClick handler, call the
                                        // 'handleOriginal' function.
                                        if (handleOriginal) {
                                            handleOriginal()
                                        }
                                    }
                                }
                            }}
                        />
                    </Col>
                </Row>
                <EditObjectForm 
                    show = {isShowModal} 
                    title='Edit Object' 
                    selectedObjectData={selectedRowData} 
                    handleSubmitForm={this.handleSubmitForm}
                />
            </Container>
                    
        )
    }
}