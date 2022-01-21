import Smart from './smart.js';
import {Chart} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {FilterType, statisticRadioButtons, START_STATISTIC_PERIOD} from '../const.js';
import {filter} from '../utils/filter.js';
import {getChartData, getTopGenre, getChartDuration, isBetweenDate} from '../utils/films.js';

const createStatisticBoardViewTemplate = (userRank, watchedCount, totalDuration, topGenre, statisticPeriod) => {

  const getStatisticRadioButtonTemplate = (button) => {

    const {type, name} = button;

    return (
      `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${type}" value="${type}" ${type === statisticPeriod ? 'checked' : ''}>
      <label for="statistic-${type}" class="statistic__filters-label">${name}</label>`
    );
  };

  const getStatisticFormTemplate = () => {

    const statisticRadioButtonTemplate = statisticRadioButtons.map((button) => getStatisticRadioButtonTemplate(button)).join('');

    return (
      `<form action="https:cho.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>
      ${statisticRadioButtonTemplate}
      </form>`
    );
  };

  const statisticFormTemplate = getStatisticFormTemplate();

  return (

    `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${userRank}</span>
    </p>
    ${statisticFormTemplate}

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text"> ${watchedCount !== null ? `${watchedCount}`: '0'}
       <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">
          ${totalDuration !== null ? `${totalDuration.hours}<span class="statistic__item-description">h</span>`: ''}
          ${totalDuration !== null ? `${totalDuration.minutes}<span class="statistic__item-description">m</span>`: ''}
        </p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">
          ${topGenre !== null ? `${topGenre}`: ''}          
        </p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`
  );
};

const createChartElement = (statisticCtx, data) => {

  if (data === null) {
    return;
  }

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

    this._films = filter[FilterType.HISTORY](films);
    this._filterFilms = null;
    this._userRank =  userRank;
    this._filmsChart = null;
    this._chartLabels = null;
    this._chartData = null;
    this._topGenre = null;
    this._wathedFilmsCount = null;
    this._totalDuration = null;
    this._statisticPeriod = START_STATISTIC_PERIOD;

    this._getData();

    this._choiceStatisticPeriod = this._choiceStatisticPeriod.bind(this);
  }

  getTemplate() {
    return createStatisticBoardViewTemplate(this._userRank, this._wathedFilmsCount, this._totalDuration, this._topGenre, this._statisticPeriod);
  }

  _choiceStatisticPeriod(evt) {
    evt.preventDefault();
    this._statisticPeriod = evt.target.value;
    this._getData();
    this.updateData(this._filterFilms);
    this.renderChart();
    this._setCharts();
  }

  setStatisticPeriodClickHandlers() {
    this.getElement().querySelector('.statistic__filters').addEventListener('change', this._choiceStatisticPeriod);
  }

  restoreHandlers() {
    this.setStatisticPeriodClickHandlers();
  }

  renderChart() {
    this._setCharts();
  }

  _setCharts() {
    const statisticCtx = this.getElement().querySelector('.statistic__chart');
    this._filmsChart = createChartElement(statisticCtx, this._chartData);
  }

  _getData() {

    if (this._statisticPeriod !== START_STATISTIC_PERIOD) {
      this._filterFilms = this._films.filter((film) => isBetweenDate(film.watchingDate, this._statisticPeriod));
    } else {
      this._filterFilms = this._films;
    }

    if (this._filterFilms.length !== 0) {
      this._chartData = getChartData(this._filterFilms);
      this._topGenre = getTopGenre(this._chartData);
      this._wathedFilmsCount = filter[FilterType.HISTORY](this._filterFilms).length;
      this._totalDuration = getChartDuration(this._filterFilms);
    } else {
      this._chartData = null;
      this._topGenre = null;
      this._wathedFilmsCount = null;
      this._totalDuration = null;
    }
  }
}
