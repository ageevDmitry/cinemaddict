import {ESCAPE} from '../const.js';
import FilmCardView from '../view/film-card-view.js';
import FilmPopupView from '../view/film-popup-view.js';
import {render, remove, replace} from '../utils/render.js';
import {UserAction,UpdateType} from '../const.js';

const START_POPUP_SCROLL = 0;

const Mode = {
  FILM_CARD: 'FILM_CARD',
  FILM_POPUP: 'FILM_POPUP',
};

export default class FilmsCardPresenter {
  constructor(filmContainer, changeData, changeMode, checkCountFilms) {
    this._filmContainer = filmContainer;
    this._film = null;
    this._comment = null;
    this._comments = null;
    this._filmCardComponent = null;
    this._filmPopupComponent = null;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._checkCountFilms = checkCountFilms;
    this._mode = Mode.FILM_CARD;
    this._currentPopupScroll = START_POPUP_SCROLL;

    this._handleAddCommentKeyDown = this._handleAddCommentKeyDown.bind(this);
    this._handleDeleteCommentClick = this._handleDeleteCommentClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoritesClick = this._handleFavoritesClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  _getCurrentScrollPopup() {
    const popupCloseScroll = document.querySelector('.film-details');
    this._currentPopupScroll = popupCloseScroll.scrollTop;
  }

  _setCurrentScrollPopup() {
    const popup = document.querySelector('.film-details');
    popup.scrollTo(0, this._currentPopupScroll);
  }

  _handleWatchlistClick() {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._film,
        {
          isWatchlist: !this._film.isWatchlist,
        },
      ),
    );
  }

  _handleWatchedClick() {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._film,
        {
          isWatched: !this._film.isWatched,
        },
      ),
    );
  }

  _handleFavoritesClick() {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._film,
        {
          isFavorite: !this._film.isFavorite,
        },
      ),
    );
  }

  _handleLoadComment() {
    this._changeData(
      UserAction.LOAD_COMMENT,
      UpdateType.MINOR,
      this._film,
      null,
    );
  }

  _handleDeleteCommentClick(commentId) {
    this._changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.MINOR,
      this._film,
      commentId,
    );
  }

  _handleAddCommentKeyDown(emoji, text) {
    this._changeData(
      UserAction.ADD_COMMENT,
      UpdateType.MINOR,
      this._film,
      Object.assign(
        {
          emoji: emoji,
          text: text,
        },
      ),
    );
  }

  _escKeyDownHandler (evt) {

    if (evt.key === ESCAPE) {
      evt.preventDefault();
      this._filmPopupComponent.reset();
      this._closeFilmPopup(this._filmPopupComponent);
      document.removeEventListener('keydown', this._escKeyDownHandler);
    }
  }

  _setFilmCardHandler() {
    this._filmCardComponent.setFilmCardClickHandler(() => {
      this._renderFilmPopup();
    });
    this._filmCardComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmCardComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmCardComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmCardComponent.setFavoritesClickHandler(this._handleFavoritesClick);
  }

  _setFilmPopupHandler() {
    this._filmPopupComponent.setInnerHandlers();
    this._filmPopupComponent.setClosePopupClickHandler (() => {
      this._closeFilmPopup(this._filmPopupComponent);
      this._filmPopupComponent.reset();
    });
    this._filmPopupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmPopupComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmPopupComponent.setFavoritesClickHandler(this._handleFavoritesClick);
    this._filmPopupComponent.setAddCommentKeyDownHandler(this._handleAddCommentKeyDown);
    this._filmPopupComponent.setDeleteCommentClickHandler(this._handleDeleteCommentClick);
  }

  _closeFilmPopup() {
    remove(this._filmPopupComponent);
    this._filmPopupComponent.removeElement();
    document.body.classList.remove('hide-overflow');
    this._mode = Mode.FILM_CARD;
    this._currentPopupScroll = START_POPUP_SCROLL;
    this._checkCountFilms();
  }

  _renderFilmPopup() {

    this._handleLoadComment();
    this._changeMode();
    this._mode = Mode.FILM_POPUP;

    document.body.appendChild(this._filmPopupComponent.getElement());
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._setFilmPopupHandler();
  }

  _renderFilmCard() {
    render(this._filmContainer, this._filmCardComponent);
  }

  resetView() {
    if (this._mode !== Mode.FILM_CARD) {
      this._closeFilmPopup();
      this._mode = Mode.FILM_CARD;
    }
  }

  destroy() {
    remove(this._filmCardComponent);
    this._filmCardComponent.removeElement();
    remove(this._filmPopupComponent);
    this._filmPopupComponent.removeElement();
  }

  init(film, comments) {
    this._film = film;
    this._comments = comments;

    const prevFilmCardComponent = this._filmCardComponent;
    const prevFilmPopupComponent = this._filmPopupComponent;

    this._filmCardComponent = new FilmCardView(this._film, this._comments);
    this._filmPopupComponent = new FilmPopupView(this._film, this._comments);

    if (prevFilmCardComponent === null || prevFilmPopupComponent === null) {
      this._renderFilmCard();
      this._setFilmCardHandler();
      return;
    }

    if (this._filmContainer.getElement().contains(prevFilmCardComponent.getElement())) {
      replace(this._filmCardComponent, prevFilmCardComponent);
      this._setFilmCardHandler();
    }

    if (document.body.contains(prevFilmPopupComponent.getElement())) {
      this._getCurrentScrollPopup();
      replace(this._filmPopupComponent, prevFilmPopupComponent);
      this._setCurrentScrollPopup();
      this._setFilmPopupHandler();
    }

    remove(prevFilmCardComponent);
    prevFilmCardComponent.removeElement();
    remove(prevFilmPopupComponent);
    prevFilmPopupComponent.removeElement();
  }
}
