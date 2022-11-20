import { lightbox } from './js/lightbox';
import { getImages } from './js/axiosAPI';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
let seachImages = '';
let page = 1;
let countImages = 0;

const formRef = document.querySelector('.search-form');
const inputRef = document.querySelector('input');
const galleryRef = document.querySelector('.gallery');
// const buttonRef = document.querySelector('.load-more');

formRef.addEventListener('submit', onFormSubmit);
// buttonRef.addEventListener('click', onLoadMore);

window.addEventListener('scroll', () => {
  const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
  // console.log(scrollHeight);
  // console.log(clientHeight);
  // console.log(scrollTop);
  if (scrollHeight - clientHeight === scrollTop) {
    onLoadMore();
  }
});

// buttonRef.classList.add('is-hidden');

function onFormSubmit(e) {
  e.preventDefault();
  clearGallery();
  seachImages = inputRef.value;
  page = 1;

  getImages(seachImages, page)
    .then(data => {
      const { totalHits, hits } = data.data;
      countImages = hits.length;
      if (totalHits === 0) {
        return Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else Notify.success(`Hooray! We found ${totalHits} images.`);
      imagesMarkup(createGalery(data));
      lightbox.refresh();
      // buttonRef.classList.remove('is-hidden');
      smoothScroll();
    })
    .catch(error => console.log(error));
}

function onLoadMore() {
  // buttonRef.classList.add('is-hidden');
  page += 1;
  getImages(seachImages, page)
    .then(data => {
      if (countImages >= data.data.totalHits) {
        return Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
      imagesMarkup(createGalery(data));
      lightbox.refresh();
      countImages += data.data.hits.length;
      // buttonRef.classList.remove('is-hidden');
      // page += 1;
      smoothScroll();
    })
    .catch(error => console.log(error));
}

function clearGallery() {
  galleryRef.innerHTML = '';
}

function createGalery(data) {
  return data.data.hits
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
  return galleryRef.insertAdjacentHTML('beforeend', string);
}

function smoothScroll() {
  const { height: cardHeight } =
    galleryRef.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
