// Firebase 설정 객체
const firebaseConfig = {
    apiKey: "AIzaSyC1dCqAjGq8Q7JRunxsDYCvjqxSTl6NnDE",
    authDomain: "job-auction-91c20.firebaseapp.com",
    projectId: "job-auction-91c20",
    storageBucket: "job-auction-91c20.appspot.com",
    messagingSenderId: "936152405332",
    appId: "1:936152405332:web:0edebc79884405ad9764c1",
    measurementId: "G-B6V5XDECDJ"
};

// Firebase 초기화
firebase.initializeApp(firebaseConfig);

// Firestore 초기화
const db = firebase.firestore();
