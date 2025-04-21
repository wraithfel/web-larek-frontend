import './scss/styles.scss';

import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { API_URL } from './utils/constants';
import {ProductService} from './components/base/services/ProductService'
import { ProductListView } from './components/base/view/ProductListView';
import { ProductPreviewView } from './components/base/view/ProductPreview';


const api = new Api(API_URL)
const bus = new EventEmitter()
const service = new ProductService(api, bus)



const galleryEl  = document.querySelector('.gallery')! as HTMLElement;
new ProductListView(galleryEl, bus);
service.getAll();

const previewView = new ProductPreviewView(bus);

// 3) Подписываемся только на одно событие
bus.on<{ productId: string }>('product:selected', ({ productId }) => {
  previewView.show(productId, service);
});

