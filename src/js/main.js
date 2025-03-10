window.addEventListener('DOMContentLoaded', () => {
  const deadline = '2023-07-23'

  function getTimeRemaining(endtime) {
    let days, hours, minutes, seconds

    const t = Date.parse(endtime) - Date.parse(new Date())

    if (t <= 0) {
      days = 0
      hours = 0
      minutes = 0
      seconds = 0
    } else {
      days = Math.floor(t / (1000 * 60 * 60 * 24))
      hours = Math.floor((t / 1000 * 60 * 60) % 24)
      minutes = Math.floor((t / 1000 / 60) % 60)
      seconds = Math.floor((t / 1000) % 60)
    }
    return {
      'total': t,
      'days': days,
      'hours': hours,
      'minutes': minutes,
      'seconds': seconds
    }
  }

  function getZero(num) {
    if (num >= 0 && num < 10) {
      return `0${num}`
    } else {
      return num
    }
  }

  function setClock(selector, endtime) {
    const timer = document.querySelector(selector)
    const days = timer.querySelector('#days'),
      hours = timer.querySelector('#hours'),
      minutes = timer.querySelector('#minutes'),
      seconds = timer.querySelector('#seconds'),
      timeInterval = setInterval(updateClock, 1000)

    updateClock()

    function updateClock() {
      const t = getTimeRemaining(endtime)

      days.innerHTML = getZero(t.days)
      hours.innerHTML = getZero(t.hours)
      minutes.innerHTML = getZero(t.minutes)
      seconds.innerHTML = getZero(t.seconds)

      t.total <= 0 ? clearInterval(timeInterval) : null
    }
  }

  setClock('.timer', deadline)

  //Modal

  const modalTrigger = document.querySelectorAll('[data-modal]')
  const modal = document.querySelector('.modal')
  const body = document.querySelector('body')

  function openModal() {
    modal.style.display = 'block'
    body.style.overflow = 'hidden'
    clearInterval(modalTimerId)
  }

  function closeModal() {
    modal.style.display = 'none'
    body.style.overflow = ''
  }

  modalTrigger.forEach(item => {
    item.addEventListener('click', () => {
      openModal()
    })
  })

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.getAttribute('data-close') == '') {
      closeModal()
    }
  })

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') {
      closeModal()
    }
  })

  const modalTimerId = setTimeout(openModal, 50000)

  function showModalByScroll() {
    if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
      openModal()
      window.removeEventListener('scroll', showModalByScroll)
    }
  }

  // window.addEventListener('scroll', showModalByScroll)

  //Классы для карточек

  class MenuCard {
    constructor(src, alt, title, descr, price, parentSelector, ...classes) {
      this.src = src
      this.alt = alt
      this.title = title
      this.descr = descr
      this.price = price
      this.parentSelector = document.querySelector(parentSelector)
      this.classes = classes
    }

    render() {
      const element = document.createElement('div')
      if(this.classes.length === 0) {
        this.element = 'menu__item'
        element.classList.add(this.element)
      } else {
        this.classes.forEach(className => element.classList.add(className))
      }

      element.innerHTML = `
        <img src=${this.src} alt=${this.alt}>
        <h3 class="menu__item-subtitle">${this.title}</h3>
        <div class="menu__item-descr">${this.descr}</div>
        <div class="menu__item-divider"></div>
        <div class="menu__item-price">
          <div class="menu__item-cost">Цена:</div>
          <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
        </div>
      `
      this.parentSelector.append(element)
    }
  }

  new MenuCard(
    "img/tabs/vegy.jpg",
    "vegy",
    'Меню "Фитнес"',
    'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
    229,
    '.menu .container',
  ).render()
  new MenuCard(
    "img/tabs/elite.jpg",
    "elite",
    'Меню “Премиум”',
    'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
    550,
    '.menu .container',
    'menu__item'
  ).render()
  new MenuCard(
    "img/tabs/post.jpg",
    "post",
    'Меню "Постное"',
    'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
    430,
    '.menu .container',
    'menu__item'
  ).render()

  //Forms

  const forms = document.querySelectorAll('form')

  const message = {
    loading: '/dist/img/form/spinner.svg',
    success: 'Спасибо! Скоро мы с вами свяжемся!',
    failure: 'Что-то пошло не так...'
  }

  forms.forEach(item => {
    postData(item)
  })

  function postData(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault()

      const statusMessage = document.createElement('img')
      statusMessage.src = message.loading
      statusMessage.style.cssText = `
        display: block;
        margin: 0 auto;
      `
      form.insertAdjacentElement('afterend', statusMessage)

      const request = new XMLHttpRequest()
      request.open('POST', 'server.php')

      request.setRequestHeader('Content-type', 'application/json; charset=utf-8')
      const formData = new FormData(form)

      const object = {}
      formData.forEach((value, key) => {
        object[key] = value
      })

      const json = JSON.stringify(object)
      request.send(json)

      request.addEventListener('load', () => {
        if(request.status === 200) {
          console.log(request.response)
          showThanksModal(message.success)
          form.reset()
          statusMessage.remove()
        } else {
          showThanksModal(message.failure)
        }
      })
    })
  }

  function showThanksModal(message) {
    const prevModalDialog = document.querySelector('.modal__dialog')

    prevModalDialog.style.display = 'none'
    openModal()

    const thanksModal = document.createElement('div')
    thanksModal.classList.add('modal__dialog')
    thanksModal.innerHTML = `
      <div class=modal__content>
        <div class='modal__close' data-close>x</div>
        <div class=modal__title>${message}</div>
      </div>
    `

    document.querySelector('.modal').append(thanksModal)
    setTimeout(() => {
      thanksModal.remove()
      prevModalDialog.style.display = 'block'
      closeModal()
    }, 4000)
  }
})