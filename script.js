const accessKey = 'DEuCeb_jos9DtP_1zSIOuL0xJA_-wdhzes4Q2xzLyVI';
const searchForm = document.querySelector('form');
const searchInput = document.querySelector('.search-input');
const imagesContainer = document.querySelector('.images-container');
const loadMoreBtn = document.querySelector('.loadMoreBtn');
const sortSelect = document.getElementById('sort-select');
const colorSelect = document.getElementById('color-select');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxDetails = document.getElementById('lightbox-details');

let page = 1;
let currentQuery = '';

const fetchImages = async (query, pageNo) => {
    if (pageNo === 1) {
        imagesContainer.innerHTML = '';
    }
    const sortBy = sortSelect.value;
    const color = colorSelect.value;
    const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=28&page=${pageNo}&order_by=${sortBy}&color=${color}&client_id=${accessKey}`;

    console.log('Fetching URL:', url); // Log the URL being fetched

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorText = await response.text();
            console.log('Error response:', errorText); // Log the error response
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        const data = await response.json();

        console.log('API Response:', data);

        if (data.results.length === 0) {
            imagesContainer.innerHTML = '<h2>No images found. Try a different search term.</h2>';
            loadMoreBtn.style.display = "none";
            return;
        }

        data.results.forEach(photo => {
            const imageElement = document.createElement('div');
            imageElement.classList.add('imageDiv');
            imageElement.innerHTML = `
                <img src="${photo.urls.small}" alt="${photo.alt_description || 'Image'}" loading="lazy"/>
                <div class="overlay">
                    <h3>${photo.alt_description || 'No description available'}</h3>
                </div>
            `;
            
            imageElement.addEventListener('click', () => openLightbox(photo));
            imagesContainer.appendChild(imageElement);
        });

        if (data.total_pages === pageNo) {
            loadMoreBtn.style.display = "none";
        } else {
            loadMoreBtn.style.display = "block";
        }
    } catch (error) {
        console.error('Error fetching images:', error);
        imagesContainer.innerHTML = `<h2>An error occurred while fetching images: ${error.message}</h2>`;
    }
}

const openLightbox = (photo) => {
    lightboxImg.src = photo.urls.regular;
    lightboxDetails.innerHTML = `
        <h3>${photo.alt_description || 'No description available'}</h3>
        <p>Photo by <a href="${photo.user.links.html}" target="_blank">${photo.user.name}</a></p>
        <p>Likes: ${photo.likes}</p>
        <a href="${photo.links.download}" target="_blank" class="download-btn">Download</a>
    `;
    lightbox.style.display = 'flex';
}

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    currentQuery = searchInput.value.trim();
    if (currentQuery !== '') {
        page = 1;
        fetchImages(currentQuery, page);
    } else {
        imagesContainer.innerHTML = '<h2>Please enter a search query.</h2>';
    }
});

loadMoreBtn.addEventListener('click', () => {
    fetchImages(currentQuery, ++page);
});

sortSelect.addEventListener('change', () => {
    if (currentQuery) {
        page = 1;
        fetchImages(currentQuery, page);
    }
});

colorSelect.addEventListener('change', () => {
    if (currentQuery) {
        page = 1;
        fetchImages(currentQuery, page);
    }
});

lightbox.querySelector('.close-btn').addEventListener('click', () => {
    lightbox.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.style.display = 'none';
    }
});




// Test API request
fetch(`https://api.unsplash.com/search/photos?query=nature&per_page=1&client_id=${accessKey}`)
  .then(response => {
    if (!response.ok) {
      return response.text().then(text => { throw new Error(`HTTP error! status: ${response.status}, message: ${text}`) });
    }
    return response.json();
  })
  .then(data => console.log('Test API Response:', data))
  .catch(error => console.error('Test API Error:', error));