const name = document.getElementById('name');
const email = document.getElementById('email');
const password = document.getElementById('password');
const btn = document.getElementById('sign-up');
const loader = document.getElementById('loader');
const notifyBox = document.getElementById('notify-box');
const cancelBtn = document.getElementById('cancel-btn');
// const url = 'http://localhost:3000/';
const url = 'https://pacific-stream-32452.herokuapp.com/';

loader.style.display = 'none';
notifyBox.style.display = 'none';

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
        .catch(error => alert(error));
}

btn.addEventListener('click', () => {
    let message = notifyBox.querySelector('p');
    let passwordLength = password.value;
    if (email.value === '' || password.value === '' || name.value === '') {
        message.innerHTML = 'Can\'t Log in with fields empty. Please fill in all fields.';
        notifyBox.style.display = 'flex';
    } else if (passwordLength.length < 6) {
        message.innerHTML = 'Password needs at least 6 characters to be valid.'
        notifyBox.style.display = 'flex';
    } else {
        signUp({ email: email.value, password: password.value, name: name.value });
        loader.style.display = 'flex';
    }
});

cancelBtn.addEventListener('click', () => {
    notifyBox.style.display = 'none';
});