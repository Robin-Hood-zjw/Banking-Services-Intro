'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

//////////////////////////
//            Modal window
//////////////////////////
const openModal = function (e) {
  // prevent thw web page from jumping to the top
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', () => openModal()));

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// btbCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//////////////////////////
//Activate Page Navigation
//////////////////////////
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.getElementById('section--1');
btnScrollTo.addEventListener('click', () => {
  const s1coords = section1.getBoundingClientRect();
  section1.scrollIntoView({ behavior: 'smooth' });
  // window.scrollTo({
  //   left: window.pageXOffset + s1coords.left,
  //   top: window.pageYOffset + s1coords.top,
  //   behavior: 'smooth',
  // });
});

// Event Delegation: utilize the parent element
document.querySelector('.nav__links').addEventListener('click', e => {
  e.preventDefault();
  console.log(e.target);
  if (e.target.classList.contains('nav__link')) {
    document
      .querySelector(e.target.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  }
});

//////////////////////////
// Build tabbed Components
//////////////////////////
const btnsTabbed = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', event => {
  // specify the clicked button
  const tabbed = event.target.closest('.operations__tab');
  console.log(tabbed);

  // Guard Trick: prevent non-existing parent target
  if (!tabbed) return;

  // remove the popping effect of these three
  btnsTabbed.forEach(btn => btn.classList.remove('operations__tab--active'));
  tabsContent.forEach(area => area.classList.remove('operations__tab--active'));

  // activate the popping effect of the clicked button
  tabbed.classList.add('operations__tab--active');

  // activate the popping effect of the clicked button's content
  document
    .querySelector(`.operations__content--${tabbed.dataset.tab}`)
    .classList.add('operations__content--active');
});

//////////////////////
// Menu fade animation
//////////////////////
const navigation = document.querySelector('.nav');

const handleHover = function (event) {
  if (event.target.classList.contains('nav__link')) {
    const element = event.target;
    const siblings = element.closest('nav').querySelectorAll('.nav__link');
    const logo = element.closest('nav').querySelector('img');

    // adjust each sibling navigation element's opacity according to user input
    siblings.forEach(sibling => {
      if (sibling !== element) sibling.style.opacity = this;
    });

    // adjust the logo's opacity according to user input
    logo.style.opacity = this;
  }
};

navigation.addEventListener('mouseover', handleHover.bind(0.5));
navigation.addEventListener('mouseout', handleHover.bind(1));

//////////////////////////
//       Sticky Navigation
//////////////////////////
// const initCoords = section1.getBoundingClientRect();
// console.log(initCoords);

// window.addEventListener('scroll', function () {
//   if (window.scrollY > initCoords.top) {
//     navigation.classList.add('sticky');
//   } else {
//     navigation.classList.remove('sticky');
//   }
// });

// Method #2: inplement the use of intersection observer API

// retrieve the height of the navigation bar
const navigationHeight = navigation.getBoundingClientRect().height;

// construct the callback function that manipulate the sticky characteristic of the navigation bar
const onCallBack = function (entries) {
  const entry = entries[0];

  // check whether the triggered entry event has intersection with the target
  if (!entry.isIntersecting) {
    navigation.classList.add('sticky');
  } else {
    navigation.classList.remove('sticky');
  }
};

// manipulate the data details of the intersection observer API
const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navigationHeight}px`,
};

// call the intersection observer API evenr for the sticky characteristic of the navigation bar
const observer = new IntersectionObserver(onCallBack, obsOptions);
observer.observe(document.querySelector('.header'));

//////////////////////////
//         Reveal Sections
//////////////////////////
const allSections = document.querySelectorAll('.section');

// config the settings for the intersection observer API through callback function and options
const revealSection = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);

  // quit the intersection observer APi if the viewpoint is not insersecting
  if (!entry.isIntersecting) return;

  // liberate the target element from the
  entry.target.classList.remove('section--hidden');

  observer.unobserve(entry.target);
};

const sectionOptions = {
  root: null,
  threshold: 0.15,
};

const sectionObserver = new IntersectionObserver(revealSection, sectionOptions);

// execute the intersection observation of each section
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//////////////////////////
//      Lazy Image Loading
//////////////////////////
// select all the target images which contain high-resolution image data
const imgs = document.querySelectorAll('img[data-src]');

// configure the callback function that implements high-resolution loading
const imgLoader = function (entries, observer) {
  const [entry] = entries;

  // quit the loader if none is intersecting
  if (!entry.isIntersecting) return;

  // replace the original low-resolution images with high-resolution ones
  entry.target.src = entry.target.dataset.src;

  // remove the blur effect of the event target after 1.5 seconds
  entry.target.addEventListener('load', function () {
    setTimeout(entry.target.classList.remove('lazy-img'), 1500);
  });

  // stop observing the evemt target
  observer.unobserve(entry.target);
};
// configure the settings of the intersection observer API
const imgObserver = new IntersectionObserver(imgLoader, {
  root: null,
  threshold: 0,
  rootMargin: '300px',
});

// implement the intersection observer API for each image target
imgs.forEach(img => imgObserver.observe(img));

//////////////////////////
//          Slides Loading
//////////////////////////
const setSlides = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotsBox = document.querySelector('.dots');

  let currentSlideIdx = 0;
  const slidesNum = slides.length;

  // Functions
  const insertDots = function () {
    slides.forEach(function (_, idx) {
      dotsBox.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${idx}"></button>`
      );
    });
  };

  const highlightDot = function (slideIdx) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slideIdx}"]`)
      .classList.add('dots__dot--active');
  };

  const positionSlides = function (slideIdx) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slideIdx)}%)`)
    );
  };

  // Next slide
  const forwardSlide = function () {
    if (currentSlideIdx === slidesNum - 1) {
      currentSlideIdx = 0;
    } else {
      currentSlideIdx++;
    }

    positionSlides(currentSlideIdx);
    highlightDot(currentSlideIdx);
  };

  const backSlide = function () {
    if (currentSlideIdx === 0) {
      currentSlideIdx = slidesNum - 1;
    } else {
      currentSlideIdx--;
    }
    positionSlides(currentSlideIdx);
    highlightDot(currentSlideIdx);
  };

  const initializations = function () {
    positionSlides(0);
    insertDots();

    highlightDot(0);
  };
  initializations();

  // Event handlers
  btnRight.addEventListener('click', forwardSlide);
  btnLeft.addEventListener('click', backSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') backSlide();
    e.key === 'ArrowRight' && forwardSlide();
  });

  dotsBox.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      positionSlides(slide);
      highlightDot(slide);
    }
  });
};

setSlides();
