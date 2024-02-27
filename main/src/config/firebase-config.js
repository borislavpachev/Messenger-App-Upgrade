// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA6ZcjXjo7RQt9d44WJCrVJtxGFjwuMk78",
    authDomain: "collab-app-79dd7.firebaseapp.com",
    projectId: "collab-app-79dd7",
    storageBucket: "collab-app-79dd7.appspot.com",
    messagingSenderId: "1017432822355",
    appId: "1:1017432822355:web:64396773e6b49273a9aca6",
    databaseURL: "https://collab-app-79dd7-default-rtdb.europe-west1.firebasedatabase.app/"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
// the Realtime Database handler
export const db = getDatabase(app);

export const storage = getStorage(app);