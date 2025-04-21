// src/index.ts
import './scss/styles.scss';

import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { API_URL } from './utils/constants';

import { ProductService } from './components/base/services/ProductService';
import { BasketService }  from './components/base/services/BasketService';

import { ProductListView }    from './components/base/view/ProductListView';
import { ProductPreviewView }  from './components/base/view/ProductPreviewView';
import { BasketView }          from './components/base/view/BasketView';

import type { ProductViewModel } from './types';

// 1. Инициализируем API и шину
const api = new Api(API_URL);
const bus = new EventEmitter();

// 2. Сервисы
const productService = new ProductService(api, bus);
const basketService  = new BasketService(bus);

// 3. Список товаров
const galleryEl = document.querySelector('.gallery')! as HTMLElement;
new ProductListView(galleryEl, bus);
productService.getAll();

// 4. Превью-модалка
const previewView = new ProductPreviewView(bus);

// 5. Корзина
new BasketView(bus, basketService);

// 6. Обработка события из превью или списка: добавить/удалить из корзины
bus.on<ProductViewModel>('product:toggleBasket', product => {
  basketService.toggle(product);
});

// 7. Показ превью по клику на карточку
bus.on<{ productId: string }>('product:selected', ({ productId }) => {
  previewView.show(productId, productService);
});
