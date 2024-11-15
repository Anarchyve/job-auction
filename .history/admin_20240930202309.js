// Firestore에서 데이터를 가져와 화면에 표시
document.addEventListener('DOMContentLoaded', displayResults);

function displayResults() {
    db.collection('students').get()
        .then((querySnapshot) => {
            const students = [];
            querySnapshot.forEach((doc) => {
                students.push({ id: doc.id, ...doc.data() });
            });

            // 평균 임금의 4배로 상한선 계산
            const upperLimit = calculateDynamicUpperLimit(students, 4);

            // 상한선 이하인 학생들만 선발
            const validStudents = students.filter(student => isWageWithinLimit(student.desired_wage, upperLimit));

            // 유효한 학생들을 직업별로 정렬하고 결과 처리
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

// 동적 상한선 계산 (평균 임금의 multiplier배)
function calculateDynamicUpperLimit(students, multiplier) {
    const totalWages = students.reduce((sum, student) => sum + student.desired_wage, 0);
    const averageWage = totalWages / students.length;
    return averageWage * multiplier;  // 상한선을 평균 임금의 4배로 설정
}

// 임금이 상한선 내에 있는지 확인
function isWageWithinLimit(wage, upperLimit) {
    return wage <= upperLimit;
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
            const jobSection = document.createElement('div');
            jobSection.classList.add('job-section');
            
            const jobHeader = document.createElement('h2');
            jobHeader.textContent = currentJob;
            jobSection.appendChild(jobHeader);

            resultsDiv.appendChild(jobSection);
        }

        // 학생 정보 표시
        const studentInfo = document.createElement('p');
        studentInfo.textContent = `이름: ${student.name}, 임금: ${student.desired_wage}`;
        resultsDiv.lastChild.appendChild(studentInfo);
    });
}
