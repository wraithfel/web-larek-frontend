import {Api, ApiListResponse} from '../api';
import {IEvents} from '../events';
import { CDN_URL } from '../../../utils/constants';
import type {
    ApiProduct,
    ProductViewModel,
  } from '../../../types';



export class ProductService{

    constructor(private api: Api, private event:IEvents){
    }

    async getAll(){
        const res = await this.api.get('/product') as ApiListResponse<ApiProduct>;
        const items: ProductViewModel[] = res.items.map(p => ({...p,
            image: `${CDN_URL}${p.image}`, 
            inBasket:false}));
        
        this.event.emit('products:loaded', items)
    }

    async getByID(id: string){
        const res = await this.api.get(`/product/${id}`) as ApiProduct;
        const item: ProductViewModel = {...res,
            image: `${CDN_URL}${res.image}`, 
            inBasket:false};
        
        return item
    }
}