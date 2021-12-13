import AbstractView from './abstract.js';

const createFooterStatisticViewTemplate = (filmStatistic) => (
  `<p>${filmStatistic} movies inside</p>`
);

export default class FooterStatisticView extends AbstractView {
  constructor(filmStatistic) {
    super();
    this._filmStatistic = filmStatistic;
  }

  getTemplate() {
    return createFooterStatisticViewTemplate(this._filmStatistic);
  }
}
