// Firestore 연동을 위한 Firestore SDK 가져오기
import { getFirestore, collection, addDoc } from "firebase/firestore"; 

// Firestore 초기화
const db = getFirestore();

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
