const nameDisplayed = document.getElementById('fullname');
const avatar = document.getElementById('avatar');
const name = document.getElementById('name');
const image = document.getElementById('image');
const cells = document.querySelectorAll('td');
const tbody = document.querySelector('tbody');
const nameBtn = document.getElementById('name-btn');
const fullname = document.getElementById('fullname');
const displayName = document.getElementById('user-name');
const displayFac = document.getElementById('user-fac');
const displayDept = document.getElementById('user-dept');
const displayLevel = document.getElementById('user-level');
const displayImg = document.getElementById('user-img');
const logOut = document.getElementById('logout');
const notifyBox = document.getElementById('notify-box');
const notifBtn = notifyBox.querySelector('button');
// const url = 'http://localhost:3000/';
const url = 'https://pacific-stream-32452.herokuapp.com/';

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
        displayImg.src = data.imageUrl;
        displayName.innerHTML = data.name;
    })
    .catch(e => console.log(e));

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
        displayDept.innerHTML = data.data.department + ' Department';
        displayFac.innerHTML = 'Faculty of ' + data.data.faculty;
        displayLevel.innerHTML = data.data.level;
        if (data.data.courseTable) {
            tbody.innerHTML = data.data.courseTable;
        }
    })
    .catch(e => {
        let message = notifyBox.querySelector('p');
        message.innerHTML = 'You haven\'t completed your profile. You\'ll be redirected in a second.';
        notifyBox.style.display = 'block';
    });

notifBtn.addEventListener('click', () => {
    notifyBox.style.display = 'none';
    setTimeout(() => {
        location.href = '../private/profile.html';
    }, 1500);
});

avatar.src = sessionStorage.getItem('imageUrl');
fullname.innerHTML = sessionStorage.getItem('student_name');

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
});