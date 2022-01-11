import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import {getRandomInteger}  from './common.js';
dayjs.extend(isBetween);

export const COMMENTS_LENGTH_ID_MAX = 10;

export const getRandomFractionInteger = (a = 0, b = 1) => {
  const randomInteger = Math.random() * (b - a) + a;
  const randomFractionInteger = Math.floor(randomInteger * 10) / 10;

  return randomFractionInteger;
};

export const getRandomItem = (array) => array[getRandomInteger(0, array.length - 1)];

export const getRandomArray = (array) => {

  const randomArrayLength = getRandomInteger(1, array.length);
  const newArray = new Array(randomArrayLength).fill().map(() => getRandomItem(array));

  return newArray;
};

export const checkArrayPunctuation = (array) => {
  const cloneArray = [];

  array.forEach((item) => {
    const arraySymbol = item.split('');
    if (arraySymbol[0] === ' ') {
      arraySymbol.shift();
    } else if (arraySymbol[arraySymbol.length - 1] !== '.') {
      arraySymbol.push('.');
    }
    const total = arraySymbol.join('');

    cloneArray.push(total);
  });

  return cloneArray;
};

export const getRandomDate = (yearMin, yearMax) => {
  const year = getRandomInteger(yearMin, yearMax);
  const month = getRandomInteger(0, 12);
  const hour = getRandomInteger(0, 24);
  const minute = getRandomInteger(0, 60);

  const date = new Date(year, month, hour, minute);
  return date;
};

export const getChartData = (films) => {
  const chartData = films.map((film) => film.genres)
    .flat()
    .reduce((previousValue, currentValue) => {
      if (previousValue[currentValue] === undefined) {
        previousValue[currentValue] = 1;
      } else {
        previousValue[currentValue] = previousValue[currentValue] + 1;
      }
      return previousValue;
    }, {});

  return chartData;
};

export const getTopGenre = (chartData) => {

  const values = Object.values(chartData);
  const keys = Object.keys(chartData);

  let data = 0;
  let topGenreIndex = 0;

  values.forEach((element, index) => {
    if (element > data) {
      data = element;
      topGenreIndex = index;
    }
  });

  return keys[topGenreIndex];
};

export const getFilmDuration = (duration) => {

  const hours = Math.trunc(duration / 60);
  const minutes = duration - hours * 60;

  const filmDuration = {
    hours : hours,
    minutes : minutes,
  };

  return filmDuration;
};

export const getChartDuration = (films) => {

  let durationMinutes = 0;

  films.forEach((film) => {
    durationMinutes = durationMinutes + film.runtime;
  });

  return getFilmDuration(durationMinutes);
};

export const isBetweenDate = (watchingDate, period) => {

  const between = dayjs(new Date()).subtract(1, period).format();
  // const flag = dayjs(watchingDate).isBetween(dayjs(new Date()), dayjs().startOf(period));
  const flag = dayjs(watchingDate).isBetween(dayjs(new Date()), between);

  return flag;
};
