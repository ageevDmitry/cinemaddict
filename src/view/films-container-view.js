import AbstractView from './abstract.js';

const createFilmsContainerViewTemplate = () => (
  `<div class="films-list__container">
   </div>`
);

export default class FilmsContainerView extends AbstractView {

  getTemplate() {
    return createFilmsContainerViewTemplate();
  }
}
