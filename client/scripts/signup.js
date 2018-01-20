const name = document.getElementById('name');
const email = document.getElementById('email');
const password = document.getElementById('password');
const btn = document.getElementById('sign-up');
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

const signUp = (userData) => {
    fetch(`${url}users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        })
        .then(hanldeResponse)
        .then(data => {
            setTimeout(() => {
                location.href = '../public/login.html';
            }, 2500);
        })
        .catch(error => {
            if (error.status === 400) {
                message.innerHTML = 'Please check for connection errors. If none, then the email already exist. Please use another email or login.';
                section.classList.remove('shift');
                alertBox.style.display = 'flex';
                loader.style.display = 'none';
            }
        });
}

btn.addEventListener('click', () => {
    let passwordLength = password.value;
    if (email.value === '' || password.value === '' || name.value === '') {
        message.innerHTML = 'You can\'t sign up with empty data. Please check the form for empty fields.';
        section.classList.remove('shift');
        alertBox.style.display = 'flex';
    } else if (passwordLength.length < 6) {
        message.innerHTML = 'Password needs at least 6 characters to be valid.';
        section.classList.remove('shift');
        alertBox.style.display = 'flex';
    } else {
        signUp({ email: email.value, password: password.value, name: name.value });
        loader.style.display = 'flex';
        alertBox.style.display = 'none';
    }
});

