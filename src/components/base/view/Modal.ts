export class Modal {
    private modalEl: HTMLElement;
    private contentEl: HTMLElement;
    private closeBtn: HTMLElement;
  
    constructor(selectorOrEl: string | HTMLElement) {
      this.modalEl = typeof selectorOrEl === 'string'
        ? document.querySelector(selectorOrEl)!
        : selectorOrEl;
      this.contentEl = this.modalEl.querySelector('.modal__content')!;
      this.closeBtn  = this.modalEl.querySelector('.modal__close')!;
  
      this.closeBtn.addEventListener('click', () => this.close());

      this.modalEl.addEventListener('click', e => {
        if (e.target === this.modalEl) this.close();
      });
    }
  
    open(content: HTMLElement) {
      this.contentEl.innerHTML = '';
      this.contentEl.appendChild(content);
      this.modalEl.classList.add('modal_active');
    }
  
    close() {
      this.modalEl.classList.remove('modal_active');
    }
  }