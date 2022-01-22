import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

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

  if (period === 'today') {
    return dayjs(watchingDate).isBetween(dayjs(new Date()), dayjs().startOf('day'));
  }

  const startingPoint = dayjs(new Date()).subtract(1, period).format();
  return dayjs(watchingDate).isBetween(dayjs(new Date()), startingPoint);
};
