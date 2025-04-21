import {IEvents} from '../events';
import { ProductViewModel } from '../../../types';
import { cloneTemplate } from '../../../utils/utils';
import {ProductCard} from './ProductCard'

export class ProductListView {
    private cards = new Map<string, ProductCard>();
  
    constructor(
      private container: HTMLElement,
      private bus: IEvents
    ) {
      this.bus.on('products:loaded', this.onProductsLoaded.bind(this));
      this.bus.on('product:updated', this.onProductUpdated.bind(this));
    }
  
    private onProductsLoaded(items: ProductViewModel[]) {
      this.container.innerHTML = '';
      this.cards.clear();
      items.forEach(item => {
        const card = new ProductCard(item, this.bus);
        this.cards.set(item.id, card);
        this.container.append(card.el);
      });
    }
  
    private onProductUpdated({ id, inBasket }: { id: string; inBasket: boolean }) {
      const card = this.cards.get(id);
      if (card) card.update({ ...card['data'], inBasket });
    }
  }
  