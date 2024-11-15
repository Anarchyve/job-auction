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

// 관리자 접근 버튼 클릭 시 알림으로 퀴즈 표시
document.getElementById('adminAccess').addEventListener('click', () => {
    if (!("Notification" in window)) {
        alert("이 브라우저는 웹 알림을 지원하지 않습니다.");
        return;
    }

    // 알림 권한 요청
    Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
            // 퀴즈 알림 생성
            const question = "퀴즈: 2x+1=5 일 때 x의 해를 구하시오";
            const notification = new Notification("관리자 접근 퀴즈", {
                body: question,
                icon: "quiz-icon.png" // 알림에 사용할 아이콘 (선택)
            });

            // 알림 클릭 시 정답 입력 요청
            notification.onclick = () => {
                const answer = prompt(question);
                if (parseInt(answer, 10) === 2) {
                    alert("정답입니다! 관리자 페이지로 이동합니다.");
                    window.location.href = "admin.html";
                } else {
                    alert("오답입니다. 다시 시도하세요.");
                }
            };
        } else {
            alert("알림 권한이 거부되었습니다. 관리자 접근이 제한됩니다.");
        }
    });
});
