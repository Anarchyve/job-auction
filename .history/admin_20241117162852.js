// 데이터 조회 버튼 이벤트 리스너
document.getElementById('fetchData').addEventListener('click', displayResults);

// 데이터 삭제 버튼 이벤트 리스너
document.getElementById('deleteAllData').addEventListener('click', () => {
    console.log('Delete button clicked');
    deleteAllData();
});

// 학급별 데이터 조회
function displayResults() {
    const classInput = document.getElementById('classInput').value;

    if (!classInput) {
        alert('학급명을 입력하세요.');
        return;
    }

    db.collection('students').where('class', '==', classInput).get()
        .then((querySnapshot) => {
            const students = [];
            querySnapshot.forEach((doc) => {
                students.push({ id: doc.id, ...doc.data() });
            });

            const upperLimit = calculateDynamicUpperLimit(students, 4);
            const validStudents = students.filter(student => isWageWithinLimit(student.desired_wage, upperLimit));

            const sortedStudents = validStudents.sort((a, b) => {
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

function calculateDynamicUpperLimit(students, multiplier) {
    const totalWages = students.reduce((sum, student) => sum + student.desired_wage, 0);
    const averageWage = totalWages / students.length;
    return averageWage * multiplier;
}

function isWageWithinLimit(wage, upperLimit) {
    return wage <= upperLimit;
}

function processResults(students) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    let currentJob = '';

    students.forEach(student => {
        if (student.chosen_job !== currentJob) {
            currentJob = student.chosen_job;
            const jobSection = document.createElement('div');
            jobSection.classList.add('job-section');

            const jobHeader = document.createElement('h2');
            jobHeader.textContent = currentJob;
            jobSection.appendChild(jobHeader);

            resultsDiv.appendChild(jobSection);
        }

        const studentInfo = document.createElement('p');
        studentInfo.textContent = `이름: ${student.name}, 희망 가격: ${student.desired_wage}`;
        resultsDiv.lastChild.appendChild(studentInfo);
    });
}

// 모든 데이터 삭제
function deleteAllData() {
    if (confirm('정말로 모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
        db.collection('students').get()
            .then((querySnapshot) => {
                const batch = db.batch(); // Batch 사용
                querySnapshot.forEach((doc) => {
                    batch.delete(doc.ref);
                });
                return batch.commit(); // Batch 작업 실행
            })
            .then(() => {
                alert('모든 데이터가 삭제되었습니다.');
                console.log('모든 데이터 삭제 완료');
                const resultsDiv = document.getElementById('results');
                resultsDiv.innerHTML = ''; // 삭제 후 화면 초기화
            })
            .catch((error) => {
                console.error('데이터 삭제 실패:', error);
            });
    } else {
        console.log('삭제 작업 취소됨');
    }
}
