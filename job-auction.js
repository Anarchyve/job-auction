// Firebase와 Firestore 모듈 가져오기
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore"; // Firestore 관련 모듈

// Firebase 설정 및 초기화
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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Firestore 초기화

// 폼 제출 시 Firestore에 데이터 저장
document.getElementById("jobForm").addEventListener("submit", async (event) => {
    event.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

    const name = document.getElementById("name").value;
    const job = document.getElementById("job").value;
    const wage = document.getElementById("wage").value;

    try {
        // Firestore의 students 컬렉션에 데이터 저장
        const docRef = await addDoc(collection(db, "students"), {
            name: name,
            chosen_job: job,
            desired_wage: Number(wage)
        });
        console.log("Document written with ID: ", docRef.id);
        alert("제출되었습니다!"); // 제출 성공 시 알림
    } catch (e) {
        console.error("Error adding document: ", e);
    }
});
