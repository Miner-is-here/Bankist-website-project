'use strict';

// Selections
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to'); // selecting btn
const section1 = document.querySelector('#section--1'); // section--1
const nav = document.querySelector('.nav');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

// Modal window

const openModal = function (e) {
  e.preventDefault();

  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// adding event listener to every btnsOpenModal
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Button scrolling
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect(); // getting DOMRect - umisteni elementu, x position, y position, width, height...
  console.log(s1coords);

  // getting the position details about the btnScrollTo (=target)
  console.log(e.target.getBoundingClientRect());

  // console.log('Current scroll (X/Y)', window.scrollX, window.scrollY);
  console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

  console.log(
    'Height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // Scrolling - new way
  section1.scrollIntoView({ behavior: 'smooth' }); // scrollIntoView works only in newer browsers
});

// Page Navigation
document.querySelector('.nav__links').addEventListener('click', function (e) {
  // console.log(e.target);
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    e.preventDefault();
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Menu Fade Animation

// when hoovered on the link, other links will be lighter, including logo
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passing 'argument' into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky navigation

const initialCoords = section1.getBoundingClientRect(); // getting location
console.log(initialCoords);

// when the header will move out of view, the navigation panel is shown
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null, // viewport
  threshold: 0, // when 0% of header is visible
  rootMargin: `${navHeight}px`, // the nav panel shows before the end of header, exactly in the length of the panel; e.g. 90 = 90px after the end of header, before is therefore -90
});
headerObserver.observe(header);

// Reveal sections

const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  // removed only if it's intersecting
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');

  observer.unobserve(entry.target); // when coming down and clicking clear console (CTRL + L) we can notice that no more intersectionObserverEntries are shown
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15, // the section is revealed only when it is from 15% "visible"
});

allSections.forEach(function (section) {
  sectionObserver.observe(section); // the target from the relevant section is important, therefore we choose the correct section to be shown
  // section.classList.add('section--hidden'); // commented because of the Slider below
});

// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]'); // we do not want all img, but we want only the one that containts data-src

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img'); // if it would not be on load, then the filter would be gone and the low quality picture would be shown, because the good quality picture would not be loaded yet
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null, // entire viewport
  threshold: 0,
  rootMargin: '200px', // we wanna load pictures before they are reached, therefore the viewer cannot recognize that there is lazy feature feature
});

imgTargets.forEach(img => imgObserver.observe(img));

// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length; // the length of node list

  // FUNCTIONS
  // see html code for dots; class="dots__dot" and data-slide=0,1,2 ...
  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    // before activating one button, it is crucial to deactivate all the other buttons
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${(i - slide) * 100}%)`)
    );
  };

  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    // if we are on the curSlide = 1 then we have -100%, 0%, 100%, 200%
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // INIT PHASE
  const init = function () {
    createDots();
    activateDot(0);
    // initial load of the page - setting up the curSlide to 0
    goToSlide(0);
    // slides.forEach((s, i) => (s.style.transform = `translateX(${i * 100}%)`)); // 0%, 100%, 200%, 300%
  };
  init();

  // EVENT HANDLERS
  // Next slide = changing the value of translateX -100
  btnRight.addEventListener('click', nextSlide);

  // Previous slide = changing the value of translateX 100
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide(); // other version of script
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;

      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
