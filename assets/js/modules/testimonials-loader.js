/**
 * Testimonials Loader Module (Fixed for Infinite Marquee)
 * Dynamically loads testimonials and creates the infinite seamless loop.
 */

document.addEventListener('DOMContentLoaded', function () {
    const track1 = document.getElementById('marquee-track-1');
    const track2 = document.getElementById('marquee-track-2');

    if (!track1 || !track2) {
        console.warn('Testimonial marquee tracks not found in DOM.');
        return;
    }

    /* Helper: Create Stars */
    function renderStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += (i <= rating) ? '<span class="star">★</span>' : '<span class="star empty">☆</span>';
        }
        return stars;
    }

    /* Helper: Create Card HTML */
    function createTestimonialCard(testimonial) {
        const avatarUrl = testimonial.photo_url ||
            'https://ui-avatars.com/api/?name=' + encodeURIComponent(testimonial.client_name) + '&background=387C44&color=fff';

        return `
            <div class="testimonial-card">
                <div class="testimonial-rating">${renderStars(testimonial.rating)}</div>
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

    function escapeHtml(text) {
        if (!text) return '';
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /* Load Data */
    async function loadTestimonials() {
        try {
            // Fetch more items to ensure we have enough length for a smooth scroll
            const response = await fetch('api/get_testimonials.php?limit=12');

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const result = await response.json();
            let testimonials = [];

            if (result.success && result.data.length > 0) {
                testimonials = result.data;
            } else {
                console.warn('API returned empty testimonials.');
                return; // Nothing to show
            }

            // Generate HTML for one set
            const singleSetHTML = testimonials.map(createTestimonialCard).join('');

            // CRITICAL: DUPLICATE CONTENT FOR INFINITE LOOP
            // We duplicate it 2 times (Total 2 sets) to ensure seamless 50% translation.
            const fullMarqueeContent = singleSetHTML + singleSetHTML;

            // Inject into DOM
            track1.innerHTML = fullMarqueeContent;

            // For bottom row
            track2.innerHTML = fullMarqueeContent;

            // Debug
            console.log(`Testimonials loaded: ${testimonials.length} items (duplicated for marquee)`);

        } catch (error) {
            console.error('Testimonials loading failed:', error);
            // On error we do nothing - section remains empty as requested (no hardcoded data)
        }
    }

    loadTestimonials();
});
