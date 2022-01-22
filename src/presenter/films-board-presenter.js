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
import {SortType, UpdateType, UserAction, FilterType, CommentsStatus} from '../const.js';
import {generateUserRank} from '../utils/user-rank.js';

const CARD_FILMS_COUNT_PER_STEP = 5;

export default class FilmsBoardPresenter {
  #siteHeaderContainer = null;
  #boardContainer = null;
  #filmsModel = null;
  #filterModel = null;
  #commentsModel = null;
  #api = null;
  #filmsSectionComponent = new FilmsSectionView();
  #filmsListComponent = new FilmsListView();
  #filmsContainerComponent = new FilmsContainerView();
  #loadingComponent = new LoadingView();
  #userRankComponent = null;
  #sortingComponent = null;
  #buttonShowMoreComponent = null;
  #noFilmsComponent = null;
  #statisticBoardComponent = null;
  #userRank = null;
  #filterType = FilterType.ALL_MOVIES;
  #currentSortType = SortType.DEFAULT;
  #renderedFilmCount = CARD_FILMS_COUNT_PER_STEP;
  #isLoading = true;
  #isShowMoreButtonDeleted = false;
  #filmPresenter = new Map();

  constructor(siteHeader, boardContainer, filmsModel, filterModel, commentsModel, api) {

    this.#siteHeaderContainer = siteHeader;
    this.#boardContainer = boardContainer;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;
    this.#commentsModel = commentsModel;
    this.#api = api;

    this.#handleViewAction = this.#handleViewAction.bind(this);
    this.#handleModelEvent = this.#handleModelEvent.bind(this);
    this.#handleModeChange = this.#handleModeChange.bind(this);
    this.#handleSortTypeChange = this.#handleSortTypeChange.bind(this);
    this.#handleShowMoreClick = this.#handleShowMoreClick.bind(this);
    this.#checkCountFilms = this.#checkCountFilms.bind(this);

    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);
    this.#filmsModel.addObserver(this.#handleModelEvent);
  }

  #handleViewAction = (actionType, updateType, updateFilm, updateComment) => {

    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#api.updateFilm(this.#filmsModel.adaptFilmToServer(updateFilm))
          .then(() => {
            this.#filmsModel.updateFilm(updateType, updateFilm);
          });
        break;
      case UserAction.LOAD_COMMENT:
        this.#api.getComments(updateFilm)
          .then((comments) => {
            this.#commentsModel.setComments(updateType, updateFilm, comments.map(this.#commentsModel.adaptCommentToClient));
          }).catch(()=> {
            this.#filmPresenter.get(updateFilm.id).init(updateFilm, this.#getComments(), CommentsStatus.COMMENTS_NO_LOAD);
          });
        break;
      case UserAction.ADD_COMMENT:
        this.#api.addComment(this.#commentsModel.adaptCommentToServer(updateComment), updateFilm)
          .then((response) => {
            this.#commentsModel.setComments(updateType, updateFilm, response.comments.map(this.#commentsModel.adaptCommentToClient));
            this.#filmsModel.updateFilm(updateType, this.#filmsModel.adaptFilmToClient(response.movie));
          }).catch(()=> {
            this.#filmPresenter.get(updateFilm.id).init(updateFilm, this.#getComments(), CommentsStatus.COMMENTS_NO_SEND);
          });
        break;
      case UserAction.DELETE_COMMENT:
        this.#api.deleteComment(updateComment)
          .then(() => {
            this.#deleteComment(updateType, updateFilm, updateComment);
          }).catch(()=> {
            this.#filmPresenter.get(updateFilm.id).init(updateFilm, this.#getComments(), CommentsStatus.COMMENT_NO_DELETE);
          });
        break;
    }
  }

  #handleModelEvent = (updateType, updateFilm) => {

    switch (updateType) {
      case UpdateType.MINOR:
        this.#filmPresenter.get(updateFilm.id).init(updateFilm, this.#getComments(), CommentsStatus.COMMENTS_LOAD);
        this.#checkCountFilms();
        remove(this.#userRankComponent);
        this.#renderUserRank();
        break;
      case UpdateType.MAJOR:
        this.#isShowMoreButtonDeleted = false;
        this.#renderedFilmCount = CARD_FILMS_COUNT_PER_STEP;
        this.#clearBoard({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        remove(this.#userRankComponent);
        this.#renderUserRank();
        this.#renderBoard();
        break;
      case UpdateType.STATISTIC:
        this.#clearBoard({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderStatisticBoard();
    }
  }

  #handleModeChange = () => {

    this.#filmPresenter.forEach((presenter) => presenter.resetView());
  }

  #handleSortTypeChange = (sortType) => {

    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#renderedFilmCount = CARD_FILMS_COUNT_PER_STEP;

    this.#clearBoard({resetRenderedFilmCount: true});
    this.#renderBoard();
  }

  #handleShowMoreClick = () => {

    const filmCount = this.#getFilms().length;

    const newRenderedFilmCount = Math.min(filmCount, this.#renderedFilmCount + CARD_FILMS_COUNT_PER_STEP);
    const films = this.#getFilms().slice(this.#renderedFilmCount, newRenderedFilmCount);

    this.#renderFilms(films);

    this.#renderedFilmCount = newRenderedFilmCount;

    if (this.#renderedFilmCount >= filmCount) {
      remove(this.#buttonShowMoreComponent);
      this.#isShowMoreButtonDeleted = true;
    }
  }

  #getFilms = () => {

    this.#filterType = this.#filterModel.getFilter();
    const films = this.#filmsModel.getFilms();
    const filtredFilms = Array.from(filter[this.#filterType](films));

    switch (this.#currentSortType) {
      case SortType.DEFAULT:
        return filtredFilms;
      case SortType.DATE:
        return filtredFilms.sort(sortFilmsDate);
      case SortType.RATING:
        return filtredFilms.sort(sortFilmsRating);
    }
  }

  #getComments = () => {
    const comments = this.#commentsModel.getComments();

    return comments;
  }

  #deleteComment = (updateType, updateFilm, updateComment) => {

    const deletedCommentUpdateFilm = updateFilm;
    const deleteIdCommentUpdateFilm = deletedCommentUpdateFilm.commentsId;
    const deleteCommentId = updateComment;

    function getFilterCommentId(value) {
      return value !== deleteCommentId;
    }

    const filteredCommentId = deleteIdCommentUpdateFilm.filter(getFilterCommentId);
    deletedCommentUpdateFilm.commentsId = filteredCommentId;

    this.#commentsModel.deleteComments(updateType, deletedCommentUpdateFilm, updateComment);
  }

  #checkCountFilms = () => {

    const popup = document.querySelector('.film-details');

    if (!popup) {
      this.#clearBoard({resetRenderedFilmCount: true});
      this.#renderBoard();
    }
  }

  #renderBoard = () => {

    const films = this.#getFilms();
    const filmCount = this.#getFilms().length;

    if (filmCount !== 0) {
      this.#renderSorting();
    }

    render(this.#boardContainer, this.#filmsSectionComponent);
    render(this.#filmsSectionComponent, this.#filmsListComponent);
    render(this.#filmsListComponent, this.#filmsContainerComponent);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (filmCount === 0) {
      this.#renderNoFilms();
    } else {
      this.#renderFilms(films.slice(0, Math.min(filmCount, this.#renderedFilmCount)));
    }

    if (this.#isShowMoreButtonDeleted === true) {
      return;
    }

    if (filmCount > CARD_FILMS_COUNT_PER_STEP) {
      this.#renderButtonShowMore();
    } else {
      remove(this.#buttonShowMoreComponent);
    }
  }

  #clearBoard = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {

    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    remove(this.#sortingComponent);
    remove(this.#filmsSectionComponent);
    remove(this.#buttonShowMoreComponent);

    if (this.#statisticBoardComponent) {
      remove(this.#statisticBoardComponent);
    }

    if (resetRenderedFilmCount) {
      this.#renderedFilmCount = CARD_FILMS_COUNT_PER_STEP;
    } else {
      const filmCount = this.#getFilms().length;
      this.#renderedFilmCount = Math.min(filmCount, this.#renderedFilmCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }

    if (this.#noFilmsComponent) {
      remove(this.#noFilmsComponent);
    }
  }

  #renderUserRank = () => {

    const films = this.#filmsModel.getFilms();
    const wathedFilmsCount = filter[FilterType.HISTORY](films).length;
    this.#userRank = generateUserRank(wathedFilmsCount);

    this.#userRankComponent = new UserRankView(this.#userRank);
    render(this.#siteHeaderContainer, this.#userRankComponent);
  }

  #renderSorting = () => {

    if (this.#sortingComponent !== null) {
      this.#sortingComponent = null;
    }

    this.#sortingComponent = new SortingView(this.#currentSortType);

    render(this.#boardContainer, this.#sortingComponent);
    this.#sortingComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderLoading = () => {
    render(this.#filmsContainerComponent, this.#loadingComponent);
  }

  #renderNoFilms = () => {
    this.#noFilmsComponent = new NoFilmsView(this.#filterType);
    render(this.#filmsContainerComponent, this.#noFilmsComponent);
  }

  #renderFilms = (films) => {

    films.forEach((film) => {
      const comments = this.#getComments(film);
      const filmsCardPresenter = new FilmsCardPresenter(this.#filmsContainerComponent, this.#handleViewAction, this.#handleModeChange, this.#checkCountFilms);
      filmsCardPresenter.init(film, comments, CommentsStatus.COMMENTS_LOAD);
      this.#filmPresenter.set(film.id, filmsCardPresenter, CommentsStatus.COMMENTS_LOAD);
    });
  }

  #renderButtonShowMore = () => {

    if (this.#buttonShowMoreComponent !== null) {
      this.#buttonShowMoreComponent = null;
    }
    this.#buttonShowMoreComponent = new ButtonShowMoreView();

    render(this.#filmsListComponent, this.#buttonShowMoreComponent);
    this.#buttonShowMoreComponent.setClickHandler(this.#handleShowMoreClick);
  }

  #renderStatisticBoard = () => {
    this.#statisticBoardComponent = new StatisticBoardView(this.#filmsModel.getFilms(), this.#userRank);
    render(this.#boardContainer, this.#statisticBoardComponent);
    this.#statisticBoardComponent.renderChart();
    this.#statisticBoardComponent.setStatisticPeriodClickHandlers();
  }

  init() {
    this.#api.getFilms()
      .then((films) => {
        this.#filmsModel.setFilms(UpdateType.INIT, films.map(this.#filmsModel.adaptFilmToClient));
      })
      .catch(()=> {
        this.#renderUserRank();
        this.#renderBoard();
      });
  }
}
