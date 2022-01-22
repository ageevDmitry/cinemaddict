import MenuView from '../view/menu-view.js';
import {render, replace, remove} from '../utils/render.js';
import {filter} from '../utils/filter.js';
import {FilterType, UpdateType, STATISTIC_BOARD} from '../const.js';

export default class MenuPresenter {
  #menuContainer = null;
  #menuModel = null;
  #filmsModel = null;
  #menuComponent = null;

  constructor(menuContainer, menuModel, filmsModel) {
    this.#menuContainer = menuContainer;
    this.#menuModel = menuModel;
    this.#filmsModel = filmsModel;

    this.#handleModelEvent = this.#handleModelEvent.bind(this);
    this.#handleFilterTypeChange = this.#handleFilterTypeChange.bind(this);
    this.#handleStatisticRender = this.#handleStatisticRender.bind(this);

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#menuModel.addObserver(this.#handleModelEvent);
  }

  init() {
    const filters = this.#getMenuButton();
    const prevMenuComponent = this.#menuComponent;

    this.#menuComponent = new MenuView(filters, this.#menuModel.getMenuButton());
    this.#menuComponent.setFilterTypeClickHandler(this.#handleFilterTypeChange);
    this.#menuComponent.setStatisticClickHandler(this.#handleStatisticRender);

    if (prevMenuComponent === null) {
      render(this.#menuContainer, this.#menuComponent);
      return;
    }

    replace(this.#menuComponent, prevMenuComponent);
    remove(prevMenuComponent);
  }

  #handleModelEvent = () => {
    this.init();
  }

  #handleFilterTypeChange = (filterType) => {
    if (this.#menuModel.getMenuButton() === filterType) {
      return;
    }

    this.#menuModel.setMenuButton(UpdateType.MAJOR, filterType);
  }

  #handleStatisticRender = () => {
    this.#menuModel.setMenuButton(UpdateType.STATISTIC, STATISTIC_BOARD);
  }

  #getMenuButton = () => {
    const films = this.#filmsModel.getFilms();

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
