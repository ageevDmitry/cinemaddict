import FilmsCardPresenter from './film-card-presenter.js';
import UserRankView from '../view/user-rank-view.js';
import SortingView from '../view/sorting-view.js';
import FilmsSectionView from '../view/films-section-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import ButtonShowMoreView from '../view/button-show-more-view.js';
import NoFilmsView from '../view/no-films-view.js';
import LoadingView from '../view/loading.js';
import StatisticBoardView from '../view/statistic-board-view.js';
import {render, remove} from '../utils/render.js';
import {sortFilmsDate, sortFilmsRating} from '../utils/common.js';
import {filter} from '../utils/filter.js';
import {SortType, UpdateType, UserAction, FilterType} from '../const.js';
import {generateUserRank} from '../utils/user-rank.js';

const CARD_FILMS_COUNT_PER_STEP = 5;

export default class FilmsBoardPresenter {
  constructor(siteHeader, boardContainer, filmsModel, filterModel, commentsModel, api) {
    this._siteHeaderContainer = siteHeader;
    this._boardContainer = boardContainer;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._commentsModel = commentsModel;
    this._filmsSectionComponent = new FilmsSectionView();
    this._filmsListComponent = new FilmsListView();
    this._filmsContainerComponent = new FilmsContainerView();
    this._loadingComponent = new LoadingView();
    this._userRankComponent = null;
    this._sortingComponent = null;
    this._buttonShowMoreComponent = null;
    this._noFilmsComponent = null;
    this._statisticBoardComponent = null;
    this._userRank = null;
    this._filterType = FilterType.ALL_MOVIES;
    this._currentSortType = SortType.DEFAULT;
    this._renderedFilmCount = CARD_FILMS_COUNT_PER_STEP;
    this._isLoading = true;
    this._filmPresenter = new Map();
    this._api = api;
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleShowMoreClick = this._handleShowMoreClick.bind(this);
    this._checkCountFilms = this._checkCountFilms.bind(this);

    this._filterModel.addObserver(this._handleModelEvent);
    this._commentsModel.addObserver(this._handleModelEvent);
    this._filmsModel.addObserver(this._handleModelEvent);

  }

