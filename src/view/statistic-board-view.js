import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import Smart from './smart.js';
import {Chart} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {FilterType} from '../const.js';
import {filter} from '../utils/filter.js';
import {getChartData, getTopGenre, getChartDuration, isBetweenDate} from '../utils/films.js';
dayjs.extend(isBetween);

const createStatisticBoardViewTemplate = (userRank, watchedCount, totalDuration, topGenre) => (

  `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${userRank}</span>
    </p>

    <form action="https:cho.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watchedCount}<span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">
          ${totalDuration.hours > 0 ? `${totalDuration.hours}<span class="statistic__item-description">h</span>`: ''}
          ${totalDuration.minutes > 0 ? `${totalDuration.minutes}<span class="statistic__item-description">m</span>`: ''}
        </p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`
);

const createChartElement = (statisticCtx, data) => {
  const BAR_HEIGHT = 50;

  statisticCtx.height = BAR_HEIGHT * 5;

  new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: Object.keys(data),
      datasets: [{
        data: Object.values(data),
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 24,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

export default class StatisticBoardView extends Smart {
  constructor(films, userRank) {
    super();

    this._films = films;
    this._filterFilms = null;
    this._userRank =  userRank;
    this._filmsChart = null;
    this._chartLabels = null;
    this._chartData = null;
    this._topGenre = null;
    this._wathedFilmsCount = null;
    this._totalDuration = null;

    this._getData(this._films);
    setTimeout (() => {
      this._setCharts();
      console.log(this._films);
    }, 0);
  }

  getTemplate() {
    return createStatisticBoardViewTemplate(this._userRank, this._wathedFilmsCount, this._totalDuration, this._topGenre);
  }

  _setCharts() {
    const statisticCtx = this.getElement().querySelector('.statistic__chart');
    this._filmsChart = createChartElement(statisticCtx, this._chartData);
  }

  _getData(films) {
    this._filterFilms = films.filter((film) => isBetweenDate(film.watchingDate, 'year'));
    this._chartData = getChartData(this._filterFilms);
    this._topGenre = getTopGenre(this._chartData);
    this._wathedFilmsCount = filter[FilterType.HISTORY](this._filterFilms).length;
    this._totalDuration = getChartDuration(this._filterFilms);

    console.log(this._filterFilms);
  }
}
