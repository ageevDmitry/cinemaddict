import {getRandomInteger}  from './common.js';

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

export const getAllFilmsGenres = (films) => {
  const allGenres = [];

  for (let i = 0; i < films.length; i++) {

    const currentfilm = films[i];

    for (let n = 0; n < currentfilm.genres.length; n++) {
      allGenres.push(currentfilm.genres[n]);
    }
  }
  return allGenres;
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

export const getChartLabels = (allFilmsGenres) => {
  const labels = new Set(allFilmsGenres);

  return Array.from(labels);
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

export const getTotalDuration = (films) => {

  let durationMinutes = 0;

  films.forEach((film) => {
    durationMinutes = durationMinutes + film.runtime;
  });

  return getFilmDuration(durationMinutes);
};
