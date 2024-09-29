// 'db' 변수를 재선언하지 않고 그대로 사용

// 페이지 로드 시 결과 표시
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

// 나머지 코드...
