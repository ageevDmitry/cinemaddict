import {getRandomInteger} from '../utils/common.js';

const FILM_STATISTIC_MIN = 100000;
const FILM_STATISTIC_MAX = 200000;

export const generateStatistic = () => getRandomInteger(FILM_STATISTIC_MIN, FILM_STATISTIC_MAX);
