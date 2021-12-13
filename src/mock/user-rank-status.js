import {getRandomInteger} from '../utils/common.js';

const USER_RANK_MIN = 0;
const USER_RANK_MAX = 30;

const USER_RANKS = {
  'Novice' : 1,
  'Fan' : 10,
  'Movie Buff' : 20,
};

export const generateUserRank = () => {
  let userRank;

  const userRankInteger = getRandomInteger(USER_RANK_MIN, USER_RANK_MAX);

  if (userRankInteger === USER_RANK_MIN) {
    userRank = '';
  }  else if  (userRankInteger >= USER_RANKS['Novice'] && userRankInteger < USER_RANKS['Fan']) {
    userRank = Object.keys(USER_RANKS)[0];
  } else if  (userRankInteger >= USER_RANKS['Fan'] && userRankInteger < USER_RANKS['Movie Buff']) {
    userRank = Object.keys(USER_RANKS)[1];
  } else if  (userRankInteger >= USER_RANKS['Movie Buff']) {
    userRank = Object.keys(USER_RANKS)[2];
  }
  return userRank;
};
