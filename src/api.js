import {MethodApi} from '../src/const.js';

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299,
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getFilms() {
    return this._load({url: 'movies'})
      .then(Api.toJSON);
  }

  updateFilm(film) {
    return this._load({
      url: `movies/${film.id}`,
      method: MethodApi.PUT,
      body: JSON.stringify(film),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON);
  }

  getComments(film) {

    // return this._load({url: `comments/${film.id}`})
    return this._load({url: ``})
      .then(Api.toJSON);
  }

  addComment(comment, film) {
    return this._load({
      url: `comments/${film.id}`,
      method: MethodApi.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON);
  }

  deleteComment(CommentId) {
    return this._load({
      url: `comments/${CommentId}`,
      method: MethodApi.DELETE,
    });
  }

  _load({
    url,
    method = MethodApi.GET,
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Authorization', this._authorization);

    return fetch(
      `${this._endPoint}/${url}`,
      {method, body, headers},
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN ||
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
