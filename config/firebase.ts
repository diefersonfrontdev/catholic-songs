// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAB5jJ53VieVO503olBogwiuolLLc8fb0A",
  authDomain: "catholic-songs-b13c6.firebaseapp.com",
  projectId: "catholic-songs-b13c6",
  storageBucket: "catholic-songs-b13c6.firebasestorage.app",
  messagingSenderId: "317547541710",
  appId: "1:317547541710:web:a13054aca01d4ea8b18c9f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)