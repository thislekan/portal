let cancelBtn = document.getElementById('cancel-btn');
let notifyBox = document.getElementById('notify-box');
let okBtn = document.getElementById('ok-btn');

notifyBox.style.display = 'none';

cancelBtn.addEventListener('click', () => {
    notifyBox.style.display = 'none';
    setTimeout(() => {
        location.href = '../login.html';
    }, 2500);
});

okBtn.addEventListener('click', () => {
    notifyBox.style.backgroundColor = '#673AB7';
    let message = notifyBox.querySelector('p');
    message.innerHTML = 'Your image was successfully loaded. However; you will need to log in again to continue your registration. Sorry for any inconvenience caused';
    notifyBox.style.display = 'block';
})