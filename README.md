# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Описание базовых классов

1. Api

Назначение:
Класс Api отвечает за взаимодействие с сервером через HTTP-запросы. Он реализует методы для выполнения запросов типа GET, POST, PUT и DELETE с использованием встроенной функции fetch и обеспечивает централизованную обработку ответов и ошибок.

Ключевые функции:

    Конфигурация:
    При инициализации устанавливается базовый URL и заголовок Content-Type: application/json. Это позволяет задать общие параметры для всех запросов.

    Метод get:
    Выполняет GET-запрос к заданному URI, объединяя базовый URL с относительным адресом, и возвращает обработанный ответ в виде объекта (JSON).

    Метод post:
    Отправляет данные на сервер, используя один из методов POST, PUT или DELETE. Перед отправкой тело запроса сериализуется в JSON.

    Обработка ответов:
    Метод handleResponse централизованно обрабатывает ответы сервера. Если ответ успешный, возвращается JSON-объект, а при ошибке – отклонённый промис с сообщением об ошибке.

2. EventEmitter

Назначение:
Класс EventEmitter реализует механизм брокера событий, позволяющий организовать слабосвязанное взаимодействие между компонентами приложения. Он обеспечивает возможность подписки, вызова и удаления обработчиков событий.

Ключевые функции:

    Подписка на события (on):
    Позволяет зарегистрировать callback-функцию для определённого события. При этом имя события может быть задано как строкой или даже как регулярное выражение для более гибкой фильтрации.

    Удаление подписок (off и offAll):
    Позволяет снять отдельный обработчик с события или удалить все подписки, чтобы избежать утечек памяти.

    Генерация событий (emit):
    При вызове данного метода отправляются уведомления всем подписанным обработчикам. Помимо точного совпадения имени, поддерживаются универсальные подписки через ключ "*".

    Создание триггеров (trigger):
    Возвращает функцию, которая при вызове генерирует событие с заданным контекстом. Это удобно для отложенного вызова событий с предварительно определённым набором данных.

3. Типизация данных

В директории src/types/ определены интерфейсы, описывающие структуры данных, с которыми работает приложение:

    ApiProduct:
    Интерфейс для объектов, получаемых с сервера. Содержит поля id, description, image, title, category и price.

    ProductViewModel:
    Расширяет ApiProduct, добавляя флаг inBasket, используемый для контроля состояния товара (добавлен ли в корзину).

    BasketItem:
    Описывает элемент корзины, содержащий объект товара и его количество.

    PaymentInfo и ContactInfo:
    Содержат информацию, вводимую пользователем на этапе оформления заказа (способ оплаты, адрес доставки, email и телефон).

    Order:
    Итоговая модель заказа, которая объединяет данные из PaymentInfo и ContactInfo с итоговой суммой и идентификаторами товаров.

 ## Архитектура проекта

 ##### Общий принцип

Приложение разделено на следующие логические слои:

    Модели данных:
    Определяют структуру и типы данных, поступающих от сервера (например, ApiProduct) и данные, необходимые для отображения (например, ProductViewModel).

    UI-компоненты:
    Отвечают за визуальное представление и взаимодействие с пользователем (например, компоненты ProductCard, ProductModal, Basket, OrderForm, реализованные в папке src/components/).

    Управляющий слой (контроллер):
    Точка входа в приложение (src/index.ts), где происходит инициализация, загрузка данных с сервера через Api, настройка событийного брокера (EventEmitter), привязка UI-компонентов к данным и обработка пользовательских действий.

    Интеграция и взаимодействие:
    Все взаимодействия между компонентами осуществляются через события (EventEmitter) или передачу экземпляров классов, что обеспечивает слабую связанность и возможность масштабирования.
