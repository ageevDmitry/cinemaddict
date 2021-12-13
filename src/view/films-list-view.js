import AbstractView from './abstract.js';

export const createFilmsListViewTemplate = () => (
  `<section class="films-list">
  </section>`
);

export default class FilmsListView extends AbstractView {
  getTemplate() {
    return createFilmsListViewTemplate();
  }
}
