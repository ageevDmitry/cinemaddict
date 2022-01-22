import dayjs from 'dayjs';
import AbstractView from './abstract.js';

const FILM_DESCRIPTION_LENGTH_LIMIT = 140;
const isFilmFlag = (flag) => (flag) ? 'film-card__controls-item--active' : '';

export const createFilmCardViewTemplate = (film) => {

  const {poster, title, rating, releaseDate, runtime, genres, description, isWatchlist, isWatched, isFavorite} = film;
  const isWatchlistClassName = isFilmFlag(isWatchlist);
  const isWatchedClassName = isFilmFlag(isWatched);
  const isFavoriteClassName = isFilmFlag(isFavorite);
  const filmCommentsCount = film.commentsId.length;

  return (
    `<article class="film-card">
      <a class="film-card__link">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${rating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${dayjs(releaseDate).format('YYYY')}</span>
          <span class="film-card__duration">
            ${dayjs(new Date(0, 0, 0, 0, runtime)).format('H[h] mm[m]')}
          <span class="film-card__genre">${genres[0]}</span>
        </p>
        <img src="./${poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${description.length > FILM_DESCRIPTION_LENGTH_LIMIT ? `${description.substr(0, FILM_DESCRIPTION_LENGTH_LIMIT)}...` : `${description}`}</p>
        <span class="film-card__comments">${filmCommentsCount} comments</span>
      </a>
      <div class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${isWatchlistClassName}">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${isWatchedClassName}">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite ${isFavoriteClassName}">Mark as favorite</button>
      </div>
    </article>`
  );
};

export default class FilmCardView extends AbstractView {

  #film = null;

  constructor(film) {
    super();
    this.#film = film;
    this.#filmCardClickHandler = this.#filmCardClickHandler.bind(this);
    this.#watchlistClickHandler = this.#watchlistClickHandler.bind(this);
    this.#watchedClickHandler = this.#watchedClickHandler.bind(this);
    this.#favoritesClickHandler = this.#favoritesClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardViewTemplate(this.#film);
  }

  #filmCardClickHandler = (evt) => {
    evt.preventDefault();

    if (evt.target.tagName !== 'BUTTON') {
      this._callback.openClick();
    }
  }

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  #favoritesClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoritesClick();
  }

  setFilmCardClickHandler(callback) {
    this._callback.openClick = callback;

    this.getElement().addEventListener('click', this.#filmCardClickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;

    this.getElement().querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchlistClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;

    this.getElement().querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#watchedClickHandler);
  }

  setFavoritesClickHandler(callback) {
    this._callback.favoritesClick = callback;

    this.getElement().querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoritesClickHandler);
  }
}