  _handleViewAction(actionType, updateType, updateFilm, updateComment) {

    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._api.updateFilm(this._filmsModel.adaptFilmToServer(updateFilm))
          .then(() => {
            this._filmsModel.updateFilm(updateType, updateFilm);
          });
        break;
      case UserAction.LOAD_COMMENT:
        this._api.getComments(updateFilm)
          .then((comments) => {
            this._commentsModel.setComments(updateType, updateFilm, comments.map(this._commentsModel.adaptCommentToClient));
          });
        break;
      case UserAction.ADD_COMMENT:
        this._api.addComment(this._commentsModel.adaptCommentToServer(updateComment), updateFilm)
          .then((response) => {
            this._commentsModel.setComments(updateType, updateFilm, response.comments.map(this._commentsModel.adaptCommentToClient));
            this._filmsModel.updateFilm(updateType, this._filmsModel.adaptFilmToClient(response.movie));
          });
        break;
      case UserAction.DELETE_COMMENT:
        this._api.deleteComment(updateComment)
          .then(() => {
            this._deleteComment(updateType, updateFilm, updateComment);
          });
        break;
    }
  }

  _handleModelEvent(updateType, updateFilm) {

    switch (updateType) {
      case UpdateType.MINOR:
        this._filmPresenter.get(updateFilm.id).init(updateFilm, this._getComments());
        this._checkCountFilms();
        remove(this._userRankComponent);
        this._renderUserRank();
        break;
      case UpdateType.MAJOR:
        this._renderedFilmCount = CARD_FILMS_COUNT_PER_STEP;
        this._clearBoard({resetRenderedFilmCount: true, resetSortType: true});
        this._renderBoard();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        remove(this._userRankComponent);
        this._renderUserRank();
        this._renderBoard();
        break;
      case UpdateType.STATISTIC:
        this._clearBoard({resetRenderedFilmCount: true, resetSortType: true});
        this._renderStatisticBoard();
    }
  }

  _handleModeChange() {

    this._filmPresenter.forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {

    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._renderedFilmCount = CARD_FILMS_COUNT_PER_STEP;

    this._clearBoard({resetRenderedFilmCount: true});
    this._renderBoard();
  }

  _handleShowMoreClick() {

    const filmCount = this._getFilms().length;

    const newRenderedFilmCount = Math.min(filmCount, this._renderedFilmCount + CARD_FILMS_COUNT_PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmCount, newRenderedFilmCount);

    this._renderFilms(films);

    this._renderedFilmCount = newRenderedFilmCount;

    if (this._renderedFilmCount >= filmCount) {
      remove(this._buttonShowMoreComponent);
    }
  }

  _getFilms() {

    this._filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filtredFilms = filter[this._filterType](films);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filtredFilms.sort(sortFilmsDate);
      case SortType.RATING:
        return filtredFilms.sort(sortFilmsRating);
    }

    return filtredFilms;
  }

  _getComments() {
    const comments = this._commentsModel.getComments();

    return comments;
  }

  _deleteComment(updateType, updateFilm, updateComment) {

    const deletedCommentUpdateFilm = updateFilm;
    const deleteIdCommentUpdateFilm = deletedCommentUpdateFilm.commentsId;
    const deleteCommentId = updateComment;

    function getFilterCommentId(value) {
      return value !== deleteCommentId;
    }

    const filteredCommentId = deleteIdCommentUpdateFilm.filter(getFilterCommentId);
    deletedCommentUpdateFilm.commentsId = filteredCommentId;

    this._commentsModel.deleteComments(updateType, deletedCommentUpdateFilm, updateComment);
  }

  _checkCountFilms() {

    const filmCount = this._getFilms().length;
    const popup = document.querySelector('.film-details');

    if (filmCount <= 5 && !popup) {
      this._clearBoard({resetRenderedFilmCount: true, resetSortType: true});
      this._renderBoard();
    }
  }

  _renderBoard() {

    const films = this._getFilms();
    const filmCount = this._getFilms().length;

    if (filmCount !== 0) {
      this._renderSorting();
    }

    render(this._boardContainer, this._filmsSectionComponent);
    render(this._filmsSectionComponent, this._filmsListComponent);
    render(this._filmsListComponent, this._filmsContainerComponent);

    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (filmCount === 0) {
      this._renderNoFilms();
    } else {
      this._renderFilms(films.slice(0, Math.min(filmCount, this._renderedFilmCount)));
    }

    if (filmCount > CARD_FILMS_COUNT_PER_STEP) {
      this._renderButtonShowMore();
    } else {
      remove(this._buttonShowMoreComponent);
    }
  }

  _clearBoard({resetRenderedFilmCount = false, resetSortType = false} = {}) {

    this._filmPresenter.forEach((presenter) => presenter.destroy());
    this._filmPresenter.clear();

    remove(this._sortingComponent);
    remove(this._filmsSectionComponent);
    remove(this._buttonShowMoreComponent);

    if (this._statisticBoardComponent) {
      remove(this._statisticBoardComponent);
    }

    if (resetRenderedFilmCount) {
      this._renderedTaskCount = CARD_FILMS_COUNT_PER_STEP;
    } else {
      const filmCount = this._getFilms().length;
      this._renderedFilmCount = Math.min(filmCount, this._renderedFilmCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }

    if (this._noFilmsComponent) {
      remove(this._noFilmsComponent);
    }
  }

  _renderUserRank() {

    const films = this._filmsModel.getFilms();
    const wathedFilmsCount = filter[FilterType.HISTORY](films).length;
    this._userRank = generateUserRank(wathedFilmsCount);

    this._userRankComponent = new UserRankView(this._userRank);
    render(this._siteHeaderContainer, this._userRankComponent);
  }

  _renderSorting() {

    if (this._sortingComponent !== null) {
      this._sortingComponent = null;
    }

    this._sortingComponent = new SortingView(this._currentSortType);

    render(this._boardContainer, this._sortingComponent);
    this._sortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderLoading() {
    render(this._filmsContainerComponent, this._loadingComponent);
  }

  _renderNoFilms() {
    this._noFilmsComponent = new NoFilmsView(this._filterType);
    render(this._filmsContainerComponent, this._noFilmsComponent);
  }

  _renderFilms(films) {

    films.forEach((film) => {
      const comments = this._getComments(film);
      const filmsCardPresenter = new FilmsCardPresenter(this._filmsContainerComponent, this._handleViewAction, this._handleModeChange, this._checkCountFilms);
      filmsCardPresenter.init(film, comments);
      this._filmPresenter.set(film.id, filmsCardPresenter);
    });
  }

  _renderButtonShowMore() {

    if (this._buttonShowMoreComponent !== null) {
      this._buttonShowMoreComponent = null;
    }
    this._buttonShowMoreComponent = new ButtonShowMoreView();

    render(this._filmsListComponent, this._buttonShowMoreComponent);
    this._buttonShowMoreComponent.setClickHandler(this._handleShowMoreClick);
  }

  _renderStatisticBoard() {
    this._statisticBoardComponent = new StatisticBoardView(this._filmsModel.getFilms(), this._userRank);
    render(this._boardContainer, this._statisticBoardComponent);
  }

  init() {
    this._api.getFilms()
      .then((films) => {
        this._filmsModel.setFilms(UpdateType.INIT, films.map(this._filmsModel.adaptFilmToClient));
      });

    this._renderUserRank();
    this._renderBoard();
  }
}
