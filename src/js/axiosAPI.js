import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '31396725-3e8f0bf1315c05b54d621a44f';
PER_PAGE = 40;

export async function getImages(name, page) {
  try {
    const images = await axios.get(
      `${BASE_URL}?key=${KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${PER_PAGE}&page=${page}`
    );

    return images;
  } catch (error) {
    console.log(error);
  }
}
