// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBH6s4Mg46Ii5SkB6e-ePZnzpTPlcy95vA",
    authDomain: "farmpick-auth.firebaseapp.com",
    projectId: "farmpick-auth",
    storageBucket: "farmpick-auth.firebasestorage.app",
    messagingSenderId: "183643252260",
    appId: "1:183643252260:web:489de5bc75f2e6ac355ab1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
