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

import MyForm from '../components/myForm.jsx';

export default function aessCourse() {
  const databaseRef = collection(database, 'AESS Course Data');
  const router = useRouter();

  ///////////
  const [selectedRows, setSelectedRows] = useState([]);
  /////////

  // Setup all the data below:
  const [ID, setID] = useState('');
  /* 
  const [name, setName] = useState('');
  const [sid, setSID] = useState('');
  const [semaster, setSemaster] = useState('');
  const [courseFee, setCourseFee] = useState(0);
  const [notesFee, setNotesFee] = useState(0);
  const [numOfLession, setNumOfLession] = useState(0); */
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
  // Logout function for btn
  const logout = () => {
    sessionStorage.removeItem('Token');
    router.push('/login');
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
  const colums = useMemo(
    () => [
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
                getID(
                  row.id,
                  row.courseInfo,
                  row.courseSchedule,
                  row.courseState,
                )
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
              label="courseName"
              className="mb-3"
              controlId="formBasicCourseName"
            >
              <Form.Control
                required
                type="text"
                name="courseName"
                placeholder="courseName"
                value={courseInfo.courseName}
                onChange={handleChange_CourseInfo}
              />
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel
              label="courseID"
              className="mb-3"
              controlId="formBasicCourseID"
            >
              <Form.Control
                required
                type="number"
                name="courseID"
                placeholder="courseID"
                value={courseInfo.courseID}
                onChange={handleChange_CourseInfo}
              />
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel
              label="courseSemaster"
              className="mb-3"
              controlId="formBasicCourseSemaster"
            >
              <Form.Control
                required
                type="text"
                name="courseSemaster"
                placeholder="courseSemaster"
                value={courseInfo.courseSemaster}
                onChange={handleChange_CourseInfo}
              />
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel
              label="tuitionFee"
              className="mb-3"
              controlId="formBasicTuitionFee"
            >
              <Form.Control
                required
                type="text"
                name="tuitionFee"
                placeholder="tuitionFee"
                value={courseInfo.tuitionFee}
                onChange={handleChange_CourseInfo}
              />
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel
              label="notesFee"
              className="mb-3"
              controlId="formBasicNotesFee"
            >
              <Form.Control
                required
                type="text"
                name="notesFee"
                placeholder="notesFee"
                value={courseInfo.notesFee}
                onChange={handleChange_CourseInfo}
              />
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel
              label="courseNumOfLession"
              className="mb-3"
              controlId="formBasicCourseNumOfLession"
            >
              <Form.Control
                required
                type="number"
                name="courseNumOfLession"
                placeholder="courseNumOfLession"
                value={courseInfo.courseNumOfLession}
                onChange={handleChange_CourseInfo}
              />
            </FloatingLabel>
          </Col>
        </Row>
        // Second ROW
        <Row>
          <Col>
            <FloatingLabel
              label="lessionTime"
              className="mb-3"
              controlId="formBasicLessionTime"
            >
              <Form.Control
                required
                type="text"
                name="lessionTime"
                placeholder="lessionTime"
                value={courseSchedule.lessionTime}
                onChange={handleChange_CourseSchedule}
              />
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel
              label="lessionDate"
              className="mb-3"
              controlId="formBasicLessionDate"
            >
              <Form.Control
                required
                type="text"
                name="lessionDate"
                placeholder="lessionDate"
                value={courseSchedule.lessionDate}
                onChange={handleChange_CourseSchedule}
              />
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel
              label="lessionEveryWeekAt"
              className="mb-3"
              controlId="formBasicLessionEveryWeekAt"
            >
              <Form.Control
                required
                type="text"
                name="lessionEveryWeekAt"
                placeholder="lessionEveryWeekAt"
                value={courseSchedule.lessionEveryWeekAt}
                onChange={handleChange_CourseSchedule}
              />
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel
              label="courseBegan"
              className="mb-3"
              controlId="formBasicLessionCourseBegan"
            >
              <Form.Control
                required
                type="text"
                name="courseBegan"
                placeholder="courseBegan"
                value={courseState.courseBegan}
                onChange={handleChange_CourseState}
              />
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel
              label="isOpenForApply"
              className="mb-3"
              controlId="formBasicLessionIsOpenForApply"
            >
              <Form.Control
                required
                type="text"
                name="isOpenForApply"
                placeholder="isOpenForApply"
                value={courseState.isOpenForApply}
                onChange={handleChange_CourseState}
              />
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel
              label="courseQuota"
              className="mb-3"
              controlId="formBasicLessionCourseQuota"
            >
              <Form.Control
                required
                type="text"
                name="courseQuota"
                placeholder="courseQuota"
                value={courseState.courseQuota}
                onChange={handleChange_CourseState}
              />
            </FloatingLabel>
          </Col>
        </Row>
        //END Second ROW
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
        <Row>
          <Col>
            <MyForm
              name={'courseBegan'}
              value={courseState.courseBegan}
              handleChange={handleChange_CourseState}
            />
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
