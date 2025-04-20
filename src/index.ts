import './scss/styles.scss';

import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { API_URL } from './utils/constants';
import {ProductService} from './components/base/services/ProductService'
import { ProductListView } from './components/base/view/ProductListView';


const api = new Api(API_URL)
const bus = new EventEmitter()

const service = new ProductService(api, bus)

const cardContainer = document.querySelector('.gallery')! as HTMLElement;
new ProductListView(cardContainer, bus);

service.getAll()

