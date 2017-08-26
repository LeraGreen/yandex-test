# yandex-test
Тестовое задание для Школы Node.js

## Запуск сервера для статики: `npm start` или `PORT=3000; npm start`

## Тест

### Пример успешной отправки формы:
```javascript
  myForm.setData({
    'phone': '+7(000)000-00-00',
    'fio': 'Петров Петр Петрович',
    'email': 'querty@ya.ru'
  });
  myForm.submit();
  setTimeout(() => {
    myForm.form.action = 'json/success.json';
  }, 2000);
```

### Пример с ошибкой от сервера:
```javascript
  myForm.setData({
    'phone': '+7(000)000-00-00',
    'fio': 'Петров Петр Петрович',
    'email': 'querty@ya.ru'
  });
  myForm.submit();
  setTimeout(() => {
    myForm.form.action = 'json/error.json';
  }, 2000);
```
## Lint 
```sh
$ eslint --config .eslintrc *.js
```
