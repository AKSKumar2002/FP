// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD9dDVXRfvZpIfWs7WHFEY_CyWZR3q-bA8",
    authDomain: "farmpick-auth-84ea9.firebaseapp.com",
    projectId: "farmpick-auth-84ea9",
    storageBucket: "farmpick-auth-84ea9.firebasestorage.app",
    messagingSenderId: "479900706938",
    appId: "1:479900706938:web:550e7ae6988b8832c9b3c3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
