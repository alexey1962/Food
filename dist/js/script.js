/******/ (() => { // webpackBootstrap
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/
window.addEventListener('DOMContentLoaded', () => {
  const deadline = '2023-07-23';
  function getTimeRemaining(endtime) {
    let days, hours, minutes, seconds;
    const t = Date.parse(endtime) - Date.parse(new Date());
    if (t <= 0) {
      days = 0;
      hours = 0;
      minutes = 0;
      seconds = 0;
    } else {
      days = Math.floor(t / (1000 * 60 * 60 * 24));
      hours = Math.floor(t / 1000 * 60 * 60 % 24);
      minutes = Math.floor(t / 1000 / 60 % 60);
      seconds = Math.floor(t / 1000 % 60);
    }
    return {
      'total': t,
      'days': days,
      'hours': hours,
      'minutes': minutes,
      'seconds': seconds
    };
  }
  function getZero(num) {
    if (num >= 0 && num < 10) {
      return `0${num}`;
    } else {
      return num;
    }
  }
  function setClock(selector, endtime) {
    const timer = document.querySelector(selector);
    const days = timer.querySelector('#days'),
      hours = timer.querySelector('#hours'),
      minutes = timer.querySelector('#minutes'),
      seconds = timer.querySelector('#seconds'),
      timeInterval = setInterval(updateClock, 1000);
    updateClock();
    function updateClock() {
      const t = getTimeRemaining(endtime);
      days.innerHTML = getZero(t.days);
      hours.innerHTML = getZero(t.hours);
      minutes.innerHTML = getZero(t.minutes);
      seconds.innerHTML = getZero(t.seconds);
      t.total <= 0 ? clearInterval(timeInterval) : null;
    }
  }
  setClock('.timer', deadline);

  //Modal

  const modalTrigger = document.querySelectorAll('[data-modal]');
  const modal = document.querySelector('.modal');
  const modalClose = document.querySelector('[data-close]');
  const body = document.querySelector('body');
  function openModal() {
    modal.style.display = 'block';
    body.style.overflow = 'hidden';
    clearInterval(modalTimerId);
  }
  function closeModal() {
    modal.style.display = 'none';
    body.style.overflow = '';
  }
  modalTrigger.forEach(item => {
    item.addEventListener('click', () => {
      openModal();
    });
  });
  modal.addEventListener('click', e => {
    if (e.target === modal || e.target === modalClose) {
      closeModal();
    }
  });
  document.addEventListener('keydown', e => {
    if (e.code === 'Escape') {
      closeModal();
    }
  });
  const modalTimerId = setTimeout(openModal, 3000);
  function showModalByScroll() {
    if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
      openModal();
      window.removeEventListener('scroll', showModalByScroll);
    }
  }
  window.addEventListener('scroll', showModalByScroll);
});
/******/ })()
;
//# sourceMappingURL=script.js.map