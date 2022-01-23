import AbstractView from './abstract.js';

const createFooterStatisticViewTemplate = (filmStatistic) => (
  `<p>${filmStatistic} movies inside</p>`
);

export default class FooterStatisticView extends AbstractView {
  #filmStatistic = null;

  constructor(filmStatistic) {
    super();
    this.#filmStatistic = filmStatistic;
  }

  getTemplate() {
    return createFooterStatisticViewTemplate(this.#filmStatistic);
  }
}
