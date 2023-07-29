import SimpleLightbox from "simplelightbox"
import Notiflix from 'notiflix';
import { serviceSearch } from "./pixabay-api"
import "simplelightbox/dist/simple-lightbox.min.css"


const refs = {
 form: document.querySelector('.search-form'),
 images: document.querySelector('.gallery'),
  guard: document.querySelector('.js-guard'),
}

let page = 1;
let gallery = new SimpleLightbox('.gallery a');
let searchQueryValue = '';

refs.form.addEventListener("submit", handlerFormSubmit);

 async function handlerFormSubmit(event) {
     try {
        Notiflix.Loading.standard();
        event.preventDefault();
        const { elements: { searchQuery } } = event.currentTarget;
         searchQueryValue = searchQuery.value.trim();
         const { hits, totalHits } = await serviceSearch(searchQueryValue, page);
         Notiflix.Loading.remove();
        if(totalHits === 0) {
           return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again."); 
        }
        refs.images.innerHTML = createMarkup(hits);
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
        gallery.refresh();
         observer.observe(refs.guard);
         event.target.reset();      
    }  
     catch (error) {
         console.log(error)
     };
    
}

const options = {
    root: null,
    rootMargin: "300px",
    threshold: 0,
};

const observer = new IntersectionObserver(handlerPagination, options);

async function handlerPagination(entries, observer) {
    try {
        entries.forEach(async entry => {
            if (entry.isIntersecting) {
                 Notiflix.Loading.standard();
                page += 1;
                const { hits, totalHits } = await serviceSearch(searchQueryValue, page);
                 Notiflix.Loading.remove();
                refs.images.insertAdjacentHTML('beforeend', createMarkup(hits));
                gallery.refresh();
                if (page >= totalHits/40) {
                    observer.unobserve(entry.target);
                    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
                }
            }
        })
    } catch (error) {
            console.log(error)
        };
    }

   function createMarkup(arr) {
    return arr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
    <div class="photo-card">
    <a class="gallery__link" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width="300" height="200"/>
   </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div>`).join('');
}




