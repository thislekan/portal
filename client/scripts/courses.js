// const url = "http://localhost:3000/";
const url = 'https://pacific-stream-32452.herokuapp.com';
const fullname = document.getElementById('fullname');
const avatar = document.getElementById('avatar');
const faculty = document.getElementById('fac-select');
const department = document.getElementById('dept-select');
const courseSelect = document.getElementById('course-select')
const courseType = document.getElementById('type-select');
const tbody = document.querySelector('tbody');
const addBtn = document.getElementById('add-btn');
const submitBtn = document.getElementById('submit-btn');
const loader = document.getElementById('loader');
const notifyBox = document.getElementById('notify-box')
const cancelBtn = document.getElementById('cancel-btn');
const logOut = document.getElementById('logout');

loader.style.display = 'none';
notifyBox.style.display = 'none';
avatar.src = sessionStorage.getItem('imageUrl');
fullname.innerHTML = sessionStorage.getItem('student_name');

const deptOptions = ['Chemistry', 'Physics', 'Archeology', 'English', 'Economics', 'Psychology'];
const courseOptions1 = ['CHEM101', 'CHEM111'];
const courseOptions2 = ['PHY111', 'PHY131'];
const courseOptions3 = ['ARCHE101', 'ARCHE111'];
const courseOptions4 = ['LIT101', 'LIT111'];
const courseOptions5 = ['ECONS101', 'ECONS111'];
const courseOptions6 = ['PSY101', 'PSY111'];

faculty.addEventListener('change', () => {
    switch (faculty.value) {
        case 'Science':
            department.innerHTML = `<option value=''>Choose from a department</option><option value=${deptOptions[0]}>${deptOptions[0]}</option><option value=${deptOptions[1]}>${deptOptions[1]}</option>`;
            break;
        case 'Engineering':
            department.innerHTML = `<option value=''>Choose from a department</option><option value=${deptOptions[0]}>${deptOptions[0]}</option><option value=${deptOptions[1]}>${deptOptions[1]}</option>`;
            break;
        case 'Social Sciences':
            department.innerHTML = `<option value=''>Choose from a department</option><option value=${deptOptions[4]}>${deptOptions[4]}</option><option value=${deptOptions[5]}>${deptOptions[5]}</option>`;
            break;
        case 'Art':
            department.innerHTML = `<option value=''>Choose from a department</option><option value=${deptOptions[2]}>${deptOptions[2]}</option><option value=${deptOptions[3]}>${deptOptions[3]}</option>`;
            break;
        default:
            break;
    }
});

department.addEventListener('change', () => {
    switch (department.value) {
        case 'Chemistry':
            courseSelect.innerHTML = `<option value=''>Select a course</option><option value=${courseOptions1[0]}>${courseOptions1[0]}</option><option value=${courseOptions1[1]}>${courseOptions1[1]}</option>`;
            break;
        case 'Physics':
            courseSelect.innerHTML = `<option value=''>Select a course</option><option value=${courseOptions2[0]}>${courseOptions2[0]}</option><option value=${courseOptions2[1]}>${courseOptions2[1]}</option>`;
            break;
        case 'Archeology':
            courseSelect.innerHTML = `<option value=''>Select a course</option><option value=${courseOptions3[0]}>${courseOptions3[0]}</option><option value=${courseOptions3[1]}>${courseOptions3[1]}</option>`;
            break;
        case 'English':
            courseSelect.innerHTML = `<option value=''>Select a course</option><option value=${courseOptions4[0]}>${courseOptions4[0]}</option><option value=${courseOptions4[1]}>${courseOptions4[1]}</option>`;
            break;
        case 'Economics':
            courseSelect.innerHTML = `<option value=''>Select a course</option><option value=${courseOptions5[0]}>${courseOptions5[0]}</option><option value=${courseOptions5[1]}>${courseOptions5[1]}</option>`;
            break;
        case 'Psychology':
            courseSelect.innerHTML = `<option value=''>Select a course</option><option value=${courseOptions6[0]}>${courseOptions6[0]}</option><option value=${courseOptions6[1]}>${courseOptions6[1]}</option>`;
            break;
        default:
            break;
    }
})

addBtn.addEventListener('click', () => {
    if (faculty.value === '' || department.value === '' || courseType.value === '' || courseSelect.value === '') {
        alert('Please fill in all empty fields');
    } else {
        const serialNo = document.querySelectorAll('.serial-no');
        let tr = `<td class="serial-no">${serialNo.length + 1}</td><td class="course">${courseSelect.value}</td><td>${courseType.value}</td><td>Registered</td>`;
        tbody.innerHTML += tr;
    }
});

const getCourse = () => {
    const cells = document.querySelectorAll('td');
    let courses = [];
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].classList.contains('course')) {
            courses.push(cells[i].innerHTML);
        }
    }
    return courses
}

function hanldeResponse(res) {
    return res.json()
        .then(data => {
            if (res.ok) {
                return data;
            } else {
                let error = Object.assign({}, res, {
                    status: res.status,
                    statusText: res.statusText
                })
                return Promise.reject(error);
            }
        })
}


fetch(`${url}confirmData`, {
        method: 'GET',
        headers: {
            'x-auth': sessionStorage.getItem('token'),
            'Content-Type': 'application/json'
        }
    })
    .then(hanldeResponse)
    .then(data => {
        sessionStorage.setItem('dataId', data.data._id);
        if (data.data.courseTable) {
            tbody.innerHTML = data.data.courseTable;
        }
    })
    .catch(e => console.log(e));

const updateCourses = data => {
    //id here is the dataId
    fetch(`${url}data/${sessionStorage.getItem('dataId')}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth': sessionStorage.getItem('token')
            },
            body: JSON.stringify(data)
        })
        .then(hanldeResponse)
        .then(data => {
            loader.style.display = 'none';
            notifyBox.style.display = 'block';
            // console.log(data);
        })
        .catch(error => console.log(error));
}

submitBtn.addEventListener('click', () => {
    if (faculty.value === '' || department.value === '' || courseType.value === '' || courseSelect.value === '') {
        let message = notifyBox.querySelector('p');
        message.innerHTML = 'You can\'t submit a form with empty data. Please ensure all fields are filled';
        notifyBox.style.display = 'block';
        notifyBox.style.backgroundColor = 'rgb(227, 13, 13)';
    } else {
        var courses = getCourse();
        let courseTable = tbody.innerHTML;
        loader.style.display = 'flex';
        setTimeout(() => {
            updateCourses({ courses, courseTable });
        }, 2000);
    }
});

cancelBtn.addEventListener('click', () => {
    notifyBox.style.display = 'none';
});

logOut.addEventListener('click', () => {
    fetch(`${url}users/me/token`, {
            method: 'DELETE',
            headers: {
                'x-auth': sessionStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        })
        .then(data => {
            sessionStorage.clear();
            location.href = '../login.html';
        })
        .catch(e => console.log(e));
})