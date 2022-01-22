import Abstract from './abstract';

export default class Smart extends Abstract {
  #data = null;

  constructor() {
    super();
    this.#data = {};
  }

  updateElement() {
    const prevElement = this.getElement();
    const currentScroll = prevElement.scrollTop;

    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);
    newElement.scrollTo(0, currentScroll);

    this.restoreHandlers();
  }

  updateData(update) {
    if (!update) {
      return;
    }

    this.#data = Object.assign(
      {},
      this.#data,
      update,
    );

    this.updateElement();
  }

  restoreHandlers() {
    throw new Error('Abstract method not implemented: restoreHandlers');
  }
}

