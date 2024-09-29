// Firebase 초기화
const db = firebase.firestore();

// 데이터 가져오기 및 결과 표시
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

function processResults(students) {
    // 직업별로 그룹화
    const groupedByJob = students.reduce((acc, student) => {
        const job = student.chosen_job;
        if (!acc[job]) acc[job] = [];
        acc[job].push(student);
        return acc;
    }, {});

    // 각 직업별 최저 임금 제시자 선정
    const lowestBidders = {};
    for (const job in groupedByJob) {
        const applicants = groupedByJob[job];
        applicants.sort((a, b) => a.desired_wage - b.desired_wage);
        const lowestWage = applicants[0].desired_wage;
        // 최저 임금을 제시한 모든 학생 추출 (동점자 처리)
        const lowestApplicants = applicants.filter(student => student.desired_wage === lowestWage);
        lowestBidders[job] = lowestApplicants;
    }

    displayResultsOnPage(lowestBidders);
}

function displayAllApplicants(groupedByJob) {
    const applicantsDiv = document.getElementById('applicants');

    for (const job in groupedByJob) {
        const applicants = groupedByJob[job];
        const jobDiv = document.createElement('div');
        jobDiv.style.border = '1px solid #ccc';
        jobDiv.style.padding = '10px';
        jobDiv.style.margin = '10px 0';

        const jobTitle = document.createElement('h2');
        jobTitle.textContent = `직업: ${job}`;
        jobDiv.appendChild(jobTitle);

        const list = document.createElement('ul');
        applicants.forEach(student => {
            const listItem = document.createElement('li');
            listItem.textContent = `${student.name} - 희망 임금: ${student.desired_wage}`;
            list.appendChild(listItem);
        });
        jobDiv.appendChild(list);

        applicantsDiv.appendChild(jobDiv);
    }
}

// 필요 시 displayResults 함수 내에서 호출
function displayResults() {
    // ... 이전 코드
    displayAllApplicants(groupedByJob);
}


function displayResultsOnPage(lowestBidders) {
    const resultsDiv = document.getElementById('results');

    for (const job in lowestBidders) {
        const students = lowestBidders[job];
        const jobDiv = document.createElement('div');
        jobDiv.style.border = '1px solid #000';
        jobDiv.style.padding = '10px';
        jobDiv.style.margin = '10px 0';

        const jobTitle = document.createElement('h2');
        jobTitle.textContent = `직업: ${job}`;
        jobDiv.appendChild(jobTitle);

        const wageInfo = document.createElement('p');
        wageInfo.textContent = `최저 임금: ${students[0].desired_wage}`;
        jobDiv.appendChild(wageInfo);

        const assignedStudents = document.createElement('p');
        assignedStudents.textContent = '배정된 학생: ' + students.map(s => s.name).join(', ');
        jobDiv.appendChild(assignedStudents);

        resultsDiv.appendChild(jobDiv);
    }
}

// 페이지 로드 시 결과 표시
document.addEventListener('DOMContentLoaded', displayResults);
