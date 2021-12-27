// import {nanoid} from 'nanoid';
// import {getRandomInteger}  from '../utils/common.js';
// import {getRandomFractionInteger, getRandomArray, getRandomItem, checkArrayPunctuation, getRandomDate, generateCommentsId} from '../utils/films.js';

// const FILM_YEAR_MIN = 1900;
// const FILM_YEAR_MAX = 2020;
// const FILM_HOUR_MIN = 0;
// const FILM_HOUR_MAX = 3;
// const FILM_MINUTES_MIN = 1;
// const FILM_MINUTES_MAX = 59;
// const FILM_RATING_MIN = 0;
// const FILM_RATING_MAX = 10;

// const FILM_POSTERS = [
//   'made-for-each-other.png',
//   'popeye-meets-sinbad.png',
//   'sagebrush-trail.jpg',
//   'santa-claus-conquers-the-martians.jpg',
//   'the-dance-of-life.jpg',
//   'the-great-flamarion.jpg',
//   'the-man-with-the-golden-arm.jpg',
// ];

// const FILM_TITLES = [
//   'The Shawshank Redemption',
//   'The Godfather',
//   'The Godfather: Part II',
//   'The Dark Knight',
//   '12 Angry Men',
//   'Schindler\'s List',
//   'The Lord of the Rings: The Return of the King',
//   'Pulp Fiction',
//   'Il buono, il brutto, il cattivo',
//   'The Lord of the Rings: The Fellowship of the Ring',
//   'Fight Club',
//   'Forrest Gump',
//   'Inception',
//   'Star Wars: Episode V - The Empire Strikes Back',
//   'The Lord of the Rings: The Two Towers',
//   'The Matrix',
//   'Goodfellas',
//   'One Flew Over the Cuckoo\'s Nest',
//   'Shichinin no samurai',
//   'Se7en',
// ];

// const FILM_DIRECTORS = [
//   'Michael Mann',
//   'James Cameron',
//   'Steven Spielberg',
//   'Spike Lee',
//   'Tony Scott',
//   'John Singleton',
//   'Richard Donner',
//   'Quentin Tarantino',
//   'George Lucas',
//   'Martin Scorsese',
//   'Jerry Bruckheimer',
//   'Jim Henson',
// ];

// const FILM_WRITERS = [
//   'David Lynch',
//   'Joel and Ethan Coen',
//   'Terrence Malick',
//   'Abbas Kiarostami',
//   'Errol Morris',
//   'Hayao Miyazaki',
//   'David Cronenberg',
//   'Terence Davies',
//   'Lukas Moodysson',
//   'Lynne Ramsay',
//   'Bela Tarr',
//   'Wong Kar-wai',
// ];

// const FILM_ACTORS = [
//   'Jack Nicholson',
//   'Marlon Brando',
//   'Robert De Niro',
//   'Al Pacino',
//   'Daniel Day-Lewis',
//   'Dustin Hoffman',
//   'Tom Hanks',
//   'Anthony Hopkins',
//   'Paul Newman',
//   'Denzel Washington',
//   'Spencer Tracy',
//   'Laurence Olivieri',
// ];

// const COUNTRIES = [
//   'USA',
//   'Great Britain',
//   'Germany',
//   'France',
//   'Canada',
//   'Russia',
//   'China',
//   'Sweden',
//   'Ukraine',
//   'Brazil',
//   'Poland',
//   'Zanzibar',
// ];

// const AGE_LIMITS = [
//   '0+',
//   '6+',
//   '12+',
//   '16+',
//   '18+',
// ];

// const FILM_DESCRIPTION = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';

// const FILM_GENRES = [
//   'Drama',
//   'Mystery',
//   'Comedy',
//   'Western',
//   'Musical',
//   'Cartoon',
// ];

// const generateFilmRuntime = () => {

//   const hour = getRandomInteger(FILM_HOUR_MIN, FILM_HOUR_MAX);
//   const min = getRandomInteger(FILM_MINUTES_MIN, FILM_MINUTES_MAX);
//   const filmDuration = `${hour}h ${min}min`;

//   return filmDuration;
// };

// const generateFilmDescription = (description) => {

//   const descriptionArray = description.split('. ');
//   const checkedDescriptionArray = checkArrayPunctuation(descriptionArray);
//   const newDescription = getRandomArray(checkedDescriptionArray).join(' ');

//   return newDescription;
// };

// export const generateFilm = () => ({
//   id: nanoid(),
//   poster: getRandomItem(FILM_POSTERS),
//   title: getRandomItem(FILM_TITLES),
//   originalTitle: getRandomItem(FILM_TITLES),
//   rating: getRandomFractionInteger(FILM_RATING_MIN, FILM_RATING_MAX),
//   director: getRandomItem(FILM_DIRECTORS),
//   writers: getRandomArray(FILM_WRITERS),
//   actors: getRandomArray(FILM_ACTORS),
//   releaseDate: getRandomDate(FILM_YEAR_MIN, FILM_YEAR_MAX),
//   runtime: generateFilmRuntime(),
//   country: getRandomItem(COUNTRIES),
//   genres: getRandomArray(FILM_GENRES),
//   description: generateFilmDescription(FILM_DESCRIPTION),
//   ageLimit: getRandomItem(AGE_LIMITS),
//   isWatchlist: Boolean(getRandomInteger()),
//   isWatched: Boolean(getRandomInteger()),
//   isFavorite: Boolean(getRandomInteger()),
//   commentsId: generateCommentsId(),
// });
