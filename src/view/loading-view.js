import AbstractView from './abstract.js';


const createLoadingViewTemplate = () => (
  '<h2 class="films-list__title">Loading...</h2>'
);

export default class LoadingView extends AbstractView {
  getTemplate() {
    return createLoadingViewTemplate();
  }
}
