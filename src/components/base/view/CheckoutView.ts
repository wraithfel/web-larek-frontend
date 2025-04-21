// src/components/base/view/CheckoutView.ts
import { cloneTemplate } from '../../../utils/utils';
import { Modal } from './Modal';
import type { IEvents } from '../events';
import type { BasketService } from '../services/BasketService';
import type { OrderService } from '../services/OrderService';
import type { Order } from '../../../types';

export class CheckoutView {
  private modal = new Modal('#modal-container');

  private data: {
    payment?: 'online' | 'cash';
    address: string;
    email: string;
    phone: string;
  } = {
    address: '',
    email: '',
    phone: ''
  };

  constructor(
    private bus: IEvents,
    private basket: BasketService,
    private orderService: OrderService
  ) {
    this.bus.on('basket:checkout', () => this.step1());
  }

  // ---------- Шаг 1 ----------
  private step1() {
    const tpl       = cloneTemplate<HTMLFormElement>('#order');
    const payBtns   = tpl.querySelectorAll<HTMLButtonElement>('.order__buttons .button');
    const addressI  = tpl.querySelector<HTMLInputElement>('input[name="address"]')!;
    const nextBtn   = tpl.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    const errEl     = tpl.querySelector<HTMLSpanElement>('.form__errors')!;

    const validate1 = () => {
      let msg = '';
      if (!this.data.payment)          msg = 'Выберите способ оплаты';
      else if (!addressI.value.trim()) msg = 'Введите адрес доставки';

      errEl.textContent = msg;
      nextBtn.disabled  = Boolean(msg);
    };
    validate1();                                 // показать первую ошибку

    payBtns.forEach(btn =>
      btn.addEventListener('click', () => {
        payBtns.forEach(b => b.classList.remove('button_alt-active'));
        btn.classList.add('button_alt-active');
        this.data.payment = btn.name === 'card' ? 'online' : 'cash';
        validate1();
      })
    );

    addressI.addEventListener('input', () => {
      this.data.address = addressI.value.trim();
      validate1();
    });

    tpl.addEventListener('submit', e => {
      e.preventDefault();
      if (!nextBtn.disabled) this.step2();
    });

    this.modal.open(tpl);
  }

  // ---------- Шаг 2 ----------
  private step2() {
    const tpl     = cloneTemplate<HTMLFormElement>('#contacts');
    const emailI  = tpl.querySelector<HTMLInputElement>('input[name="email"]')!;
    const phoneI  = tpl.querySelector<HTMLInputElement>('input[name="phone"]')!;
    const payBtn  = tpl.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    const errEl   = tpl.querySelector<HTMLSpanElement>('.form__errors')!;

    // простые регэкспы
    const emailRe  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRe  = /^\+7\s?\(?\d{3}\)?\s?\d{3}-?\d{2}-?\d{2}$/;

    const validate2 = () => {
      let msg = '';
      if (!emailI.value.trim())                      msg = 'Введите email';
      else if (!emailRe.test(emailI.value.trim()))   msg = 'Неправильный формат email';
      else if (!phoneI.value.trim())                 msg = 'Введите телефон';
      else if (!phoneRe.test(phoneI.value.trim()))   msg = 'Неправильный формат телефона';

      errEl.textContent = msg;
      payBtn.disabled   = Boolean(msg);
    };
    validate2();                                    // первая ошибка

    emailI.addEventListener('input', validate2);
    phoneI.addEventListener('input', validate2);

    tpl.addEventListener('submit', async e => {
      e.preventDefault();
      if (payBtn.disabled) return;

      const order: Order = {
        payment: this.data.payment!,            // гарантированно задано
        address: this.data.address,
        email: emailI.value.trim(),
        phone: phoneI.value.trim(),
        items: this.basket.getItems().map(p => p.id),
        total: this.basket.getTotal()
      };

      try {
        await this.orderService.create(order);
        this.basket.clear();
        this.showSuccess(order.total);
      } catch {
        errEl.textContent = 'Не удалось оплатить заказ. Попробуйте позже';
      }
    });

    this.modal.open(tpl);
  }

  // ---------- Success ----------
  private showSuccess(total: number) {
    const tpl = cloneTemplate<HTMLDivElement>('#success');
    tpl.querySelector<HTMLParagraphElement>(
      '.order-success__description'
    )!.textContent = `Списано ${total} синапсов`;

    tpl.querySelector<HTMLButtonElement>(
      '.order-success__close'
    )!.addEventListener('click', () => this.modal.close());

    this.modal.open(tpl);
  }
}
