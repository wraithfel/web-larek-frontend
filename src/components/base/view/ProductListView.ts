import {IEvents} from '../events';
import { ProductViewModel } from '../../../types';
import { cloneTemplate } from '../../../utils/utils';


export class ProductListView{
    constructor(private container:HTMLElement, private event : IEvents){
        event.on('products:loaded', this.render.bind(this))
    }

    render(items: ProductViewModel[]){
        this.container.innerHTML = "";
        items.forEach(p => {
            // клонируем ваш <template id="card-catalog">
        const card = cloneTemplate<HTMLButtonElement>('#card-catalog');
        card.dataset.id = p.id;
        card.querySelector<HTMLSpanElement>('.card__category')!.textContent = p.category;
        card.querySelector<HTMLHeadingElement>('.card__title')!.textContent    = p.title;
        card.querySelector<HTMLImageElement>('.card__image')!.src              = p.image;
        card.querySelector<HTMLSpanElement>('.card__price')!.textContent       =
        p.price !== null ? `${p.price} синапсов` : '—';

      // если понадобится менять класс для inBasket — здесь:
      if (p.inBasket) card.classList.add('card_in-basket');

      this.container.append(card);
    })

    }

}