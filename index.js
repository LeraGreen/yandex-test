class MyForm {
  constructor() {
    this.form = document.getElementById('myForm');
    this.inputs = this.form.getElementsByTagName('input');
    this.submitButton = document.getElementById('submitButton');
    this.resultContainer = document.getElementById('resultContainer');
  }

  initialize() {
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.submit();
    });
  }

  submit(event) {
    const validation = this.validate();
    if (!validation.isValid) {
      this.hideError(validation.errorFields);
      this.setError(validation.errorFields);
    } else {
      this.hideAllError();
      submitButton.setAttribute('disabled', 'disabled');
      this.sendRequest((answer) => this.checkAnswer(answer));
    }
  }

  validate() {
    let validateResult = {
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

  checkInput(input) {
    this.input = input;
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
    const inputValue = this.input.value;
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

  setError(inputsArray) {
    for (const errorInput of inputsArray) {
      for (const input of this.inputs) {
        if (input.name === errorInput && !input.classList.contains('field-text__input--error')) {
          input.classList.add('field-text__input--error');
        }
      }
    }
  }

  hideError(inputsArray) {
    for (const errorInput of inputsArray) {
      for (const input of this.inputs) {
        if (input.name !== errorInput && input.classList.contains('field-text__input--error')) {
          input.classList.remove('field-text__input--error');
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
      if (xhr.readyState != 4) {
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
        this.resultContainer.innerHTML += '<p>' + 'Success' + '<p>';
        break;
      case 'error':
        this.resultContainer.classList.add('error');
        this.resultContainer.innerHTML += '<p>' + answer.reason + '<p>';
        break;
      case 'progress':
        this.resultContainer.classList.add('progress');
        const timerId = setTimeout(() => {
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
          console.log(input, name, input.value);
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
  const myForm = new MyForm();
  myForm.initialize();
});
