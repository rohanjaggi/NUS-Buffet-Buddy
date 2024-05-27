// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBR7gOiFmy5cSmjRbwARZOILFjUkQoOdnY",
  authDomain: "nus-buffet-buddy-1f2c4.firebaseapp.com",
  projectId: "nus-buffet-buddy-1f2c4",
  storageBucket: "nus-buffet-buddy-1f2c4.appspot.com",
  messagingSenderId: "518116319452",
  appId: "1:518116319452:web:aa2553fdd2b0064c64d419",
  measurementId: "G-12YXLZKJW0"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
