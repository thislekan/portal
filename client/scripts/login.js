const email = document.getElementById('email');
const password = document.getElementById('password');
const btn = document.getElementById('log-in');
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
                    statusText: 'incorrect email or password'
                });
                let message = notifyBox.querySelector('p');
                message.innerHTML = error.statusText;
                loader.style.display = 'none';
                notifyBox.style.display = 'block';
                return Promise.reject(error);
            }
        })
        .catch(error => console.log(error));

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
        .catch(e => alert(e));
}

btn.addEventListener('click', () => {
    let message = notifyBox.querySelector('p');
    let passwordLength = password.value;
    if (email.value === '' || password.value === '') {
        message.innerHTML = 'Can\'t Log in with fields empty. Please fill in all fields.';
        notifyBox.style.display = 'flex';
    } else if (passwordLength.length < 6) {
        message.innerHTML = 'Password needs at least 6 characters to be valid.'
        notifyBox.style.display = 'flex';
    } else {
        login('users/login', { email: email.value, password: password.value });
        loader.style.display = 'flex';
    }
});

cancelBtn.addEventListener('click', () => {
    notifyBox.style.display = 'none';
})