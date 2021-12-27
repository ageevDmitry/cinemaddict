const USER_RANKS = {
  'Novice' : 1,
  'Fan' : 10,
  'Movie Buff' : 20,
};

export const generateUserRank = (wathedFilmsCount) => {
  let userRank;

  const userRankInteger = wathedFilmsCount;

  if (userRankInteger < USER_RANKS['Novice']) {
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
