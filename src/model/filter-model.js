import AbstractObserver from '../utils/abstract-observer.js';
import {FilterType} from '../const.js';

export default class Filter extends AbstractObserver {
  #activeFilter = null;

  constructor() {
    super();
    this.#activeFilter = FilterType.ALL_MOVIES;
  }

  setFilter(updateType, filter) {
    this.#activeFilter = filter;
    this._notify(updateType, filter);
  }

  getFilter() {
    return this.#activeFilter;
  }
}
