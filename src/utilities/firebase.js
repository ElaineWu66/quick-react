// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database"; // Import for Realtime Database


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDMrr_j1wH1ChQ56Zdggg3S9GoDvnORCF0",
  authDomain: "time-table-9c5d5.firebaseapp.com",
  databaseURL: "https://time-table-9c5d5-default-rtdb.firebaseio.com",
  projectId: "time-table-9c5d5",
  storageBucket: "time-table-9c5d5.appspot.com",
  messagingSenderId: "937351311513",
  appId: "1:937351311513:web:7bbb8826eaba0a77db8808",
  measurementId: "G-NQ6ENV05L8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getDatabase(app);
