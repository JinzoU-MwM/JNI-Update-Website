/* =====================================================
   Gallery Lightbox Module
   ===================================================== */

const GalleryModule = {
    init() {
        this.createLightbox();
        this.bindEvents();
    },

    createLightbox() {
        // Check if lightbox already exists
        if (document.getElementById('lightbox')) return;

        const lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
      <button class="lightbox-close" aria-label="Close">&times;</button>
      <img src="" alt="Gallery Image">
    `;
        document.body.appendChild(lightbox);
    },

    bindEvents() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        const lightbox = document.getElementById('lightbox');

        if (!lightbox || galleryItems.length === 0) return;

        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');

        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                if (img) {
                    lightboxImg.src = img.src;
                    lightboxImg.alt = img.alt;
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        };

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    GalleryModule.init();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = GalleryModule;
}
