import LocomotiveScroll from 'locomotive-scroll';
import { gsap } from "gsap";



const scroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true, 
});

const body = document.querySelector('body')

scroll.on('scroll', () => {
    gsap.to(".mask.is-inview", {duration: 1, width: '100%'});
})

scroll.on('call', (value) => {

    if (value === 'light') {
        body.classList.remove('dark')
        body.classList.add('light')
    }
    else if (value === 'dark') {
        body.classList.remove('light')
        body.classList.add('dark')
    }
})

document.querySelectorAll('.anchor').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const elem = document.querySelector(this.getAttribute('href'));

        scroll.scrollTo(elem)
    });
});



