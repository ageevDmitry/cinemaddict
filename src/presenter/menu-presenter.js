import MenuView from '../view/menu-view.js';
import {render, replace, remove} from '../utils/render.js';
import {filter} from '../utils/filter.js';
import {FilterType, UpdateType, STATISTIC_BOARD} from '../const.js';

export default class MenuPresenter {
  constructor(menuContainer, menuModel, filmsModel) {
    this._menuContainer = menuContainer;
    this._menuModel = menuModel;
    this._filmsModel = filmsModel;

    this._menuComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._handleStatisticRender = this._handleStatisticRender.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._menuModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getMenuButton();
    const prevMenuComponent = this._menuComponent;

    this._menuComponent = new MenuView(filters, this._menuModel.getMenuButton());
    this._menuComponent.setFilterTypeClickHandler(this._handleFilterTypeChange);
    this._menuComponent.setStatisticClickHandler(this._handleStatisticRender);

    if (prevMenuComponent === null) {
      render(this._menuContainer, this._menuComponent);
      return;
    }

    replace(this._menuComponent, prevMenuComponent);
    remove(prevMenuComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._menuModel.getMenuButton() === filterType) {
      return;
    }

    this._menuModel.setMenuButton(UpdateType.MAJOR, filterType);
  }

  _handleStatisticRender() {
    this._menuModel.setMenuButton(UpdateType.STATISTIC, STATISTIC_BOARD);
  }

  _getMenuButton() {
    const films = this._filmsModel.getFilms();

    return [
      {
        type: FilterType.ALL_MOVIES,
        name: 'All movies',
        count: filter[FilterType.ALL_MOVIES](films).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        count: filter[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: filter[FilterType.HISTORY](films).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filter[FilterType.FAVORITES](films).length,
      },
    ];
  }
}
