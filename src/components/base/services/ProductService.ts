import { Api, ApiListResponse } from '../api';
import type { IEvents } from '../events';
import { CDN_URL } from '../../../utils/constants';
import type { ApiProduct, ProductViewModel } from '../../../types';

export class ProductService {
  private cache = new Map<string, ProductViewModel>();

  constructor(private api: Api, private bus: IEvents) {}

  async getAll() {
    const res = await this.api.get('/product') as ApiListResponse<ApiProduct>;
    const items: ProductViewModel[] = res.items.map(p => {
      const vm: ProductViewModel = {
        ...p,
        image: `${CDN_URL}${p.image}`,
        inBasket: this.cache.get(p.id)?.inBasket ?? false
      };
      this.cache.set(vm.id, vm);
      return vm;
    });
    this.bus.emit('products:loaded', items);
  }

  async getByID(id: string): Promise<ProductViewModel> {
    // если модель уже была загружена — возвращаем из кэша
    const cached = this.cache.get(id);
    if (cached) return cached;

    // иначе — грузим, но не сбрасываем флаг inBasket (т.к. ещё не был в кэше)
    const res = await this.api.get(`/product/${id}`) as ApiProduct;
    const vm: ProductViewModel = {
      ...res,
      image: `${CDN_URL}${res.image}`,
      inBasket: false
    };
    this.cache.set(vm.id, vm);
    return vm;
  }
}
