import { IEvents } from '../../base/events';
import type { ProductViewModel } from '../../../types';
import { cloneTemplate } from '../../../utils/utils';

export class ProductCard {
  public readonly el: HTMLButtonElement;
  private data: ProductViewModel;

  constructor(data: ProductViewModel, private bus: IEvents) {
    this.data = data;
    this.el = cloneTemplate<HTMLButtonElement>('#card-catalog');

    this.el.addEventListener('click', () =>
      this.bus.emit('product:selected', { productId: this.data.id })
    );

    this.update(data);
  }

  /** Обновляет текст, картинку и класс in-basket */
  public update(data: ProductViewModel) {
    this.data = data;
    this.el.dataset.id = data.id;
    this.el.querySelector<HTMLSpanElement>('.card__category')!.textContent = data.category;
    this.el.querySelector<HTMLHeadingElement>('.card__title')!.textContent = data.title;
    this.el.querySelector<HTMLImageElement>('.card__image')!.src = data.image;
    this.el.querySelector<HTMLSpanElement>('.card__price')!.textContent =
      data.price !== null ? `${data.price} синапсов` : '—';
    this.el.classList.toggle('card_in-basket', data.inBasket);
  }
}
