import { cloneTemplate } from '../../../utils/utils';
import type { ProductViewModel } from '../../../types';
import type { IEvents } from '../events';
import { Modal } from './Modal';

export class ProductPreviewView {
  private modal = new Modal('#modal-container');

  constructor(private bus: IEvents) {}

  public async show(
    productId: string,
    service: { getByID(id: string): Promise<ProductViewModel> }
  ) {
    const product = await service.getByID(productId);

    const tpl = cloneTemplate<HTMLDivElement>('#card-preview');
    tpl.querySelector<HTMLImageElement>('.card__image')!.src        = product.image;
    tpl.querySelector<HTMLSpanElement>('.card__category')!.textContent = product.category;
    tpl.querySelector<HTMLHeadingElement>('.card__title')!.textContent = product.title;
    tpl.querySelector<HTMLParagraphElement>('.card__text')!.textContent = product.description;
    tpl.querySelector<HTMLSpanElement>('.card__price')!.textContent =
      product.price != null ? `${product.price} синапсов` : '—';

    const btn = tpl.querySelector<HTMLButtonElement>('.card__button')!;
    const updateBtn = () => {
      btn.textContent = product.inBasket ? 'Удалить из корзины' : 'В корзину';
      btn.disabled   = product.price === null;
    };
    updateBtn();

    btn.addEventListener('click', () => {
      // переключаем корзину — BasketService сделает всё остальное
      this.bus.emit('product:toggleBasket', product);
      // сразу же обновляем текст кнопки по новому флагу
      updateBtn();
    });

    this.modal.open(tpl);
  }
}
