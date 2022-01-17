import AbstractObserver from '../utils/abstract-observer.js';
import {FilterType} from '../const.js';

export default class MenuModel extends AbstractObserver {
  constructor() {
    super();
    this._activeMenuButton = FilterType.ALL_MOVIES;
  }

  setMenuButton(updateType, menuButton) {
    this._activeMenuButton = menuButton;
    this._notify(updateType, menuButton);
  }

  getMenuButton() {
    return this._activeMenuButton;
  }
}
