import { cloneTemplate } from '../../../utils/utils';
import type { ProductViewModel } from '../../../types';
import type { IEvents } from '../events';
import { Modal } from './Modal';

export class ProductPreviewView {
  private modal = new Modal('#modal-container');

  constructor(private bus: IEvents) {}

  public async show(productId: string, service: { getByID(id: string): Promise<ProductViewModel> }) {
    const product = await service.getByID(productId);

    // клонируем шаблон превью
    const tpl = cloneTemplate<HTMLDivElement>('#card-preview');

    // заполняем поля
    tpl.querySelector<HTMLImageElement>('.card__image')!.src = product.image;
    tpl.querySelector<HTMLSpanElement>('.card__category')!.textContent = product.category;
    tpl.querySelector<HTMLHeadingElement>('.card__title')!.textContent = product.title;
    tpl.querySelector<HTMLParagraphElement>('.card__text')!.textContent = product.description;
    tpl.querySelector<HTMLSpanElement>('.card__price')!.textContent =
      product.price != null ? `${product.price} синапсов` : '—';

    // кнопка «В корзину» / «Удалить»
    const btn = tpl.querySelector<HTMLButtonElement>('.card__button')!;
    const updateBtn = () => {
      btn.textContent = product.inBasket ? 'Удалить из корзины' : 'В корзину';
      btn.disabled   = product.price === null;
    };
    updateBtn();

    btn.addEventListener('click', () => {
      product.inBasket = !product.inBasket;
      this.bus.emit('product:updated', { id: product.id, inBasket: product.inBasket });
      updateBtn();
    });

    // открываем
    this.modal.open(tpl);
  }
}
