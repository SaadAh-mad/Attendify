// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getStorage} from "firebase/storage";
import { getAuth, GoogleAuthProvider} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAiClRZyHSQt7oiI2sMYaLCdH_PeN9E8g4",
  authDomain: "webattendance-424c6.firebaseapp.com",
  projectId: "webattendance-424c6",
  storageBucket: "webattendance-424c6.firebasestorage.app",
  messagingSenderId: "188871710332",
  appId: "1:188871710332:web:1624c010027a0f6ee91bf9",
  measurementId: "G-D7E25K07E6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {app,db,storage,auth,provider}