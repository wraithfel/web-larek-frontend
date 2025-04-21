import type { IEvents } from '../events';
import type { ProductViewModel } from '../../../types';

export class BasketService {
  private items: Map<string, ProductViewModel> = new Map();

  constructor(private bus: IEvents) {}
  
  add(product: ProductViewModel): void {
    if (product.price === null) return;     
    if (this.items.has(product.id)) return;

    product.inBasket = true;
    this.items.set(product.id, product);

    this.bus.emit('product:updated', { id: product.id, inBasket: true });
    this.bus.emit('basket:changed', this.getItems());
  }

  /** Удаляет товар из корзины */
  remove(productId: string): void {
    const prod = this.items.get(productId);
    if (!prod) return;

    prod.inBasket = false;
    this.items.delete(productId);

    this.bus.emit('product:updated', { id: productId, inBasket: false });
    this.bus.emit('basket:changed', this.getItems());
  }

  /** Переключает состояние товара в корзине */
  toggle(product: ProductViewModel): void {
    if (this.items.has(product.id)) {
      this.remove(product.id);
    } else {
      this.add(product);
    }
  }

  /** Очищает корзину */
  clear(): void {

    this.items.forEach(prod => (prod.inBasket = false));
    this.items.clear();

    this.bus.emit('basket:changed', []);
    // если нужен массовый сброс карточек:
    this.bus.emit('products:reloaded');  
  }

  /** Возвращает текущие товары */
  getItems(): ProductViewModel[] {
    return Array.from(this.items.values());
  }

  /** Количество уникальных товаров */
  getCount(): number {
    return this.items.size;
  }

  /** Общая сумма */
  getTotal(): number {
    return this.getItems().reduce((sum, p) => sum + (p.price ?? 0), 0);
  }
}
