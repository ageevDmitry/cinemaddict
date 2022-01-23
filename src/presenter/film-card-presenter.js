import {ESCAPE} from '../const.js';
import FilmCardView from '../view/film-card-view.js';
import FilmPopupView from '../view/film-popup-view.js';
import {render, remove, replace} from '../utils/render.js';
import {UserAction, UpdateType, CommentsStatus} from '../const.js';

const START_POPUP_SCROLL = 0;

const Mode = {
  FILM_CARD: 'FILM_CARD',
  FILM_POPUP: 'FILM_POPUP',
};

export default class FilmsCardPresenter {
  #filmContainer = null;
  #film = null;
  #comments = null;
  #filmCardComponent = null;
  #filmPopupComponent = null;
  #changeData = null;
  #changeMode = null;
  #checkCountFilms = null;
  #commentsStatus = null;
  #mode = Mode.FILM_CARD;
  #currentPopupScroll = START_POPUP_SCROLL;

  constructor(filmContainer, changeData, changeMode, checkCountFilms) {

    this.#filmContainer = filmContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#checkCountFilms = checkCountFilms;

    this.#handleAddCommentKeyDown = this.#handleAddCommentKeyDown.bind(this);
    this.#handleDeleteCommentClick = this.#handleDeleteCommentClick.bind(this);
    this.#handleWatchlistClick = this.#handleWatchlistClick.bind(this);
    this.#handleWatchedClick = this.#handleWatchedClick.bind(this);
    this.#handleFavoritesClick = this.#handleFavoritesClick.bind(this);
    this.#escKeyDownHandler = this.#escKeyDownHandler.bind(this);
  }

  #getCurrentScrollPopup = () => {

    const popupCloseScroll = document.querySelector('.film-details');
    this.#currentPopupScroll = popupCloseScroll.scrollTop;
  }

  #setCurrentScrollPopup = () => {

    const popup = document.querySelector('.film-details');
    popup.scrollTo(0, this.#currentPopupScroll);
  }

  #handleWatchlistClick = () => {

    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      Object.assign(
        {},
        this.#film,
        {
          isWatchlist: !this.#film.isWatchlist,
        },
      ),
    );
  }

  #handleWatchedClick = () => {

    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      Object.assign(
        {},
        this.#film,
        {
          isWatched: !this.#film.isWatched,
        },
      ),
    );
  }

  #handleFavoritesClick = () => {

    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      Object.assign(
        {},
        this.#film,
        {
          isFavorite: !this.#film.isFavorite,
        },
      ),
    );
  }

  #handleLoadComment = () => {

    this.#changeData(
      UserAction.LOAD_COMMENT,
      UpdateType.MINOR,
      this.#film,
      null,
    );
  }

  #handleDeleteCommentClick = (commentId) => {

    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.MINOR,
      this.#film,
      commentId,
    );
  }

  #handleAddCommentKeyDown = (emoji, text) => {

    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.MINOR,
      this.#film,
      Object.assign(
        {
          emoji: emoji,
          text: text,
        },
      ),
    );
  }

  #escKeyDownHandler = (evt) => {

    if (evt.key === ESCAPE) {
      evt.preventDefault();
      this.#filmPopupComponent.reset();
      this.#closeFilmPopup(this.#filmPopupComponent);
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  }

  #setFilmCardHandler = () => {

    this.#filmCardComponent.setFilmCardClickHandler(() => {
      this.#renderFilmPopup();
    });
    this.#filmCardComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmCardComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmCardComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmCardComponent.setFavoritesClickHandler(this.#handleFavoritesClick);
  }

  #setFilmPopupHandler = () => {

    this.#filmPopupComponent.setInnerHandlers();
    this.#filmPopupComponent.setClosePopupClickHandler (() => {
      this.#closeFilmPopup(this.#filmPopupComponent);
      this.#filmPopupComponent.reset();
    });
    this.#filmPopupComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmPopupComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmPopupComponent.setFavoritesClickHandler(this.#handleFavoritesClick);
    this.#filmPopupComponent.setAddCommentKeyDownHandler(this.#handleAddCommentKeyDown);
    this.#filmPopupComponent.setDeleteCommentClickHandler(this.#handleDeleteCommentClick);
  }

  #closeFilmPopup = () => {

    remove(this.#filmPopupComponent);
    this.#filmPopupComponent.removeElement();
    document.body.classList.remove('hide-overflow');
    this.#mode = Mode.FILM_CARD;
    this.#currentPopupScroll = START_POPUP_SCROLL;
    this.#checkCountFilms();
  }

  #renderFilmPopup = () => {

    this.#handleLoadComment();
    this.#changeMode();
    this.#mode = Mode.FILM_POPUP;

    document.body.appendChild(this.#filmPopupComponent.getElement());
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#setFilmPopupHandler();
  }

  #renderFilmCard = () => {

    render(this.#filmContainer, this.#filmCardComponent);
  }

  resetView = () => {

    if (this.#mode !== Mode.FILM_CARD) {
      this.#closeFilmPopup();
      this.#mode = Mode.FILM_CARD;
    }
  }

  destroy = () => {

    remove(this.#filmCardComponent);
    this.#filmCardComponent.removeElement();
    remove(this.#filmPopupComponent);
    this.#filmPopupComponent.removeElement();
  }


  init(film, comments, commentsStatus) {

    this.#film = film;
    this.#comments = comments;
    this.#commentsStatus = commentsStatus;

    const prevFilmCardComponent = this.#filmCardComponent;
    const prevFilmPopupComponent = this.#filmPopupComponent;

    this.#filmCardComponent = new FilmCardView(this.#film);
    this.#filmPopupComponent = new FilmPopupView(this.#film, this.#comments, this.#commentsStatus);

    if (prevFilmCardComponent === null || prevFilmPopupComponent === null) {
      this.#renderFilmCard();
      this.#setFilmCardHandler();
      return;
    }

    if (this.#filmContainer.getElement().contains(prevFilmCardComponent.getElement())) {
      replace(this.#filmCardComponent, prevFilmCardComponent);
      this.#setFilmCardHandler();
    }

    if (document.body.contains(prevFilmPopupComponent.getElement())) {
      this.#getCurrentScrollPopup();
      replace(this.#filmPopupComponent, prevFilmPopupComponent);
      this.#setCurrentScrollPopup();
      this.#setFilmPopupHandler();
    }

    remove(prevFilmCardComponent);
    prevFilmCardComponent.removeElement();
    remove(prevFilmPopupComponent);
    prevFilmPopupComponent.removeElement();

    if (commentsStatus === CommentsStatus.COMMENTS_NO_SEND) {
      this.#filmPopupComponent.shake();
    }
  }
}
