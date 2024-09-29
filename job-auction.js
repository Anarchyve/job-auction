// Firestore와 관련된 기능 import
import { collection, addDoc } from "firebase/firestore";
import { db } from './firebase-config'; // Firebase 설정 가져오기

// 폼 제출 시 Firestore에 데이터 저장
document.getElementById("jobForm").addEventListener("submit", async (event) => {
    event.preventDefault(); // 폼 제출 시 새로고침 방지

    // 입력된 폼 데이터를 가져옴
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
        alert("데이터 전송에 실패했습니다.");
    }
});
