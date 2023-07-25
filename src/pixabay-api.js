import axios from "axios";

export { serviceSearch };
    
axios.defaults.baseURL = "https://pixabay.com";
const API_KEY = '38388724-3028317b25cafc6eb54d82d41';

async function serviceSearch(searchQueryValue, page) {
    const params = new URLSearchParams({
        key: API_KEY,
        q: searchQueryValue,
        image_type: 'photo',
        orientation: 'orizontal',
        safesearch: 'true',
        per_page: '40',
        page: page,
    });
    const { data } = await axios.get(`/api/?${params}`);
   return data;
}

