document.getElementById("jobForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const classId = document.getElementById("classId").value; // 학급 정보 가져오기
    const job = document.getElementById("job").value;
    const wage = document.getElementById("wage").value;

    db.collection("students").add({
        name: name,
        classId: classId, // 학급 정보 저장
        chosen_job: job,
        desired_wage: Number(wage)
    })
    .then(function(docRef) {
        alert("제출되었습니다!");
    })
    .catch(function(error) {
        alert("데이터 전송에 실패했습니다.");
    });
});
