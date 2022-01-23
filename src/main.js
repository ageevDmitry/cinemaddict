import FooterStatisticView from './view/footer-statistic-view.js';
import {render} from './utils/render.js';
import {generateStatistic} from './utils/films.js';
import {AUTHORIZATION, END_POINT} from './const.js';
import FilmsModel from './model/films-model.js';
import MenuModel from './model/menu-model';
import CommentsModel from './model/commenst-model.js';
import FilmsBoardPresenter from './presenter/films-board-presenter.js';
import MenuPresenter from './presenter/menu-presenter.js';
import Api from './api.js';

const siteHeader = document.querySelector('.header');
const siteMain = document.querySelector('.main');
const footer = document.querySelector('.footer');
const footerStatistics = footer.querySelector('.footer__statistics');

const api = new Api(END_POINT, AUTHORIZATION);

const statistic = generateStatistic();

const filmsModel = new FilmsModel();
const menuModel = new MenuModel();
const commentsModel = new CommentsModel();

const board = new FilmsBoardPresenter(siteHeader, siteMain, filmsModel, menuModel, commentsModel, api);
const menuPresenter = new MenuPresenter(siteMain, menuModel, filmsModel);

menuPresenter.init();
board.init();

render(footerStatistics, new FooterStatisticView(statistic));
