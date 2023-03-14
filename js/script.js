const state = {
  currentPage: window.location.pathname,
  search: {
    page: 1,
    query: '',
    pages: 1,
  },
};

// active link

function activeLink() {
  const links = document.querySelectorAll('nav a');
  for (let link of links) {
    const attr = link.getAttribute('href');
    if (attr === state.currentPage) {
      link.classList.add('activeLink');
    }
  }
}

// getting Popular Movies

const getPopularMovie = async () => {
  const { results } = await retreiveData('/movie/popular');
  spinnerHide();

  for (let movie of results) {
    const newEL = document.createElement('div');
    newEL.className = 'block';
    newEL.innerHTML = `
    <a href="movie-info.html?id=${movie.id}">
      ${
        movie.poster_path
          ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="block-img" alt="${movie.title}"></img>`
          : `<img src="/images/no-image.png" class="block-img" alt="${movie.title}"></img>`
      }
    </a>
    <div class="block-body">
      <h5 class="block-title">${movie.title}</h5>
      <p class="block-text">
        <small class="text-muted">Release: ${movie.release_date}</small>
      </p>
      <div class="rating"><i class="fas fa-star"> ${
        movie.vote_average
      }</i></div>
    </div>`;
    document.querySelector('#popular-movies').appendChild(newEL);
  }
};

// getting movieDetails
async function getMovieInfo() {
  const movieQuery = window.location.search.split('=');
  const movieId = movieQuery[1];
  const response = await retreiveData(`/movie/${movieId}`);

  //   backdrop image
  backdropImage('movie', response.backdrop_path);

  const newEl = document.createElement('div');
  newEl.className = 'movie-info';
  newEl.innerHTML = `
    <div class="details-head">
        <div>
            <p>
                <i class="fa-solid fa-star text-secondary"></i> ${response.vote_average.toFixed(
                  1
                )}
            </p>
            <p class="text-muted">Relase Date: ${response.release_date}</p>
            <p class="text-muted"> Language: ${response.original_language}</p>
            <p>${response.overview}</p>
        </div>
        <div>
        ${
          response.poster_path
            ? `<img src="https://image.tmdb.org/t/p/w500${response.poster_path}" class="block-img" alt="${response.original_name}"></img>`
            : `<img src="/images/no-image.png" class="block-img" alt="${response.original_name}"></img>`
        }
        </div>
    </div>
    <div class="genres">
        <h3>Genres</h3>
        <ul class="group-list">
            ${response.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
        </ul>
    </div>
</div>
<div class="details-foot">
    <h2>Movie Info</h2>
    <ul>
        <li><span class="text-secondary">Status:</span> ${response.status}</li>
        <li><span class="text-secondary">Runtime:</span> ${
          response.runtime
        } mins</li>
        <li><span class="text-secondary">Budget:</span> $${convert(
          response.budget
        )}</li>
        <li><span class="text-secondary">Revenue:</span> $${convert(
          response.revenue
        )}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="group-list">
        ${response.production_companies
          .map((company) => `<div>${company.name}</div>`)
          .join('')}
    </div>
</div>`;
  document.querySelector('.movie-info').appendChild(newEl);
}

// conversion of number with commas

function convert(number) {
  return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, ',');
}

// backdrop function

function backdropImage(page, background) {
  const newEl = document.createElement('div');
  const linear = `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)`;
  newEl.style.backgroundImage = `${linear}, url('https://image.tmdb.org/t/p/original${background}')`;
  newEl.style.position = 'absolute';
  newEl.style.zIndex = '-1';
  newEl.style.backgroundSize = 'cover';
  newEl.style.backgroundPosition = 'center';
  newEl.style.width = '100vw';
  newEl.style.height = '100vh';
  newEl.style.top = '0';
  newEl.style.left = '0';
  newEl.style.opacity = '0.3';

  if (page === 'movie') {
    document.querySelector('.movie-info').appendChild(newEl);
  } else {
    document.querySelector('.tv-info').appendChild(newEl);
  }
}

// getting shows

const getShow = async () => {
  const { results } = await retreiveData('/tv/popular');
  for (let show of results) {
    const newEL = document.createElement('div');
    newEL.className = 'block';
    newEL.innerHTML = `
        <a href="tv-info.html?id=${show.id}">
          ${
            show.poster_path
              ? `<img src="https://image.tmdb.org/t/p/w500${show.poster_path}" class="block-img" alt="${show.name}"></img>`
              : `<img src="/images/no-image.png" class="block-img" alt="${show.name}"></img>`
          }
        </a>
        <div class="block-body">
          <h5 class="block-title">${show.name}</h5>
          <p class="block-text">
            <small class="text-muted">Aired on: ${show.first_air_date}</small>
          </p>
          <div class="rating"><i class="fas fa-star"> ${
            show.vote_average
          }</i></div>
        </div>`;
    document.querySelector('#popular-shows').appendChild(newEL);
  }
};

// getting show details

async function getShowInfo() {
  const showQuery = window.location.search.split('=');
  const showId = showQuery[1];
  const response = await retreiveData(`/tv/${showId}`);

  backdropImage('show', response.backdrop_path);

  const newEl = document.createElement('div');
  newEl.className = 'show-info';
  newEl.innerHTML = `
  <div class="details-head">
    <div>
        <p>
            <i class="fa-solid fa-star text-secondary"></i> ${response.vote_average.toFixed(
              1
            )}
        </p>
        <p class="text-muted">First Airing Date: ${response.first_air_date}</p>
        <p class="text-muted"> Language: ${response.original_language}</p>
        <p>${response.overview}</p>
    </div>
  <div>
  ${
    response.poster_path
      ? `<img src="https://image.tmdb.org/t/p/w500${response.poster_path}" class="block-img" alt="${response.original_name}"></img>`
      : `<img src="/images/no-image.png" class="block-img" alt="${response.original_name}"></img>`
  }
  </div>
    </div>
        <div class="genres">
        <h3>Genres</h3>
        <ul class="group-list">
            ${response.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
        </ul>
    </div>
</div>
<div class="details-foot">
  <h2>Show Info</h2>
  <ul>
      <li><span class="text-secondary">Number Of Episodes:</span> ${
        response.number_of_episodes
      }</li>
      <li>
          <span class="text-secondary">Last Episode To Aired:</span> ${
            response.last_air_date
          }
      </li>
      <li><span class="text-secondary">Status:</span> ${response.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">${response.production_companies
    .map((company) => `<div>${company.name}</div>`)
    .join('')}</div>
</div>`;

  document.querySelector('.tv-info').appendChild(newEl);
}

// swipper component
const slider = async () => {
  const { results } = await retreiveData('/movie/now_playing');
  console.log(results);
  results.forEach((res) => {
    const newEl = document.createElement('div');
    newEl.className = 'swiper-slide';
    newEl.innerHTML = `
      <a href="movie-info.html?id=${res.id}">
        <img src="https://image.tmdb.org/t/p/w500${res.poster_path}" alt="title">
        <div class="content">
          <h3 class="movie-title">${res.title}</h3>
          <h4 class="slider-rating"><i class="fa-solid fa-star text-secondary"></i> ${res.vote_average}
        </div>
      </a>`;
    document.querySelector('.swiper-wrapper').append(newEl);

    initSwipper();
  });
};

// swipper initialization

function initSwipper() {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    freeMode: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: true,
    },
    breakpoints: {
      500: {
        slidesPerView: 3,
      },
      700: {
        slidesPerView: 4,
      },
      1300: {
        slidesPerView: 6,
      },
    },
    loop: true,
  });
}

// search function

async function search() {
  const searchString = window.location.search;
  const urlParams = new URLSearchParams(searchString);
  state.search.query = urlParams.get('search-query');

  if (state.search.query !== '' && state.search.query !== null) {
    const data = await searchRetrieve();
    console.log(data);
  } else {
    alertDisplay("you haven't entered anything");
  }
}

//Display alert
function alertDisplay(message, classname) {
  const newEl = document.createElement('div');
  newEl.classList.add('alert', classname);
  newEl.appendChild(document.createTextNode(message));
  document.querySelector('.alert').appendChild(newEl);
  setTimeout(() => {
    newEl.remove();
  }, 3000);
}

//Fetching data for search page

async function searchRetrieve() {
  //get your own api key as it's intended for my mini project
  const API_KEY = '8b73e0463dd42bbebaacb214b869ec89';
  const API_URL = 'https://api.themoviedb.org/3/';
  const repsonse = await fetch(
    `${API_URL}search/multi?api_key=${API_KEY}&language=en-US&query=${state.search.query}`
  );

  return repsonse.json();
}

// fetching data

const retreiveData = async (endpoint) => {
  const API_KEY = '8b73e0463dd42bbebaacb214b869ec89';
  const API_URL = 'https://api.themoviedb.org/3';
  spinner();
  const res = await fetch(
    `${API_URL}/${endpoint}?api_key=${API_KEY}&language=en-US`
  );
  const data = await res.json();
  spinnerHide();
  return data;
};

// loading screen

function spinner() {
  document.querySelector('.spinner').classList.add('show');
}

function spinnerHide() {
  document.querySelector('.spinner').classList.remove('show');
}

// Initailizing app

function init() {
  switch (state.currentPage) {
    case '/':
    case '/index.html':
      console.log('home');
      slider();
      getPopularMovie();
      break;
    case '/shows.html':
      getShow();
      break;
    case '/movie-info.html':
      getMovieInfo();
      break;
    case '/tv-info.html':
      getShowInfo();
      break;
    case '/animes.html':
      console.log('animes');
      break;
    case '/anime-info.html':
      console.log('animes shows');
      break;
    case '/search.html':
      search();
      console.log('search page');
      break;
    default:
      console.log('page not found');
  }
  activeLink();
}

document.addEventListener('DOMContentLoaded', init);
