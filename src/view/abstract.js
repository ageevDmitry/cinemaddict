import {createElement} from '../utils/render.js';

const SHAKE_ANIMATION_TIMEOUT = 600;
const MILISECONDS_COUNT = 1000;

export default class Abstract {
  #element = null;

  constructor() {
    if (new.target === Abstract) {
      throw new Error('Can\'t instantiate Abstract, only concrete one.');
    }

    this._callback = {};
  }

  getTemplate() {
    throw new Error('Abstract method not implemented: getTemplate');
  }

  getElement() {
    if (!this.#element) {
      this.#element = createElement(this.getTemplate());
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }

  shake() {
    this.#element.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / MILISECONDS_COUNT}s`;
    setTimeout(() => {
      this.#element.style.animation = '';
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
