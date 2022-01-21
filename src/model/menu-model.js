import AbstractObserver from '../utils/abstract-observer.js';
import {FilterType} from '../const.js';

export default class MenuModel extends AbstractObserver {
  #activeMenuButton = null;

  constructor() {
    super();
    this.#activeMenuButton = FilterType.ALL_MOVIES;
  }

  setMenuButton(updateType, menuButton) {
    this.#activeMenuButton = menuButton;
    this._notify(updateType, menuButton);
  }

  getMenuButton() {
    return this.#activeMenuButton;
  }
}
