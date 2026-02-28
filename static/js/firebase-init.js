import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

// Firebase configuration for Crackers Supermarket.
const firebaseConfig = {
    apiKey: "AIzaSyAfDI3KNcIQhcA5GRh7G-q33jLk25xhLbY",
    authDomain: "crackers-supermarket.firebaseapp.com",
    projectId: "crackers-supermarket",
    storageBucket: "crackers-supermarket.firebasestorage.app",
    messagingSenderId: "413659405126",
    appId: "1:413659405126:web:cf9f6e6e0cf99fd4ad6347"
};

// Initialize Firebase and expose it for other page scripts.
const app = initializeApp(firebaseConfig);
window.firebaseApp = app;
