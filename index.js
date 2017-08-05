//валидация формы

const form = document.getElementById('myForm');
form.addEventListener('submit', function(evt) {
  event.preventDefault();
  const inputs = form.getElementsByTagName('input');

  for (input of inputs) {
    const inputCustomValidation = new CustomValidation(input);
    const validationResult = inputCustomValidation.checkInput();
    console.log(validationResult);
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
    return !rightHosts.indexOf(host) === -1;
  }

  checkPhone() {
    const re = /^\+7\(\d{3}\)\d{3}\-\d{2}\-\d{2}$/;
    const inputValue = this.input.value.replace(/\s+/g, '');
    return re.test(inputValue);
  }
}
