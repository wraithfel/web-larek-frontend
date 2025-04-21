// src/components/base/view/BasketView.ts
import { cloneTemplate } from '../../../utils/utils';
import type { IEvents } from '../events';
import type { BasketService } from '../services/BasketService';
import type { ProductViewModel } from '../../../types';
import { Modal } from './Modal';

export class BasketView {
  private modal = new Modal('#modal-container');
  private basketBtn = document.querySelector('.header__basket')! as HTMLElement;
  private counterEl = this.basketBtn.querySelector('.header__basket-counter')! as HTMLElement;

  constructor(private bus: IEvents, private basketService: BasketService) {
    // при клике на иконку — рендерим и открываем корзину
    this.basketBtn.addEventListener('click', () => this.renderAndOpen());

    // обновляем счётчик при изменениях корзины
    this.bus.on<ProductViewModel[]>('basket:changed', items => {
      this.counterEl.textContent = items.length.toString();
    });
  }

  private renderAndOpen() {
    // клонируем шаблон корзины
    const basketEl = cloneTemplate<HTMLDivElement>('#basket');
    const listEl   = basketEl.querySelector<HTMLUListElement>('.basket__list')!;
    listEl.innerHTML = '';

    // получаем текущие товары и рендерим каждый
    const items = this.basketService.getItems();
    items.forEach((prod, idx) => {
      const itemEl = cloneTemplate<HTMLLIElement>('#card-basket');

      itemEl.querySelector('.basket__item-index')!.textContent = String(idx + 1);
      itemEl.querySelector('.card__title')!.textContent         = prod.title;
      itemEl.querySelector('.card__price')!.textContent         = prod.price != null
        ? `${prod.price} синапсов`
        : '—';

      // удаление из корзины
      const delBtn = itemEl.querySelector<HTMLButtonElement>('.basket__item-delete')!;
      delBtn.addEventListener('click', () => {
        this.basketService.remove(prod.id);
        this.renderAndOpen(); // перерисовать корзину
      });

      listEl.append(itemEl);
    });

    // итоговая сумма
    const totalEl = basketEl.querySelector<HTMLSpanElement>('.basket__price')!;
    totalEl.textContent = `${this.basketService.getTotal()} синапсов`;

    // кнопка «Оформить»
    const orderBtn = basketEl.querySelector<HTMLButtonElement>('.basket__button')!;
    orderBtn.disabled = items.length === 0;
    orderBtn.addEventListener('click', () => {
      this.modal.close();
      this.bus.emit('basket:checkout');
    });

    // открываем модалку
    this.modal.open(basketEl);
  }
}
