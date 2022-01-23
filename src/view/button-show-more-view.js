import AbstractView from './abstract.js';

export const createButtonShowMoreViewTemplate = () => (
  '<button class="films-list__show-more">Show more</button>'
);

export default class ButtonShowMoreView extends AbstractView {
  constructor() {
    super();

    this.#clickHandler = this.#clickHandler.bind(this);
  }

  getTemplate() {
    return createButtonShowMoreViewTemplate();
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener('click', this.#clickHandler);
  }
}
