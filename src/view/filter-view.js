// import AbstractView from './abstract.js';

// const createFilterViewTemplate = (filters, currentFilterType) => {

//   const getFilterTemplate = (filterLink, currentFilterTypeLink) => {
//     const {type, name, count} = filterLink;

//     return (
//       `<a href="#${type}" class="main-navigation__item ${type === currentFilterTypeLink ? 'main-navigation__item--active' : ''}" data-filter-type="${type}">
//       ${name}
//       ${type !== 'all' ? `<span class="main-navigation__item-count" data-filter-type="${type}">${count}</span>` : ''}</a>`
//     );
//   };

//   const filterTemplate = filters.map((filter) => getFilterTemplate(filter, currentFilterType)).join('');

//   return (
//     `<nav class="main-navigation">
//       <div class="main-navigation__items">
//         ${filterTemplate}
//       </div>
//       <a href="#stats" class="main-navigation__additional">Stats</a>
//     </nav>`
//   );
// };

// export default class FilterView extends AbstractView {
//   constructor(filters, currentFilterType) {
//     super();
//     this._filters = filters;
//     this._currentFilterType = currentFilterType;

//     this._filterTypeClickHandler = this._filterTypeClickHandler.bind(this);
//     this._statisticHandler = this._statisticHandler.bind(this);
//   }

//   getTemplate() {
//     return createFilterViewTemplate(this._filters, this._currentFilterType);
//   }

//   _filterTypeClickHandler(evt) {
//     evt.preventDefault();
//     this._callback.filterTypeClick(evt.target.dataset.filterType);
//   }

//   _statisticHandler(evt) {
//     evt.preventDefault();
//     this._callback.statisticClick();
//   }

//   setFilterTypeClickHandler(callback) {
//     this._callback.filterTypeClick = callback;
//     this.getElement().querySelectorAll('.main-navigation__item ')
//       .forEach((element) => element.addEventListener('click', this._filterTypeClickHandler));
//   }

//   setStatisticClickHandler(callback) {
//     this._callback.statisticClick = callback;
//     this.getElement().querySelector('.main-navigation__additional').addEventListener('click', this._statisticHandler);
//   }
// }
