import AbstractObserver from '../utils/abstract-observer.js';

export default class FilmsModel extends AbstractObserver {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = films.slice();

    this._notify(updateType);
  }

  getFilms() {
    return this._films;
  }

  updateFilm(updateType, updateFilm) {
    const index = this._films.findIndex((film) => film.id === updateFilm.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this._films = [
      ...this._films.slice(0, index),
      updateFilm,
      ...this._films.slice(index + 1),
    ];

    this._notify(updateType, updateFilm);
  }

  adaptFilmToClient(film) {

    const adaptedFilm = Object.assign(
      {},
      film,
      {
        poster: film['film_info'].poster,
        title: film['film_info'].title,
        originalTitle: film['film_info'].alternative_title,
        rating: film['film_info']['total_rating'],
        director: film['film_info'].director,
        writers: film['film_info'].writers,
        actors: film['film_info'].actors,
        releaseDate: film['film_info'].release.date,
        runtime: film['film_info'].runtime,
        country: film['film_info'].release['release_country'],
        genres: film['film_info'].genre,
        description: film['film_info'].description,
        ageLimit: film['film_info'].age_rating,
        isWatchlist: film['user_details'].watchlist,
        isWatched: film['user_details']['already_watched'],
        isFavorite: film['user_details']['favorite'],
        watchingDate: film['user_details']['watching_date'],
        commentsId: film.comments,
      },
    );

    delete adaptedFilm.comments;
    delete adaptedFilm['film_info'];
    delete adaptedFilm['user_details'];

    return adaptedFilm;
  }

  adaptFilmToServer(film) {
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        comments: film.commentsId,
        ['film_info']: {
          actors: film.actors,
          ['age_rating']: film.ageLimit,
          ['alternative_title']: film.originalTitle,
          description: film.originalTitle,
          director: film.director,
          genre: film.genres,
          poster: film.poster,
          release: {
            date: film.releaseDate,
            ['release_country']: film.country,
          },
          runtime: film.runtime,
          title: film.title,
          ['total_rating']: film.rating,
          writers: film.writers,
        },
        ['user_details']: {
          ['already_watched']: film.isWatched,
          favorite: film.isFavorite,
          ['watching_date']: film.releaseDate,
          ['watchlist']: film.isWatchlist,
        },
      },
    );

    delete adaptedFilm.poster;
    delete adaptedFilm.title;
    delete adaptedFilm.originalTitle;
    delete adaptedFilm.rating;
    delete adaptedFilm.director;
    delete adaptedFilm.writers;
    delete adaptedFilm.actors;
    delete adaptedFilm.releaseDate;
    delete adaptedFilm.runtime;
    delete adaptedFilm.country;
    delete adaptedFilm.genres;
    delete adaptedFilm.description;
    delete adaptedFilm.ageLimit;
    delete adaptedFilm.isWatchlist;
    delete adaptedFilm.isWatched;
    delete adaptedFilm.isFavorite;
    delete adaptedFilm.commentsId;

    return adaptedFilm;
  }
}


