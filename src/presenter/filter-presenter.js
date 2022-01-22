// import FilterView from '../view/filter-view.js';
// import {render, replace, remove} from '../utils/render.js';
// import {filter} from '../utils/filter.js';
// import {FilterType, UpdateType, START_STATISTIC_PERIOD} from '../const.js';

// export default class FilterPresenter {
//   #filterContainer = null;
//   #filterModel = null;
//   #filmsModel = null;
//   #filterComponent = null;

//   constructor(filterContainer, filterModel, filmsModel) {

//     this.#filterContainer = filterContainer;
//     this.#filterModel = filterModel;
//     this.#filmsModel = filmsModel;

//     this.#handleModelEvent = this.#handleModelEvent.bind(this);
//     this.#handleFilterTypeChange = this.#handleFilterTypeChange.bind(this);
//     this.#handleStatisticRender = this.#handleStatisticRender.bind(this);

//     this.#filmsModel.addObserver(this.#handleModelEvent);
//     this.#filterModel.addObserver(this.#handleModelEvent);
//   }

//   init() {
//     const filters = this.#getFilters();
//     const prevFilterComponent = this.#filterComponent;

//     this.#filterComponent = new FilterView(filters, this.#filterModel.getFilter());
//     this.#filterComponent.setFilterTypeClickHandler(this.#handleFilterTypeChange);
//     this.#filterComponent.setStatisticClickHandler(this.#handleStatisticRender);

//     if (prevFilterComponent === null) {
//       render(this.#filterContainer, this.#filterComponent);
//       return;
//     }

//     replace(this.#filterComponent, prevFilterComponent);
//     remove(prevFilterComponent);
//   }

//   #handleModelEvent = () => {
//     this.init();
//   }

//   #handleFilterTypeChange = (filterType) => {
//     if (this.#filterModel.getFilter() === filterType) {
//       return;
//     }

//     this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
//   }

//   #handleStatisticRender = () => {
//     this.#filterModel.setFilter(UpdateType.STATISTIC, START_STATISTIC_PERIOD);
//   }

//   #getFilters = () => {
//     const films = this.#filmsModel.getFilms();

//     return [
//       {
//         type: FilterType.ALL_MOVIES,
//         name: 'All movies',
//         count: filter[FilterType.ALL_MOVIES](films).length,
//       },
//       {
//         type: FilterType.WATCHLIST,
//         name: 'Watchlist',
//         count: filter[FilterType.WATCHLIST](films).length,
//       },
//       {
//         type: FilterType.HISTORY,
//         name: 'History',
//         count: filter[FilterType.HISTORY](films).length,
//       },
//       {
//         type: FilterType.FAVORITES,
//         name: 'Favorites',
//         count: filter[FilterType.FAVORITES](films).length,
//       },
//     ];
//   }
// }
