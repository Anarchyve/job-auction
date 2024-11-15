// 학생 데이터 제출
document.getElementById("jobForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const className = document.getElementById("class").value;
    const job = document.getElementById("job").value;
    const wage = document.getElementById("wage").value;

    db.collection("students").add({
        name: name,
        class: className,
        chosen_job: job,
        desired_wage: Number(wage)
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        alert("제출되었습니다!");
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
        alert("데이터 전송에 실패했습니다.");
    });
});

// 관리자 페이지 접근 버튼
document.getElementById("adminAccess").addEventListener("click", function() {
    const answer = prompt("퀴즈: 2x+1=5 일 때 x의 해는?");
    if (parseInt(answer, 10) === 2) {
        alert("정답입니다! 관리자 페이지로 이동합니다.");
        window.location.href = "admin.html"; // 관리자 페이지로 이동
    } else {
        alert("오답입니다. 관리자 페이지에 접근할 수 없습니다.");
    }
});
