const email = document.getElementById('email');
const password = document.getElementById('password');
const btn = document.getElementById('log-in');
const loader = document.getElementById('loader');
const alertBox = document.getElementById('alert-box');
const section = document.querySelector('section');
// const url = 'http://localhost:3000/';
const url = 'https://pacific-stream-32452.herokuapp.com/';
let message = alertBox.querySelector('p');

loader.style.display = 'none';
alertBox.style.display = 'none';
section.classList.add('shift');

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

const login = (route, userData) => {
    fetch(`${url}${route}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        })
        .then(res => {
            if (res.headers.has('x-auth')) {
                let token = res.headers.get('x-auth');
                sessionStorage.setItem('token', token);
                authenticateUser('users/me')
            } else {
                let error = Object.assign({}, res, {
                    status: res.status,
                    statusText: 'Incorrect email or password'
                });
                return Promise.reject(error);
            }
        })
        .catch(error => {
            if (error.status === 400) {
                message.innerHTML = error.statusText + '. Please try again.';
                loader.style.display = 'none';
                section.classList.remove('shift');
                alertBox.style.display = 'flex';
            }
        });

}

const authenticateUser = route => {
    fetch(`${url}${route}`, {
            method: 'GET',
            headers: {
                'x-auth': sessionStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if (res.status === 200) {
                setTimeout(() => {
                    location.href = '../public/private/profile.html';
                }, 2500);
            } else {
                let error = Object.assign({}, res, {
                    status: res.status,
                    statusText: res.statusText
                })
                return Promise.reject(error);
            }
        })
        .catch(e => {
            if (error.status === 400) {
                message.innerHTML = 'User does not exist. Please sign up to log in';
                section.classList.remove('shift');
                alertBox.style.display = 'flex';
                loader.style.display = 'none';
            }else{
                message.innerHTML = 'Please check for connection errors.';
                section.classList.remove('shift');
                alertBox.style.display = 'flex';
                loader.style.display = 'none';
            }
        });
}

btn.addEventListener('click', () => {
    let passwordLength = password.value;
    if (email.value === '' || password.value === '') {
        message.innerHTML = 'You can\'t sign up with empty data. Please check the form for empty fields.';
        section.classList.remove('shift');
        alertBox.style.display = 'flex';
    } else if (passwordLength.length < 6) {
        message.innerHTML = 'Password needs at least 6 characters to be valid.';
        section.classList.remove('shift');
        alertBox.style.display = 'flex';
    } else {
        login('users/login', { email: email.value, password: password.value });
        loader.style.display = 'flex';
    }
});

