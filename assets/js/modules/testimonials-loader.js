/**
 * Testimonials Loader Module
 * Dynamically loads testimonials from the API
 */

document.addEventListener('DOMContentLoaded', function () {
    const testimonialsGrid = document.getElementById('testimonials-grid');

    if (!testimonialsGrid) return;

    /**
     * Convert numeric rating to star icons
     * @param {number} rating - Rating from 1 to 5
     * @returns {string} HTML string of star icons
     */
    function renderStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<span class="star">★</span>';
            } else {
                stars += '<span class="star empty">☆</span>';
            }
        }
        return stars;
    }

    /**
     * Create testimonial card HTML
     * @param {object} testimonial - Testimonial data object
     * @returns {string} HTML string for testimonial card
     */
    function createTestimonialCard(testimonial) {
        // Default avatar if none provided
        const avatarUrl = testimonial.photo_url ||
            'https://ui-avatars.com/api/?name=' + encodeURIComponent(testimonial.client_name) + '&background=4CAF50&color=fff&size=120';

        return `
            <div class="testimonial-card">
                <div class="testimonial-rating">
                    ${renderStars(testimonial.rating)}
                </div>
                <p class="testimonial-text">"${escapeHtml(testimonial.review_text)}"</p>
                <div class="testimonial-profile">
                    <img src="${avatarUrl}" alt="${escapeHtml(testimonial.client_name)}" class="testimonial-avatar" loading="lazy">
                    <div class="testimonial-info">
                        <h4>${escapeHtml(testimonial.client_name)}</h4>
                        <p>${escapeHtml(testimonial.client_role)}</p>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Load testimonials from API
     */
    async function loadTestimonials() {
        try {
            // Show loading state
            testimonialsGrid.innerHTML = '<p style="text-align: center; color: #64748b;">Memuat testimoni...</p>';

            const response = await fetch('api/get_testimonials.php?limit=6');
            const result = await response.json();

            if (result.success && result.data.length > 0) {
                // Render testimonial cards
                testimonialsGrid.innerHTML = result.data.map(createTestimonialCard).join('');
            } else {
                // No testimonials found - show placeholder or hide section
                testimonialsGrid.innerHTML = `
                    <p style="text-align: center; color: #64748b; grid-column: 1 / -1;">
                        Belum ada testimoni.
                    </p>
                `;
            }
        } catch (error) {
            console.error('Error loading testimonials:', error);
            // Keep static content or show error
            testimonialsGrid.innerHTML = `
                <p style="text-align: center; color: #64748b; grid-column: 1 / -1;">
                    Gagal memuat testimoni. Silakan refresh halaman.
                </p>
            `;
        }
    }

    // Load testimonials on page load
    loadTestimonials();
});
