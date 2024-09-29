document.getElementById("jobForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const job = document.getElementById("job").value;
    const wage = document.getElementById("wage").value;

    db.collection("students").add({
        name: name,
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
