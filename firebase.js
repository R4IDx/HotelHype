import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2sxx6vlDMpGKI8KMLRI6uLIH-BIud58s",
  authDomain: "hotelcheckmoco.firebaseapp.com",
  projectId: "hotelcheckmoco",
  storageBucket: "hotelcheckmoco.appspot.com",
  messagingSenderId: "452565010257",
  appId: "1:452565010257:web:9a845d8dc5b941c563f570",
  measurementId: "G-S0L9705V4P"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
const auth = firebase.auth();
const firestore = firebase.firestore();

export{auth, firestore, firebase};