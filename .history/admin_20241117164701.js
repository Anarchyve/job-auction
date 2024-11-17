// 데이터 조회 버튼 이벤트 리스너
document.getElementById('fetchData').addEventListener('click', displayResults);

// 학급 데이터 삭제 버튼 이벤트 리스너
document.getElementById('deleteAllData').addEventListener('click', () => {
    console.log('Delete button clicked');
    deleteClassData();
});

// 학생 페이지 이동 버튼 이벤트 리스너
document.getElementById('goToStudentPage').addEventListener('click', () => {
    window.location.href = 'index.html'; // 학생 페이지로 이동
});

// 동적 상한선 계산 함수
function calculateDynamicUpperLimit(students, multiplier) {
    const totalWages = students.reduce((sum, student) => sum + student.desired_wage, 0);
    const averageWage = totalWages / students.length;
    return averageWage * multiplier;
}

// 희망 가격이 상한선 내에 있는지 확인하는 함수
function isWageWithinLimit(wage, upperLimit) {
    return wage <= upperLimit;
}

// 조회 결과를 화면에 출력
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

// 학급별 데이터 조회
function displayResults() {
    const classInput = document.getElementById('classInput').value.trim();

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

// 학급 데이터만 삭제
function deleteClassData() {
    const classInput = document.getElementById('classInput').value.trim();

    if (!classInput) {
        alert('학급명을 입력하세요.');
        return;
    }

    if (confirm(`"${classInput}" 학급의 데이터를 정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
        db.collection('students').where('class', '==', classInput).get()
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    alert(`"${classInput}" 학급에 해당하는 데이터가 없습니다.`);
                    return;
                }

                const batch = db.batch();
                querySnapshot.forEach((doc) => {
                    batch.delete(doc.ref); // 특정 학급 데이터만 삭제
                });

                return batch.commit(); // Batch 실행
            })
            .then(() => {
                alert(`"${classInput}" 학급의 데이터가 삭제되었습니다.`);
                console.log(`"${classInput}" 학급 데이터 삭제 완료`);
                const resultsDiv = document.getElementById('results');
                resultsDiv.innerHTML = ''; // 삭제 후 화면 초기화
            })
            .catch((error) => {
                console.error('데이터 삭제 실패:', error);
                alert('데이터 삭제 중 문제가 발생했습니다.');
            });
    } else {
        console.log('삭제 작업 취소됨');
    }
}
