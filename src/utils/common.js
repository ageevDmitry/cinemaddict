import dayjs from 'dayjs';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const sortFilmsDate = (filmA, filmB) => dayjs(filmB.releaseDate).diff(dayjs(filmA.releaseDate));

export const sortFilmsRating = (filmA, filmB) => filmB.rating - filmA.rating;
