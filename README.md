# Instbot

![Процесс работы програмы](https://pp.userapi.com/c851216/v851216067/de22f/XDfyb98BiG4.jpg)

Instbot - бот для instagram написанный на JavaScript c помощью pupetteer.
С опциональными возможностями написания комментариев из словаря, установки лайков и подписки на других.

Целевая идея в том, что люди создают ответный трафик на странице, подписываются и лайкают.

## Зависимости
Nodejs >= 8.10.0

## Установка

Клонирование репозитория

```bash
git clone git@github.com:d0kur0/instbot.git
```

Установка всех зависимостей

```bash
npm i
```

## Настройки

Файл настроек находится по пути: ```app/options.js```, там находятся основные настройки

```js
module.exports = {
  // Ссылка на страницу с хештегом, по которой бот будет выполнять задачи
  hashTagUri: 'https://instagram.com/explore/tags/маникюр/',

  // Авторизационные данные от аккаунта
  authData: {
    username: '***',
    password: '***',
  },

  // Опции запуска браузера, их можно посмотреть в документации к pupetteer
  browserOptions: {
    ignoreHTTPSErrors: true,
    headless: false,
    args: [`--window-size=800,800`]
  },

  // Опции работы бота
  bot: {
    removePopular: true, // Удалять ли раздел "Самые популярные"
    setLike: true, // Ставить ли лайки
    subscribe: true, // Подписываться ли
    setComment: true, // Писать ли комментарий
    delayBeforeComment: 5000, // Пауза после вставки комментария (мс)
    delayBeforeIteration: 15000, // Пауза между итерациями (мс)
    delayBeforeLike: 1000, // Пауза после лайка (мс)
    delayBeforeSubscribe: 5000 // Пауза после подписки (мс)
  }
};


```

Файл со словарём комментариев лежит по пути: ```app/messages.js```

## Запуск
Запуск проводится из корня проекта, достаточно выполнить 
```bash
npm app/process.js
```
