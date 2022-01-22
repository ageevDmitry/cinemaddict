import AbstractView from './abstract.js';
import {STATISTIC_BOARD} from '../const.js';

const createMenuViewTemplate = (filters, currentMenuButton) => {

  const getFilterTemplate = (filterLink, currentFilterTypeLink) => {
    const {type, name, count} = filterLink;

    return (
      `<a href="#${type}" class="main-navigation__item ${type === currentFilterTypeLink ? 'main-navigation__item--active' : ''}" data-filter-type="${type}">
      ${name}
      ${type !== 'all' ? `<span class="main-navigation__item-count">${count}</span>` : ''}</a>`
    );
  };

  const filterTemplate = filters.map((filter) => getFilterTemplate(filter, currentMenuButton)).join('');

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filterTemplate}            
      </div>   
      <a href="#stats" class="main-navigation__additional ${currentMenuButton === STATISTIC_BOARD ? 'main-navigation__item--active' : ''}">Stats</a> 
    </nav>`
  );
};

export default class MenuView extends AbstractView {
  #filters = null;
  #currentMenuButton = null;

  constructor(filters, currentMenuButton) {

    super();
    this.#filters = filters;
    this.#currentMenuButton = currentMenuButton;

    this.#filterTypeClickHandler = this.#filterTypeClickHandler.bind(this);
    this.#statisticHandler = this.#statisticHandler.bind(this);
  }

  getTemplate() {
    return createMenuViewTemplate(this.#filters, this.#currentMenuButton);
  }

  #filterTypeClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeClick(evt.target.dataset.filterType);
  }

  #statisticHandler = (evt) => {
    evt.preventDefault();
    this._callback.statisticClick();
  }

  setFilterTypeClickHandler(callback) {
    this._callback.filterTypeClick = callback;
    this.getElement().querySelectorAll('.main-navigation__item')
      .forEach((element) => element.addEventListener('click', this.#filterTypeClickHandler));
  }

  setStatisticClickHandler(callback) {
    this._callback.statisticClick = callback;
    this.getElement().querySelector('.main-navigation__additional').addEventListener('click', this.#statisticHandler);
  }
}
