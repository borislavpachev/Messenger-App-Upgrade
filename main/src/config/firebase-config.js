// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC5b6MztGpUffTiMB4-rAOZeHh1pXMIBNU",
    authDomain: "colaboration-messenger.firebaseapp.com",
    projectId: "colaboration-messenger",
    storageBucket: "colaboration-messenger.appspot.com",
    messagingSenderId: "455460785162",
    appId: "1:455460785162:web:a78cdad542fbda933323f3",
    databaseURL: "https://colaboration-messenger-default-rtdb.europe-west1.firebasedatabase.app/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
// the Realtime Database handler
export const db = getDatabase(app);

export const storage = getStorage(app);