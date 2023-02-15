import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { app, database } from '../firebaseConfig.js'
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';

export default function Home() {

  const databaseRef = collection(database, 'Student Data')

  const router = useRouter();
  const [name, setName] = useState('')
  const [age, setAge] = useState('')

  const [fireData, setFireData] = useState([])


  // get all data from db
  const getData = async () => {
    await getDocs(databaseRef)
      .then((response) => {
        const result = response.docs.map((item) => ({
          ...item.data(), id: item.id
        }))
        setFireData(result)
        console.log(result)
      })
      .catch((err) => {
        console.log(err)
      })
  };

  // Create Data, adding data to db
  const addData = () => {
    addDoc(databaseRef, {
      name: name,
      age: Number(age)
    })
      .then(() => {
        alert('data sent')
        setName('')
        setAge('')
      })
      .catch((err) => {
        console.log(err)
      })
  }

  //Update data
  const updateData = (id) => {
    let fieldToEdit = doc(database, 'Student Data', id);
    updateDoc(fieldToEdit, {
      name: name,
      age: age
    })
      .then(() => {
        alert('Data Updated')
      }).catch((err) => {
        console.log(err)
      })

  }

  useEffect(() => {
    // check login token
    let token = sessionStorage.getItem('Token')
    if (!token) {
      router.push('/register')
    }
    if (token) {
      getData();
    }
  }, []);

  return (
    <div className={styles.container}>

      <main className={styles.main}>
        <h1>Home</h1>

        <input
          placeholder='Name'
          className={styles.inputBox}
          onChange={e => setName(e.target.value)}
          value={name}
          type='text'
        />
        <input
          placeholder='Age'
          className={styles.inputBox}
          onChange={e => setAge(e.target.value)}
          value={age}
          type='number'
        />

        <button
          className={styles.button}
          onClick={addData}
        >
          Submit
        </button>

        <div>
          {
            fireData.map((data, i) => {
              return (
                <div key={i} >
                  <h3>Name: {data.name}</h3>
                  <p>Age: {data.age}</p>
                  <button
                    className={styles.button}
                    onClick={() => updateData(data.id)}
                  >
                    Update
                  </button>
                </div>
              )
            })
          }
        </div>

      </main>
    </div>
  );
}
