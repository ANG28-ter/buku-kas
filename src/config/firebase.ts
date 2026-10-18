import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAltPbieQGFXN8lLUIxdANJtpCJUJpxb_0",
    authDomain: "buku-kas-25089.firebaseapp.com",
    projectId: "buku-kas-25089",
    storageBucket: "buku-kas-25089.firebasestorage.app",
    messagingSenderId: "60719937141",
    appId: "1:60719937141:web:b42d3b10de1114aed8ea3c",
    measurementId: "G-E1G5P4NSJ2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth (without persistence config - we handle it manually in AuthContext)
const auth = getAuth(app);

// Initialize Firestore
const firestore = getFirestore(app);

export { auth, firestore };
export default app;
