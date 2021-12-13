import dayjs from 'dayjs';
import AbstractView from './abstract.js';

const FILM_DESCRIPTION_LENGTH = 140;
const isFilmFlag = (flag) => (flag) ? 'film-card__controls-item--active' : '';

export const createFilmCardViewTemplate = (film) => {

  const {poster, title, rating, releaseDate, runtime, genres, description, isWatchlist, isWatched, isFavorite} = film;
  const limitDescription = `${description.substr(0, FILM_DESCRIPTION_LENGTH)}...`;
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
          <span class="film-card__duration">${runtime}</span>
          <span class="film-card__genre">${genres[0]}</span>
        </p>
        <img src="./${poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${limitDescription}</p>
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
  constructor(film) {
    super();
    this._film = film;
    this._filmCardClickHandler = this._filmCardClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoritesClickHandler = this._favoritesClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardViewTemplate(this._film);
  }

  _filmCardClickHandler(evt) {
    evt.preventDefault();
    this._callback.openClick();
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  _favoritesClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoritesClick();
  }

  setFilmCardClickHandler(callback) {
    this._callback.openClick = callback;

    this.getElement().querySelectorAll('.film-card__poster, .film-card__title, .film-card__comments').forEach((elem) => {
      elem.addEventListener('click', this._filmCardClickHandler);
    });
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;

    this.getElement().querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this._watchlistClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;

    this.getElement().querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this._watchedClickHandler);
  }

  setFavoritesClickHandler(callback) {
    this._callback.favoritesClick = callback;

    this.getElement().querySelector('.film-card__controls-item--favorite').addEventListener('click', this._favoritesClickHandler);
  }
}
