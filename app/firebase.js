// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB7MUfkjTGOlBzV0yD3Jd86s-gr_rMkoiU",
  authDomain: "flashcardsaas-cc25b.firebaseapp.com",
  projectId: "flashcardsaas-cc25b",
  storageBucket: "flashcardsaas-cc25b.appspot.com",
  messagingSenderId: "125034728132",
  appId: "1:125034728132:web:9cf9fd88cf5bcee0a9d791",
  measurementId: "G-54PXBXX4YD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);