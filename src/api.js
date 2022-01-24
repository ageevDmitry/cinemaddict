import {MethodApi} from '../src/const.js';

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299,
};

export default class Api {
  #endPoint = null;
  #authorization = null;

  constructor(endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  getFilms() {
    return this.#load({url: 'movies'})
      .then(Api.toJSON);
  }

  updateFilm(film) {
    return this.#load({
      url: `movies/${film.id}`,
      method: MethodApi.PUT,
      body: JSON.stringify(film),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON);
  }

  getComments(film) {

    return this.#load({url: `comments/${film.id}`})
      .then(Api.toJSON);
  }

  addComment(comment, film) {
    return this.#load({
      url: `comments/${film.id}`,
      method: MethodApi.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON);
  }

  deleteComment(CommentId) {
    return this.#load({
      url: `comments/${CommentId}`,
      method: MethodApi.DELETE,
    });
  }

  #load = ({
    url,
    method = MethodApi.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);

    return fetch(
      `${this.#endPoint}/${url}`,
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
