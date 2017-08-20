//TODO проверять и менять классы в диве
//TODO убирать дизейбл
//TODO стили сделать
//TODO бэм проверить
//TODO линтер поставить глобально
//TODO фавиконка
//TODO проверить шрифты
//TODO проверить все по тз
//TODO проверить два метода
//TODO написать ридми
//TODO проверить пустой ввод
//TODO искать кнопку по классу
//TODO server.js

class MyForm {
  constructor(form) {
    this.form = form;
    this.inputs = this.form.getElementsByTagName('input');
    this.submitButton = document.getElementById('submitButton');
    this.resultContainer = document.getElementById('resultContainer');
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.submit();
    });
  }

  submit() {
    const validation = this.validate();
    this.hideAllError();
    if (!validation.isValid) {
      this.setError(validation.errorFields);
    } else {
      submitButton.setAttribute('disabled', 'disabled');
      this.sendRequest((answer) => this.checkAnswer(answer));
    }
  }

  validate() {
    const validateResult = {
      isValid: true,
      errorFields: []
    }
    for (const input of this.inputs) {
      const inputCustomValidation = this.checkInput(input);
      if (!inputCustomValidation) {
        validateResult.isValid = false;
        validateResult.errorFields.push(input.name);
      }
    }
    return validateResult;
  }

  static checkInput(input) {
    let result = false;
    switch(input.name) {
      case 'fio':
        result = this.checkFio(input);
        break;
      case 'email':
        result = this.checkEmail(input)
        break;
      case 'phone':
        result = this.checkPhone(input);
        break;
    }
    return result;
  }

  checkFio(input) {
    const inputValue = input.value.trim();
    const re = /\s+/;
    const userFio = inputValue.split(re);
    return userFio.length === 3;
  }

  checkEmail(input) {
    const rightHosts = ['ya.ru', 'yandex.ru', 'yandex.ua', 'yandex.by', 'yandex.kz', 'yandex.com'];
    const inputValue = input.value;
    const atPosition = inputValue.indexOf('@');
    if (atPosition === -1) {
      return false;
    }
    const host = inputValue.slice(atPosition + 1);
    return (rightHosts.indexOf(host) !== -1);
  }

  checkPhone(input) {
    const re = /^\+7\(\d{3}\)\d{3}\-\d{2}\-\d{2}$/;
    const inputValue = input.value.replace(/\s+/g, '');
    if (!re.test(inputValue)) {
      return false;
    }
    const numbers = inputValue.match(/\d/g);
    let sum = 0;
    for (let i = 0; i < numbers.length; i++) {
      sum += parseInt(numbers[i], 10);
    }
    return (sum <= 30);
  }

  setError(inputsArray) {
    for (const errorInput of inputsArray) {
      for (const input of this.inputs) {
        if (input.name === errorInput && !input.classList.contains('field-text__input--error')) {
          input.classList.add('field-text__input--error');
        }
      }
    }
  }

  hideAllError() {
    for (const input of this.inputs) {
      if (input.classList.contains('field-text__input--error')) {
        input.classList.remove('field-text__input--error');
      }
    }
  }

  sendRequest(callback) {
    const url = this.form.getAttribute('action');
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.send();
    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) {
        return;
      }
      const data = JSON.parse(xhr.responseText);
      callback(data);
    }
  }

  checkAnswer(answer) {
    switch(answer.status) {
      case 'success':
        this.resultContainer.classList.add('success');
        this.resultContainer.innerHTML = '<p>' + 'Success' + '</p>';
        if (this.submitButton.hasAttribute('disabled')) {
          this.submitButton.removeAttribute('disabled', 'disabled');
        }
        break;
      case 'error':
        this.resultContainer.classList.add('error');
        this.resultContainer.innerHTML = '<p>' + answer.reason + '</p>';
        if (this.submitButton.hasAttribute('disabled')) {
          this.submitButton.removeAttribute('disabled', 'disabled');
        }
        break;
      case 'progress':
        this.resultContainer.classList.add('progress');
        clearTimeout(this.timerId);
        this.timerId = setTimeout(() => {
          this.sendRequest((answer) => this.checkAnswer(answer));
        }, answer.timeout);
        break;
      };
    resultContainer.classList.remove('hidden');
  };

  setData(object) {
    const inputsNames = ['phone', 'fio', 'email'];
    for (const input of this.inputs) {
      for (const name of inputsNames) {
        if (input.name === name) {
          input.value = object[name];
        }
      }
    }
  }

  getData() {
    const inputsData = {};
    for (const input of this.inputs) {
      inputsData[input.name] = input.value;
    }
    return inputsData;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('myForm');
  if (form !== null) {
    const myForm = new MyForm(form);
  }
});
