// Firestore에서 데이터를 가져와 화면에 표시
document.addEventListener('DOMContentLoaded', displayResults);

function displayResults() {
    db.collection('students').get()
        .then((querySnapshot) => {
            const students = [];
            querySnapshot.forEach((doc) => {
                students.push({ id: doc.id, ...doc.data() });
            });
            processResults(students);
        })
        .catch((error) => {
            console.error('데이터 가져오기 실패:', error);
        });
}

// 결과 데이터를 처리하고 화면에 표시
function processResults(students) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // 기존 내용을 초기화

    students.forEach(student => {
        const studentInfo = document.createElement('p');
        studentInfo.textContent = `이름: ${student.name}, 직업: ${student.chosen_job}, 임금: ${student.desired_wage}`;
        resultsDiv.appendChild(studentInfo);
    });
}
