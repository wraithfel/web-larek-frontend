import './scss/styles.scss';

import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { API_URL } from './utils/constants';

import { ProductService } from './components/base/services/ProductService';
import { BasketService }  from './components/base/services/BasketService';
import { OrderService }   from './components/base/services/OrderService';

import { ProductListView }    from './components/base/view/ProductListView';
import { ProductPreviewView } from './components/base/view/ProductPreviewView';
import { BasketView }         from './components/base/view/BasketView';
import { CheckoutView }       from './components/base/view/CheckoutView';
import type { ProductViewModel } from './types';

// --- инфраструктура ---
const api = new Api(API_URL);
const bus = new EventEmitter();

// --- сервисы ---
const productService = new ProductService(api, bus);
const basketService  = new BasketService(bus);
const orderService   = new OrderService(api);

// --- список товаров ---
const galleryEl = document.querySelector('.gallery')! as HTMLElement;
new ProductListView(galleryEl, bus);
productService.getAll();

// --- превью товара ---
const previewView = new ProductPreviewView(bus);
bus.on<{ productId: string }>('product:selected', ({ productId }) =>
  previewView.show(productId, productService)
);

// --- корзина ---
new BasketView(bus, basketService);

// события от превью/карточек о добавлении‑удалении
bus.on<ProductViewModel>('product:toggleBasket', p => basketService.toggle(p));

// --- оформление заказа ---
new CheckoutView(bus, basketService, orderService);
