document.getElementById('fetchData').addEventListener('click', displayResults);

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
        studentInfo.textContent = `이름: ${student.name}, 임금: ${student.desired_wage}`;
        resultsDiv.lastChild.appendChild(studentInfo);
    });
}
