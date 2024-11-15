// Firestore에서 데이터를 가져와 화면에 표시
function filterByClass() {
    const adminClassId = document.getElementById("adminClassId").value; // 입력받은 학급 정보
    if (!adminClassId) {
        alert("학급을 입력해주세요.");
        return;
    }

    db.collection('students').where("classId", "==", adminClassId).get()
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

            renderResults(sortedStudents);
        })
        .catch((error) => {
            console.error('데이터 가져오기 실패:', error);
        });
}

// 결과 데이터를 처리하고 화면에 표시
function renderResults(students) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // 기존 내용을 초기화

    const groupedResults = students.reduce((groups, student) => {
        const job = student.chosen_job;
        if (!groups[job]) {
            groups[job] = [];
        }
        groups[job].push(student);
        return groups;
    }, {});

    for (const [job, entries] of Object.entries(groupedResults)) {
        const jobSection = document.createElement('div');
        jobSection.classList.add('job-section');

        const jobHeader = document.createElement('h2');
        jobHeader.textContent = job;
        jobSection.appendChild(jobHeader);

        entries.forEach(student => {
            const studentInfo = document.createElement('p');
            studentInfo.textContent = `이름: ${student.name}, 학급: ${student.classId}, 희망 가격: ${student.desired_wage}`;
            jobSection.appendChild(studentInfo);
        });

        resultsDiv.appendChild(jobSection);
    }
}
