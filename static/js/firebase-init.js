// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfDI3KNcIQhcA5GRh7G-q33jLk25xhLbY",
  authDomain: "crackers-supermarket.firebaseapp.com",
  databaseURL: "https://crackers-supermarket-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "crackers-supermarket",
  storageBucket: "crackers-supermarket.firebasestorage.app",
  messagingSenderId: "413659405126",
  appId: "1:413659405126:web:b8c9747937ad401dad6347",
  measurementId: "G-KKDYE7T56W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);