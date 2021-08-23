import moment from "moment";
import { useState, useEffect } from "react";
import { Button, Row, Col, Typography, Table, Input } from 'antd';
import 'antd/dist/antd.css';
import styled, { createGlobalStyle } from 'styled-components';
const URL = 'http://localhost:3004/books';
const { Title, Text } = Typography;

function BookPage(){
    const style = { background: '#0092ff', padding: '8px 0' };
    const [bookList, setbooklist] = useState([]);
    let filteredData = [...bookList]
    const [value, setValue] = useState('');
    useEffect(()=>{
        async function getBookList() {
            const res = await fetch(URL);
            if(res.ok)
            {
                res.json().then(val=>{
                    console.log(val);
                    setbooklist(val)
                })
            }
        }
        getBookList();
    }, []);

    const FilterByNameInput = (
        <Input
          placeholder="Search Book Name"
          value={value}
          onChange={e => {
            const currValue = e.target.value;
            setValue(currValue);
            filteredData = bookList.filter(entry =>
              entry.bookName.toLowerCase().indexOf(currValue.toLowerCase())!==-1
            );
            setbooklist(filteredData);
          }}
        />
      );
      const columns = [
        {
            title: "ID",
            dataIndex: "id",
            width: 30
        },
        {
          title: FilterByNameInput,
          render: payload=>{
              return <div>{payload.bookName}<p>{payload.author}</p></div>
          },
          width: 150
        },
        {
          title: "Publisher",
          dataIndex: "publisher",
          width: 150
        },
        {
            title: "Issue Date",
            render: date=>{
                if (date.hasOwnProperty('date')) 
                {
                    return <span>{moment(date.date.issueDate).format('DD-MM-YYYY')}</span>
                }
            },
            sorter: true,
            width: 150
          },
          {
            title: "Return Date",
            render: date=>{
                if (date.hasOwnProperty('date')) 
                {
                    return <span>{moment(date.date.returnDate).format('DD-MM-YYYY')}</span>
                }
            },
            sorter: true,
            width: 150
          }
      ];
    function displayTable(){
        return <Table
        columns={columns}
        rowKey={record => record.bookName}
        dataSource={filteredData}//{bookList}
        pagination={{ pageSize: 5 }}
        scroll={{ y: 240 }}
        //loading={loading}
        //onChange={this.handleTableChange}
      />
    }
    return (
            <>
            <Row gutter={16}>
      <Col className="gutter-row" span={6}>
        <Text type="default">Library</Text>
      </Col>
      
      <Col className="gutter-row" span={6}>
        <Button type="primary">Add Books</Button>
      </Col>
    </Row>
    {displayTable()}
            </>
    )
}
export default BookPage;