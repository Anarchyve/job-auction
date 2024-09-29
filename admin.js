// Firestore에서 데이터를 가져와 화면에 표시
document.addEventListener('DOMContentLoaded', displayResults);

function displayResults() {
    db.collection('students').get()
        .then((querySnapshot) => {
            const students = [];
            querySnapshot.forEach((doc) => {
                students.push({ id: doc.id, ...doc.data() });
            });

            // 데이터를 직업별로 분류하고 임금 순으로 정렬
            const sortedStudents = students.sort((a, b) => {
                if (a.chosen_job < b.chosen_job) return -1;
                if (a.chosen_job > b.chosen_job) return 1;
                if (a.desired_wage < b.desired_wage) return -1;
                if (a.desired_wage > b.desired_wage) return 1;
                return 0;
            });

            processResults(sortedStudents);
        })
        .catch((error) => {
            console.error('데이터 가져오기 실패:', error);
        });
}

// 결과 데이터를 처리하고 화면에 표시
function processResults(students) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // 기존 내용을 초기화

    let currentJob = '';

    students.forEach(student => {
        // 새로운 직업 섹션을 추가
        if (student.chosen_job !== currentJob) {
            currentJob = student.chosen_job;
            const jobHeader = document.createElement('h2');
            jobHeader.textContent = currentJob;
            resultsDiv.appendChild(jobHeader);
        }

        // 학생 정보 표시
        const studentInfo = document.createElement('p');
        studentInfo.textContent = `이름: ${student.name}, 임금: ${student.desired_wage}`;
        resultsDiv.appendChild(studentInfo);
    });
}
