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

import DataTable from 'react-data-table-component';
import MyForm from '../components/MyForm.jsx';

export default function AessCourse() {
  const databaseRef = collection(database, 'AESS Course Data');
  const router = useRouter();
  ///////////
  const [selectedRows, setSelectedRows] = useState([]);
  /////////
  // Setup all the data below:
  const [ID, setID] = useState('');
  const [courseInfo, setCourseInfo] = useState({
    courseName: '',
    courseID: '',
    courseSemaster: '',
    tuitionFee: '',
    notesFee: '',
    courseNumOfLession: '',
  });
  const [courseSchedule, setCourseSchedule] = useState({
    lessionTime: '',
    lessionDate: '',
    lessionEveryWeekAt: '',
  });
  const [courseState, setCourseState] = useState({
    courseBegan: '',
    isOpenForApply: '',
    courseQuota: '',
  });

  // control button -> Submit | Update btn
  const [isUpdate, setIsUpdate] = useState(false);
  // db array
  const [fireData, setFireData] = useState([]);

  const initInputField = () => {
    setCourseInfo({
      courseName: '',
      courseID: '',
      courseSemaster: '',
      tuitionFee: '',
      notesFee: '',
      courseNumOfLession: '',
    });
    setCourseSchedule({
      lessionTime: '',
      lessionDate: '',
      lessionEveryWeekAt: '',
    });
    setCourseState({
      courseBegan: '',
      isOpenForApply: '',
      courseQuota: '',
    });
    getData();
    //router.push('/aessCourse');
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
      courseInfo: courseInfo,
      courseSchedule: courseSchedule,
      courseState: courseState,
    })
      .then(() => {
        alert('data sent');
        initInputField();
      })
      .catch((err) => {
        console.log(err);
      });
    initInputField();
  };
  //Edit data
  const getID = (id, courseInfo, courseSchedule, courseState) => {
    setID(id);
    setCourseInfo(courseInfo);
    setCourseSchedule(courseSchedule);
    setCourseState(courseState);

    setIsUpdate(true);
  };
  //Update data
  const updateFields = () => {
    let fieldToEdit = doc(database, 'AESS Course Data', ID);
    updateDoc(fieldToEdit, {
      courseInfo: courseInfo,
      courseSchedule: courseSchedule,
      courseState: courseState,
    })
      .then(() => {
        setIsUpdate(false);
        alert('Data Updated');
      })
      .catch((err) => {
        console.log(err);
      });
    initInputField();
  };
  //Delete Data
  const deleteData = (id) => {
    let fieldToEdit = doc(database, 'AESS Course Data', id);
    deleteDoc(fieldToEdit)
      .then(() => {
        alert('Data Delete');
      })
      .catch((err) => {
        console.log(err);
      });
    initInputField();
  };

  const handleChange_CourseInfo = (e) => {
    const { name, value } = e.target;
    setCourseInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleChange_CourseSchedule = (e) => {
    const { name, value } = e.target;
    setCourseSchedule((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleChange_CourseState = (e) => {
    const { name, value } = e.target;
    setCourseState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  //////////////////////////////////////////////////////////////////////////
  const handleChange = useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  // 下拉清單的內容
  const ExpandedComponent = ({ data }) => {
    return (
      <div>
        <p>{data.courseInfo.courseName}</p>
        <p>{data.courseInfo.courseID}</p>
      </div>
    );
  };

  // Table content
  const colums = useMemo(() => [
    {
      name: 'Name',
      selector: (row) => row.courseInfo.courseName,
      sortable: true,
    },
    {
      name: 'courseID',
      selector: (row) => row.courseInfo.courseID,
      sortable: true,
    },
    {
      name: 'semaster',
      selector: (row) => row.courseInfo.courseSemaster,
      sortable: true,
    },
    {
      name: 'tuitionFee',
      selector: (row) => row.courseInfo.tuitionFee,
      sortable: true,
    },
    {
      name: 'notesFee',
      selector: (row) => row.courseInfo.notesFee,
      sortable: true,
    },
    {
      name: 'numOfLession',
      selector: (row) => row.courseInfo.courseNumOfLession,
      sortable: true,
    },
    {
      name: 'lessionTime',
      selector: (row) => row.courseSchedule.lessionTime,
      sortable: true,
    },
    {
      name: 'lessionDate',
      selector: (row) => row.courseSchedule.lessionDate,
      sortable: true,
    },
    {
      name: 'lessionEveryWeekAt',
      selector: (row) => row.courseSchedule.lessionEveryWeekAt,
      sortable: true,
    },
    {
      name: 'courseBegan',
      selector: (row) => row.courseState.courseBegan,
      sortable: true,
    },
    {
      name: 'isOpenForApply',
      selector: (row) => row.courseState.isOpenForApply,
      sortable: true,
    },
    {
      name: 'courseQuota',
      selector: (row) => row.courseState.courseQuota,
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
            onClick={() =>
              getID(row.id, row.courseInfo, row.courseSchedule, row.courseState)
            }
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
  ]);

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
  });

  return (
    <Container fluid>
      <Row>
        <Col>
          <h1>AESS Course</h1>
        </Col>
      </Row>

      <Form>
        <Row>
          <Col>
            <MyForm
              name={'courseName'}
              value={courseInfo.courseName}
              handleChange={handleChange_CourseInfo}
            />
          </Col>
          <Col>
            <MyForm
              name={'courseID'}
              value={courseInfo.courseID}
              handleChange={handleChange_CourseInfo}
            />
          </Col>
          <Col>
            <MyForm
              name={'courseSemaster'}
              value={courseInfo.courseSemaster}
              handleChange={handleChange_CourseInfo}
            />
          </Col>
          <Col>
            <MyForm
              name={'tuitionFee'}
              value={courseInfo.tuitionFee}
              handleChange={handleChange_CourseInfo}
            />
          </Col>
          <Col>
            <MyForm
              name={'notesFee'}
              value={courseInfo.notesFee}
              handleChange={handleChange_CourseInfo}
            />
          </Col>
          <Col>
            <MyForm
              name={'courseNumOfLession'}
              value={courseInfo.courseNumOfLession}
              handleChange={handleChange_CourseInfo}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <MyForm
              name={'lessionTime'}
              value={courseSchedule.lessionTime}
              handleChange={handleChange_CourseSchedule}
            />
          </Col>
          <Col>
            <MyForm
              name={'lessionDate'}
              value={courseSchedule.lessionDate}
              handleChange={handleChange_CourseSchedule}
            />
          </Col>
          <Col>
            <MyForm
              name={'lessionEveryWeekAt'}
              value={courseSchedule.lessionEveryWeekAt}
              handleChange={handleChange_CourseSchedule}
            />
          </Col>
          <Col>
            <MyForm
              name={'courseBegan'}
              value={courseState.courseBegan}
              handleChange={handleChange_CourseState}
            />
          </Col>
          <Col>
            <MyForm
              name={'isOpenForApply'}
              value={courseState.isOpenForApply}
              handleChange={handleChange_CourseState}
            />
          </Col>
          <Col>
            <MyForm
              name={'courseQuota'}
              value={courseState.courseQuota}
              handleChange={handleChange_CourseState}
            />
          </Col>
        </Row>
        <Row>
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
