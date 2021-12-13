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

export const generateCommentsId = () => {

  const commentsId = [];
  const commentsIdLength = getRandomInteger(1, COMMENTS_LENGTH_ID_MAX);

  for (let i = 0; i < commentsIdLength; i++) {
    const id =i.toString();
    commentsId.push(id);
  }

  const randomCommentsId = getRandomArray(commentsId);
  const idSet = new Set(randomCommentsId);
  const uniqueId = Array.from(idSet);

  return uniqueId;
};

