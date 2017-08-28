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
      this.submitButton.setAttribute('disabled', 'disabled');
      this.sendRequest(this.getData(), (error, answer) => this.checkAnswer(error, answer));
      this.showResultContainer();
    }
  }

  validate() {
    const validateResult = {
      isValid: true,
      errorFields: []
    };
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
    let result = false;
    switch (input.name) {
      case 'fio':
        result = this.checkFio(input);
        break;
      case 'email':
        result = this.checkEmail(input);
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
    const re = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/;
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

  sendRequest(params, callback) {
    const url = this.form.getAttribute('action');
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url + '?' + this.getSearchString(params));
    xhr.send();
    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) {
        return;
      }
      if (xhr.status !== 200) {
        const error = 'Status ' + xhr.status;
        callback(error);
      } else {
        const data = JSON.parse(xhr.responseText);
        callback(null, data);
      }
    };
  }

  getSearchString(params) {
    return Object.keys(params).map(function(key) {
      return [key, encodeURIComponent(params[key])].join('=');
    }).join('&');
  }

  checkAnswer(error, answer) {
    const result = {
      className: null,
      message: null,
      disabled: true
    }

    if (error !== null) {
      result.className = 'error';
      result.message = error;
      result.disabled = false;
      this.setResult(result);
      return;
    }

    switch (answer.status) {
      case 'success':
        result.className = answer.status;
        result.message = 'Success';
        result.disabled = true;
        break;
      case 'error':
        result.className = answer.status;
        result.message = answer.reason;
        result.disabled = false;
        break;
      case 'progress':
        result.className = answer.status;
        result.message = 'Отправляем...';
        result.disabled = true;
        clearTimeout(this.timerId);
        this.timerId = setTimeout(() => {
          this.sendRequest(this.getData(), (error, answer) => this.checkAnswer(error, answer));
        }, answer.timeout);
        break;
    }
    this.setResult(result);
  }

  setResult(data) {
    this.setResultClass(data.className);
    this.setResultMessage(data.message);
    if (!data.disabled && this.submitButton.hasAttribute('disabled')) {
        this.submitButton.removeAttribute('disabled', 'disabled');
    }
  }

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

  showResultContainer() {
    if (this.resultContainer.classList.contains('hidden')) {
      this.resultContainer.classList.remove('hidden');
    }
  }

  setResultClass(elClass) {
    const arrClasses = ['success', 'error', 'progress'];
    const index = arrClasses.indexOf(elClass);
    if (index !== -1) {
      arrClasses.splice(index, 1);
    }
    if (!this.resultContainer.classList.contains(elClass)) {
      this.resultContainer.classList.add(elClass);
    }
    for (const item of arrClasses) {
      if (this.resultContainer.classList.contains(item)) {
        this.resultContainer.classList.remove(item);
      }
    }
  }

  setResultMessage(text) {
    this.resultContainer.innerHTML = '<p>' + text + '</p>';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('myForm');
  if (form !== null) {
    window.myForm = new MyForm(form);
  }
});
