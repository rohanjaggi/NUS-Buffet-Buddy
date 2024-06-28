// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBR7gOiFmy5cSmjRbwARZOILFjUkQoOdnY",
  authDomain: "nus-buffet-buddy-1f2c4.firebaseapp.com",
  databaseURL: "https://nus-buffet-buddy-1f2c4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "nus-buffet-buddy-1f2c4",
  storageBucket: "nus-buffet-buddy-1f2c4.appspot.com",
  messagingSenderId: "518116319452",
  appId: "1:518116319452:web:870a8607b0c3221c64d419",
  measurementId: "G-RZQ11WP5JP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const FIREBASE_AUTH = getAuth(app);
export const FIREBASE_DB = getFirestore(app);
export const FIREBASE_RDB = getDatabase(app);