import Image from 'next/image';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import { app, database } from '../firebaseConfig.js';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';

import DataTable from 'react-data-table-component';

export default function aessCourse() {
  const databaseRef = collection(database, 'AESS Course Data');
  const router = useRouter();

  ///////////
  const [selectedRows, setSelectedRows] = useState([]);
  /////////

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [sid, setSID] = useState('');
  const [ID, setID] = useState('');
  // control button -> Submit | Update btn
  const [isUpdate, setIsUpdate] = useState(false);
  // db array
  const [fireData, setFireData] = useState([]);

  const initInputField = () => {
    setName('');
    setAge('');
    setSID('');
    getData();
  };

  // get all data from db
  const getData = async () => {
    await getDocs(databaseRef)
      .then((response) => {
        const result = response.docs.map((item) => ({
          ...item.data(),
          id: item.id,
        }));
        setFireData(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // Create Data, adding data to db
  const addData = () => {
    addDoc(databaseRef, {
      name: name,
      age: Number(age),
      sid: Number(sid),
    })
      .then(() => {
        alert('data sent');
        initInputField();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //Edit data
  const getID = (id, sid, name, age) => {
    setID(id);
    setSID(sid);
    setName(name);
    setAge(age);
    setIsUpdate(true);
    getData();
  };
  //Update data
  const updateFields = () => {
    let fieldToEdit = doc(database, 'AESS Course Data', ID);
    updateDoc(fieldToEdit, {
      name: name,
      sid: Number(sid),
      age: Number(age),
    })
      .then(() => {
        alert('Data Updated');
        initInputField();
        setIsUpdate(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //Delete Data
  const deleteData = (id) => {
    let fieldToEdit = doc(database, 'AESS Course Data', id);
    deleteDoc(fieldToEdit)
      .then(() => {
        alert('Data Delete');
        initInputField();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // Logout function for btn
  const logout = () => {
    sessionStorage.removeItem('Token');
    router.push('/login');
  };

  const handleChange = useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  // 下拉清單的內容
  const ExpandedComponent = ({ data }) => {
    return (
      <div>
        <p>{data.name}</p>
        <p>{data.sid}</p>
      </div>
    );
  };

  // Table content
  const colums = useMemo(
    () => [
      {
        name: 'Name',
        selector: (row) => row.name,
        sortable: true,
      },
      {
        name: 'SID',
        selector: (row) => row.sid,
        sortable: true,
      },
      {
        name: 'Age',
        selector: (row) => row.age,
        sortable: true,
      },
      {
        name: 'Action',
        cell: (row) => (
          <>
            <Button
              size="sm"
              className="m-1"
              variant="success"
              onClick={() => getID(row.id, row.sid, row.name, row.age)}
            >
              Edit
            </Button>
            <Button
              size="sm"
              className="m-1"
              variant="danger"
              onClick={() => deleteData(row.id)}
            >
              Del
            </Button>
          </>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      },
    ],
    [],
  );

  useEffect(() => {
    console.log('state', selectedRows);
  }, [selectedRows]);

  useEffect(() => {
    // check login token
    let token = sessionStorage.getItem('Token');
    if (!token) {
      router.push('/login');
    }
    if (token) {
      getData();
    }
  }, []);

  return (
    <Container>
      <div className="row">
        <div className="col">
          <h1>Home</h1>
        </div>
        <div className="col">
          <Button size="sm" variant="dark" onClick={logout}>
            Log Out
          </Button>
        </div>
      </div>

      <Form>
        <Row>
          <Col>
            <FloatingLabel
              label="Name"
              className="mb-3"
              controlId="formBasicName"
            >
              <Form.Control
                required
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel label="SID" className="mb-3" controlId="formBasicID">
              <Form.Control
                required
                type="number"
                placeholder="SID"
                value={sid}
                onChange={(e) => setSID(e.target.value)}
              />
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel
              label="Age"
              className="mb-3"
              controlId="formBasicAge"
            >
              <Form.Control
                required
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </FloatingLabel>
          </Col>

          <Col>
            {isUpdate ? (
              <Button size="sm" variant="dark" onClick={updateFields}>
                Update
              </Button>
            ) : (
              <Button size="sm" variant="dark" type="submit" onClick={addData}>
                Submit
              </Button>
            )}
          </Col>
        </Row>
      </Form>

      <DataTable
        columns={colums}
        data={fireData}
        expandableRows
        selectableRows
        expandableRowsComponent={ExpandedComponent}
        onSelectedRowsChange={handleChange}
        fixedHeader
        pagination
        persistTableHead
      ></DataTable>
    </Container>
  );
}
