export const COMMENT_EMOJIS = [
  'smile',
  'sleeping',
  'puke',
  'angry',
];

export const ESCAPE = 'Escape';
export const ENTER = 'Enter';

export const START_STATISTIC_PERIOD = 'all-time';

export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

export const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  LOAD_COMMENT: 'LOAD_COMMENT',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const FilterType = {
  ALL_MOVIES: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

export const AUTHORIZATION = 'Basic hu901ibxaqp';

export const END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict';

export const MethodApi = {
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE',
  POST: 'POST',
};

export const StatisticRadioButton = [
  { type : 'all-time', name : 'All time'},
  { type : 'today', name : 'Today'},
  { type : 'week', name : 'Week'},
  { type : 'month', name : 'Month'},
  { type : 'year', name : 'Year'},
];

export const CommentsStatus = {
  COMMENTS_LOAD: 'COMMENTS_LOAD',
  COMMENTS_NO_LOAD: 'COMMENTS_NO_LOAD',
  COMMENTS_NO_SEND: 'COMMENTS_NO_SEND',
  COMMENTS_DELETING: 'COMMENTS_DELETING',
  COMMENT_NO_DELETE: 'COMMENT_NO_DELETE',
};
