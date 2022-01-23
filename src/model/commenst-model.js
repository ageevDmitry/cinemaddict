import AbstractObserver from '../utils/abstract-observer.js';

export default class CommentsModel extends AbstractObserver {
  #comments = null;

  constructor() {
    super();
    this.#comments = [];
  }

  setComments(updateType, updateFilm, comments) {
    this.#comments = comments.slice();

    this._notify(updateType, updateFilm);
  }

  getComments() {
    return this.#comments;
  }

  addComments(updateType, updateFilm, newComment) {
    this.#comments = [
      newComment,
      ...this.#comments,
    ];

    this._notify(updateType, updateFilm, newComment);
  }

  deleteComments(updateType, updateFilm, updateCommentId) {
    const index = this.#comments.findIndex((comment) => comment.id === updateCommentId);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting film');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1),
    ];

    this._notify(updateType, updateFilm, updateCommentId);
  }

  adaptCommentToClient(comment) {

    const adaptedComment = Object.assign(
      {},
      comment,
      {
        emoji: comment.emotion,
        text: comment.comment,
        day: comment.date,
      },
    );

    delete adaptedComment.emotion;
    delete adaptedComment.comment;
    delete adaptedComment.date;

    return adaptedComment;
  }

  adaptCommentToServer(comment) {

    const adaptedComment = Object.assign(
      {},
      comment,
      {
        comment: comment.text,
        emotion: comment.emoji,
      },
    );

    delete adaptedComment.emoji;
    delete adaptedComment.text;

    return adaptedComment;
  }
}
