// const url = "http://localhost:3000/";
const url = 'https://pacific-stream-32452.herokuapp.com/';
const loader = document.getElementById('loader');
const notifyBox = document.getElementById('notify-box')
const cancelBtn = document.getElementById('cancel-btn');
const fullname = document.getElementById('fullname');
const avatar = document.getElementById('avatar');
const gender = document.getElementById('gender');
const faculty = document.getElementById('faculty');
const department = document.getElementById('department');
const level = document.getElementById('level');
const regNo = document.getElementById('regNo');
const _creatorName = document.getElementById('_creatorName');
const cells = document.querySelectorAll('td');
const submitBtn = document.getElementById('submit-btn');
const imgBtn = document.getElementById('img-btn');
const thumb = document.getElementById('thumb');
const newform = document.forms.namedItem('imageUpload');
const tbody = document.querySelector('tbody');
const logOut = document.getElementById('logout');
let message = notifyBox.querySelector('p');

loader.style.display = 'none';
notifyBox.style.display = 'none';

newform.action = `${url}upload/${sessionStorage.getItem('userId')}`;

thumb.style.display = 'none';
var openFile = function (event) {
    var input = event.target;

    var reader = new FileReader();
    reader.onload = function () {
        var dataURL = reader.result;
        var output = document.getElementById('thumb');
        output.src = dataURL;
        thumb.style.display = 'block';
    };
    reader.readAsDataURL(input.files[0]);
};

const getCourse = () => {
    let courses = [];
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].classList.contains('course')) {
            courses.push(cells[i].innerHTML);
        }
    }
    return courses
}
var courses = getCourse();

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

fetch(`${url}users/me`, {
        method: 'GET',
        headers: {
            'x-auth': sessionStorage.getItem('token'),
            'Content-Type': 'application/json'
        }
    })
    .then(hanldeResponse)
    .then(data => {
        sessionStorage.setItem('student_name', data.name);
        sessionStorage.setItem('userId', data._id);
        if (data.imageUrl) {
            sessionStorage.setItem('imageUrl', data.imageUrl);
        } else {
            sessionStorage.setItem('imageUrl', 'https://res.cloudinary.com/thislekan/image/upload/v1514755522/ALC2.0 Development/user-male-black-shape.svg');
        }
    })
    .catch(e => {
        if (e.status === 400) {
            message.innerHTML = 'User does not exist.';
            notifyBox.style.display = 'block';
            notifyBox.style.backgroundColor = 'rgb(227, 13, 13)';
        }
    });

const createStudentData = data => {
    fetch(`${url}data`, {
            method: 'POST',
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
        })
        .catch(error => {
            if (error.status === 400) {
                message.innerHTML = 'User does not exist.';
                notifyBox.style.display = 'block';
                notifyBox.style.backgroundColor = 'rgb(227, 13, 13)';
            }
        });
}

avatar.src = sessionStorage.getItem('imageUrl');
fullname.innerHTML = sessionStorage.getItem('student_name');

submitBtn.addEventListener('click', () => {
    if (gender.value === '' || department.value === '' || faculty.value === '' || level.value === '' || regNo.value === '') {
        message.innerHTML = 'You can\'t submit a form with empty data. Please ensure all fields are filled';
        notifyBox.style.display = 'block';
        notifyBox.style.backgroundColor = 'rgb(227, 13, 13)';
    } else {
        loader.style.display = 'flex';
        setTimeout(() => {
            createStudentData({
                gender: gender.value,
                department: department.value,
                faculty: faculty.value,
                level: level.value,
                regNo: regNo.value,
                courses
            });
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
        .catch(e => {
            location.href = '../login.html';
        });
});

imgBtn.addEventListener('click', e => {
    if (!image.value) {
        e.preventDefault();
        alert('Please select an image');
    }
});

window.onload = () => {
    if (avatar.src === `${url}public/private/null`) {
        location.reload();
    }
}