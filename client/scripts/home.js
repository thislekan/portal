let slides = document.getElementsByClassName('slide');
let navBtn = document.getElementById('nav-btn');
let header = document.querySelector('header');
let menu = document.getElementById('fixed-nav');
let article = document.querySelector('article');
let navbar = document.getElementById('navbar');
let triggers = document.querySelectorAll('.trigger');
let background = document.querySelector('.dropdown-background');

let viewHeight = window.innerHeight;
let slideIndex = 0;

function slideText() {
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
    }
    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }
    slides[slideIndex - 1].style.display = 'block';
    setTimeout(slideText, 4000);
}

slideText();
menu.style.left = '100%'

navBtn.addEventListener('click', () => {
    if (menu.style.left !== '100%') {
        menu.style.left = '100%';
        header.classList.remove('shift');
        article.classList.remove('shift');
        navBtn.style.color = 'initial';
    } else {
        menu.style.left = '15%';
        header.classList.add('shift');
        article.classList.add('shift');
        navBtn.style.color = 'white';
    }
});

function handleEnter() {
    const dropdown = this.querySelector('.dropdown');
    dropdown.style.visibility = 'visible';

    this.classList.add('trigger-enter');
    setTimeout(() => this.classList.add('trigger-enter-active'), 250);
    background.classList.add('open');


    const dropdownCoords = dropdown.getBoundingClientRect();

    const coords = {
        height: dropdownCoords.height + 15,
        width: dropdownCoords.width + 20,
        top: dropdownCoords.top,
        left: dropdownCoords.left
    }
    background.style.setProperty('width', `${coords.width}px`);
    background.style.setProperty('height', `${coords.height}px`);
    background.style.setProperty('transform', `translate(${coords.left}px, ${coords.top}px)`);
}

function handleLeave() {
    const dropdown = this.querySelector('.dropdown');
    dropdown.style.visibility = 'hidden';
    this.classList.remove('trigger-enter', 'trigger-enter-active');
    background.classList.remove('open');
}

triggers.forEach(trigger => trigger.addEventListener('mouseenter', handleEnter));
triggers.forEach(trigger => trigger.addEventListener('mouseleave', handleLeave));

window.addEventListener('scroll', () => {
    if (window.scrollY < viewHeight) {
        navbar.classList.remove('back-color');
    } else {
        navbar.classList.add('back-color');
    }
})