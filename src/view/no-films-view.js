import AbstractView from './abstract.js';
import {FilterType} from '../const.js';

const NoFilmsTextType = {
  [FilterType.ALL_MOVIES]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const createNoFilmsViewTemplate = (filterType) => {
  const NoFilmsTextValue = NoFilmsTextType[filterType];

  return (
    `<section class="films-list">
        <h2 class="films-list__title">${NoFilmsTextValue}</h2>
      </section>`
  );
};

export default class NoFilmsView extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return createNoFilmsViewTemplate(this._data);
  }
}
