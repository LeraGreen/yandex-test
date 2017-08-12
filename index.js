//валидация формы

const form = document.getElementById('myForm');
form.addEventListener('submit', function(evt) {
  event.preventDefault();
  let validFlag = true;
  const inputs = form.getElementsByTagName('input');
  const submitButton = document.getElementById('submitButton');

  for (input of inputs) {
    const inputCustomValidation = new CustomValidation(input);
    const validationResult = inputCustomValidation.checkInput();
    if (!validationResult) {
      validFlag = false;
      inputCustomValidation.setError();
    } else {
      inputCustomValidation.hideError();
    }
  }

  if (validFlag && !submitButton.hasAttribute('disabled')) {
    submitButton.setAttribute('disabled', 'disabled');
    const url = form.getAttribute('action');
    sendRequest(url, function(answer) {
      console.log(answer);
      const resultContainer = document.getElementById('resultContainer');
      switch(answer.status) {
        case 'success':
          resultContainer.classList.add('success');
          resultContainer.innerHTML += '<p>' + 'Success' + '<p>';
          break;
        case 'error':
          resultContainer.classList.add('error');
          resultContainer.innerHTML += '<p>' + answer.reason + '<p>';
          break;
        case 'progress':
          resultContainer.classList.add('progress');
          break;
      };
      resultContainer.classList.remove('hidden');
    });
  }
})

class CustomValidation {
  constructor(input) {
    this.input = input;
  }

  checkInput() {
    const inputName = this.input.name;
    let result = false;
    if (inputName === 'fio') {
      result = this.checkFio();
    }
    if (inputName === 'email') {
      result = this.checkEmail();
    }
    if (inputName === 'phone') {
      result = this.checkPhone();
    }
    return result;
  }

  checkFio() {
    const re = /\s+/;
    const userFio = this.input.value.split(re);
    return userFio.length === 3;
  }

  checkEmail() {
    const rightHosts = ['ya.ru', 'yandex.ru', 'yandex.ua', 'yandex.by', 'yandex.kz', 'yandex.com'];
    const inputValue = input.value;
    const atPosition = inputValue.indexOf('@');
    const host = inputValue.slice(atPosition + 1);
    return !(rightHosts.indexOf(host) === -1);
  }

  checkPhone() {
    const re = /^\+7\(\d{3}\)\d{3}\-\d{2}\-\d{2}$/;
    const inputValue = this.input.value.replace(/\s+/g, '');
    const numbers = inputValue.match(/\d/g);
    let sum = 0;
    for (let i = 0; i < numbers.length; i++) {
      sum += parseInt(numbers[i], 10);
    }
    return (re.test(inputValue) && sum <= 30);
  }

  setError() {
    if (!this.input.classList.contains('field-text__input--error')) {
      this.input.classList.add('field-text__input--error');
    }
  }

  hideError() {
    if (this.input.classList.contains('field-text__input--error')) {
      this.input.classList.remove('field-text__input--error');
    }
  }
}

// Отправка AJAX запроса //

const sendRequest = (url, callback) => {
   const xhr = new XMLHttpRequest();
   xhr.open('GET', url);
   xhr.send();
   xhr.onreadystatechange = function() {
     if (xhr.readyState != 4) {
       return;
     }
     const data = JSON.parse(xhr.responseText);
     callback(data);
   }
}
