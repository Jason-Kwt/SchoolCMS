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

  // Setup all the data below:
  /* const [ID, setID] = useState('');
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
    courseFee: {
      tuitionFee: '',
      notesFee: '',
    },
    courseNumOfLession: 0,
  });
  const [courseSchedule, setCourseSchudle] = useState({
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
      courseFee: {
        tuitionFee: '',
        notesFee: '',
      },
      courseNumOfLession: 0,
    });
    setCourseSchudle({
      lessionTime: '',
      lessionDate: '',
      lessionEveryWeekAt: '',
    });
    setCourseInfo({
      courseBegan: '',
      isOpenForApply: '',
      courseQuota: '',
    });
    //getData();
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
      })
      .catch((err) => {
        console.log(err);
      });
    initInputField();
    //getData();
  };
  //Edit data
  const getID = (courseInfo, courseSchedule, courseState) => {
    setCourseInfo(courseInfo);
    setCourseSchudle(courseSchedule);
    setCourseState(courseState);

    setIsUpdate(true);
    initInputField();
    //getData();
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
        alert('Data Updated');
        setIsUpdate(false);
      })
      .catch((err) => {
        console.log(err);
      });
    initInputField();
    //getData();
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
    //getData();
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
        selector: (row) => row.courseInfo.courseFee.tuitionFee,
        sortable: true,
      },
      {
        name: 'notesFee',
        selector: (row) => row.courseInfo.courseFee.notesFee,
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
                  row.courseSchedule,
                  row.courseInfo,
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
                placeholder="courseName"
                value={courseInfo.courseName}
                onChange={(e) =>
                  setCourseInfo({
                    ...courseInfo,
                    courseName: e.target.value,
                  })
                }
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
                placeholder="courseID"
                value={courseInfo.courseID}
                onChange={(e) =>
                  setCourseInfo({
                    ...courseInfo,
                    courseID: e.target.value,
                  })
                }
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
                placeholder="courseSemaster"
                value={courseInfo.courseSemaster}
                onChange={(e) =>
                  setCourseInfo({
                    ...courseInfo,
                    courseSemaster: e.target.value,
                  })
                }
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
                placeholder="tuitionFee"
                value={courseInfo.courseFee[0].tuitionFee}
                onChange={(e) =>
                  setCourseInfo({
                    ...courseInfo,
                    courseFee: {
                      ...courseInfo.courseFee,
                      tuitionFee: e.target.value,
                    },
                  })
                }
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
                placeholder="notesFee"
                value={courseInfo.courseFee.notesFee}
                onChange={(e) =>
                  setCourseInfo({
                    ...courseInfo,
                    courseFee: {
                      ...courseInfo.courseFee,
                      notesFee: e.target.value,
                    },
                  })
                }
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
                placeholder="courseNumOfLession"
                value={courseInfo.courseNumOfLession}
                onChange={(e) =>
                  setCourseInfo({
                    ...courseInfo,
                    courseNumOfLession: e.target.value,
                  })
                }
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
                placeholder="LessionTime"
                value={courseSchedule.lessionTime}
                onChange={(e) =>
                  setCourseSchudle({
                    ...courseSchedule,
                    lessionTime: e.target.value,
                  })
                }
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
                placeholder="LessionDate"
                value={courseSchedule.lessionDate}
                onChange={(e) =>
                  setCourseSchudle({
                    ...courseSchedule,
                    lessionDate: e.target.value,
                  })
                }
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
                placeholder="LessionEveryWeekAt"
                value={courseSchedule.lessionEveryWeekAt}
                onChange={(e) =>
                  setCourseSchudle({
                    ...courseSchedule,
                    lessionEveryWeekAt: e.target.value,
                  })
                }
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
                placeholder="CourseBegan"
                value={courseState.courseBegan}
                onChange={(e) =>
                  setCourseState({
                    ...courseState,
                    courseBegan: e.target.value,
                  })
                }
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
                placeholder="IsOpenForApply"
                value={courseState.isOpenForApply}
                onChange={(e) =>
                  setCourseState({
                    ...courseState,
                    isOpenForApply: e.target.value,
                  })
                }
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
                placeholder="CourseQuota"
                value={courseState.courseQuota}
                onChange={(e) =>
                  setCourseState({
                    ...courseState,
                    courseQuota: e.target.value,
                  })
                }
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
