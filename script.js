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
