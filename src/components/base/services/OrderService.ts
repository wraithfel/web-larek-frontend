import { Api } from '../api';
import { Order } from '../../../types';

export class OrderService {
  constructor(private api: Api) {}

  /** Отправляем заказ, получаем подтверждение от сервера */
  create(order: Order): Promise<unknown> {
    return this.api.post('/order', order);
  }
}
