// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

//removed app keys for security
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export {app, database};