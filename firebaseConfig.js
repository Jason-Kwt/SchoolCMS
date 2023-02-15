
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC12UBrgBlkR2GxIccWRzRE-iS77R7b4CQ",
  authDomain: "schoolcms-47537.firebaseapp.com",
  projectId: "schoolcms-47537",
  storageBucket: "schoolcms-47537.appspot.com",
  messagingSenderId: "389058487586",
  appId: "1:389058487586:web:f09c0f423c085d040a317b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app)


