import AbstractView from './abstract.js';

const createUserRankViewTemplate = (userRank) => (
  `<section class="header__profile profile">
        <p class="profile__rating">${userRank}</p>
          <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
);

export default class UserRankView extends AbstractView {
  constructor(userRank) {
    super();
    this._userRank = userRank;
  }

  getTemplate() {
    return createUserRankViewTemplate(this._userRank);
  }
}
