import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration (Authentication only for now).
const firebaseConfig = {
    apiKey: "AIzaSyAfDI3KNcIQhcA5GRh7G-q33jLk25xhLbY",
    authDomain: "crackers-supermarket.firebaseapp.com",
    projectId: "crackers-supermarket",
    storageBucket: "crackers-supermarket.firebasestorage.app",
    messagingSenderId: "413659405126",
    appId: "1:413659405126:web:cf9f6e6e0cf99fd4ad6347"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.firebaseApp = app;
window.firebaseAuth = auth;

export { app, auth };
