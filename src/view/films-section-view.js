import AbstractView from './abstract.js';

const createFilmsSectionViewTemplate = () => (
  `<section class="films">
    </section>`
);

export default class FilmsSectionView extends AbstractView {
  getTemplate() {
    return createFilmsSectionViewTemplate();
  }
}
