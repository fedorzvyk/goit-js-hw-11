import { lightbox } from './js/lightbox';
import { getImages } from './js/axiosAPI';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { debounce } from 'debounce';
let seachImages = '';
let page = 1;
let countImages = 0;

const formRef = document.querySelector('.search-form');
const inputRef = document.querySelector('input');
const galleryRef = document.querySelector('.gallery');
// const buttonRef = document.querySelector('.load-more');

formRef.addEventListener('submit', onFormSubmit);
window.addEventListener('scroll', debounce(onScroll, 300));
// buttonRef.addEventListener('click', onLoadMore);

function onScroll() {
  // const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
  // console.log(scrollTop);
  // if (
  //   1 >= scrollHeight - clientHeight - scrollTop &&
  //   scrollHeight - clientHeight - scrollTop >= -1
  // ) {
  if (
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight
  ) {
    onLoadMore();
  }
}

// buttonRef.classList.add('is-hidden');

function onFormSubmit(e) {
  e.preventDefault();
  clearGallery();
  Loading.circle();
  seachImages = inputRef.value;
  page = 1;

  getImages(seachImages, page)
    .then(data => {
      const { totalHits, hits } = data;
      countImages = hits.length;
      if (totalHits === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else Notify.success(`Hooray! We found ${totalHits} images.`);
      imagesMarkup(createGalery(data));
      // buttonRef.classList.remove('is-hidden');
      smoothScroll();
      // page += 1;
    })
    .catch(error => console.log(error));
  Loading.remove();
}

async function onLoadMore() {
  Loading.circle();
  // buttonRef.classList.add('is-hidden');
  page += 1;
  if (page < 14) {
    const data = await getImages(seachImages, page);
    const { hits, totalHits } = data;
    if (countImages >= totalHits) {
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
    if (countImages < totalHits) {
      imagesMarkup(createGalery(data));
      // buttonRef.classList.remove('is-hidden');
      smoothScroll();
    }
    countImages += hits.length;
  } else {
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
  Loading.remove();
}

function clearGallery() {
  galleryRef.innerHTML = '';
}

function createGalery(data) {
  return data.hits
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
      <a class="gallery__item" href="${largeImageURL}">
      <div class="card__container">
        <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy"/>
          <div class="info">
            <p class="info-item">
            <b>Likes<br>${likes}</b>
          </p>
          <p class="info-item">
            <b>Views<br>${views}</b>
          </p>
          <p class="info-item">
            <b>Comments<br>${comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads<br> ${downloads}</b>
          </p>
          </div>
        </div>
      </a>
    `;
      }
    )
    .join('');
}

function imagesMarkup(string) {
  galleryRef.insertAdjacentHTML('beforeend', string);
  lightbox.refresh();
}

function smoothScroll() {
  const { height: cardHeight } =
    galleryRef.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
