import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react';
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

export default function Home() {
  const databaseRef = collection(database, 'Student Data');
  const router = useRouter();

  // init data
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [ID, setID] = useState(null);

  // control button -> Submit | Update btn
  const [isUpdate, setIsUpdate] = useState(false);

  // db array
  const [fireData, setFireData] = useState([]);

  // get all data from db
  const getData = async () => {
    await getDocs(databaseRef)
      .then((response) => {
        const result = response.docs.map((item) => ({
          ...item.data(),
          id: item.id,
        }));
        setFireData(result);
        console.log(result);
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
    })
      .then(() => {
        alert('data sent');
        setName('');
        setAge('');
        getData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //Edit data
  const getID = (id, name, age) => {
    setID(id);
    setName(name);
    setAge(age);
    setIsUpdate(true);
    getData();
  };
  //Update data
  const updateFields = () => {
    let fieldToEdit = doc(database, 'Student Data', ID);
    updateDoc(fieldToEdit, {
      name: name,
      age: Number(age),
    })
      .then(() => {
        alert('Data Updated');
        getData();
        setName('');
        setAge('');
        setIsUpdate(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //Delete Data
  const deleteData = (id) => {
    let fieldToEdit = doc(database, 'Student Data', id);
    deleteDoc(fieldToEdit)
      .then(() => {
        alert('Data Delete');
        getData();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // Logout function for btn
  const logout = () => {
    sessionStorage.removeItem('Token');
    router.push('/register');
  };

  useEffect(() => {
    // check login token
    let token = sessionStorage.getItem('Token');
    if (!token) {
      router.push('/register');
    }
    if (token) {
      getData();
    }
  }, []);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>Home</h1>

        <div>
          <button onClick={logout}>Log Out</button>
        </div>

        <input
          placeholder="Name"
          className={styles.inputBox}
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
        />
        <input
          placeholder="Age"
          className={styles.inputBox}
          onChange={(e) => setAge(e.target.value)}
          value={age}
          type="number"
        />

        {isUpdate ? (
          <button className={styles.button} onClick={updateFields}>
            Update
          </button>
        ) : (
          <button className={styles.button} onClick={addData}>
            Submit
          </button>
        )}

        <div>
          {fireData.map((data, i) => {
            return (
              <div key={i}>
                <h3>Name: {data.name}</h3>
                <p>Age: {data.age}</p>
                <button
                  className={styles.button}
                  onClick={() => getID(data.id, data.name, data.age)}
                >
                  Edit
                </button>
                <button
                  className={styles.button}
                  onClick={() => deleteData(data.id)}
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
