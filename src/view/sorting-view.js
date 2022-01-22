import AbstractView from './abstract.js';
import {SortType} from '../const.js';

const createSortFilmsViewTemplate = (currentSortType) => {

  const getSortLinkTemplate = (value) => (
    `<li><a href="#" class="sort__button ${currentSortType === value ? 'sort__button--active' : ''}" data-sort-type="${value}">Sort by ${value}</a></li>`
  );

  const sortValues = Object.values(SortType);

  const sortLinkTemplate = sortValues.map((value) => getSortLinkTemplate(value)).join('');

  return (
    `<ul class="sort">
      ${sortLinkTemplate}
    </ul>`
  );
};

export default class SortFilmsView extends AbstractView {
  #currentSortType = null;

  constructor(currentSortType) {
    super();

    this.#currentSortType = currentSortType;
    this.#sortTypeChangeHandler = this.#sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortFilmsViewTemplate(this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();

    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this.#sortTypeChangeHandler);
  }
}
