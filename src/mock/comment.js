import {getRandomItem, getRandomDate} from '../utils/films.js';
import {COMMENT_EMOJIS} from '../const.js';

const COMMENT_YEAR_MIN = 2015;
const COMMENT_YEAR_MAX = 2020;

const COMMENT_TEXTS = [
  'Interesting setting and a good cast',
  'Booooooooooring',
  'Very very old. Meh',
  'Almost two hours? Seriously?',
];

const COMMENT_AUTHORS = [
  'Tim Macoveev',
  'John Doe',
  'Alina Green',
  'Peter Snow',
];

export const generateComment = (id) => ({
  id: id,
  emoji: getRandomItem(COMMENT_EMOJIS),
  text: getRandomItem(COMMENT_TEXTS),
  author: getRandomItem(COMMENT_AUTHORS),
  day: getRandomDate(COMMENT_YEAR_MIN, COMMENT_YEAR_MAX),
});
