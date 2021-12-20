// import UserRankView from './view/user-rank-view.js';
import FooterStatisticView from './view/footer-statistic-view.js';
import {render} from './utils/render.js';
// import {generateUserRank} from './mock/user-rank-status.js';
import {generateStatistic} from './mock/statistic.js';
import {AUTHORIZATION, END_POINT} from './const.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';
import CommentsModel from './model/commenst-model.js';
import FilmsBoardPresenter from './presenter/films-board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import Api from './api.js';

const siteHeader = document.querySelector('.header');
const siteMain = document.querySelector('.main');
const footer = document.querySelector('.footer');
const footerStatistics = footer.querySelector('.footer__statistics');

const api = new Api(END_POINT, AUTHORIZATION);

// const userRank = generateUserRank();
const statistic = generateStatistic();

const filmsModel = new FilmsModel();
const filterModel = new FilterModel();
const commentsModel = new CommentsModel();

// render(siteHeader, new UserRankView(userRank));
const board = new FilmsBoardPresenter(siteHeader, siteMain, filmsModel, filterModel, commentsModel, api);
const filterPresenter = new FilterPresenter(siteMain, filterModel, filmsModel);

filterPresenter.init();
board.init();

render(footerStatistics, new FooterStatisticView(statistic));
