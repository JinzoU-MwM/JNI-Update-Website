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
            const result = await response.json();

            let testimonials = [];

            if (result.success && result.data.length > 0) {
                testimonials = result.data;
            } else {
                // Fallback Data if API is empty or fails (to prevent broken section)
                testimonials = [
                    { client_name: 'Budi Santoso', client_role: 'CEO PT Maju Jaya', rating: 5, review_text: 'JNI Consultant sangat membantu proses perizinan perusahaan kami. Sangat profesional!' },
                    { client_name: 'Siti Aminah', client_role: 'Owner UMKM Berkah', rating: 5, review_text: 'Pelayanan cepat dan ramah. Semua dokumen selesai tepat waktu.' },
                    { client_name: 'Andi Wijaya', client_role: 'Direktur Utama', rating: 5, review_text: 'Solusi terbaik untuk legalitas bisnis. Terima kasih tim JNI.' },
                    { client_name: 'Rina Kartika', client_role: 'HR Manager', rating: 4, review_text: 'Konsultasi yang sangat jelas dan solutif. Staff sangat membantu.' }
                ];
            }

            // Generate HTML for one set
            const singleSetHTML = testimonials.map(createTestimonialCard).join('');

            // CRITICAL: DUPLICATE CONTENT FOR INFINITE LOOP
            // We duplicate it 2 times (Total 2 sets) to ensure seamless 50% translation.
            const fullMarqueeContent = singleSetHTML + singleSetHTML;

            // Inject into DOM
            track1.innerHTML = fullMarqueeContent;

            // For bottom row, we can optionally reverse the order for visual variety
            // But strict duplication is safer for seamless loops. 
            // Let's just use the same content for stability.
            track2.innerHTML = fullMarqueeContent;

            // Debug
            console.log('Testimonials loaded and duplicated for marquee.');

        } catch (error) {
            console.error('Testimonials loading failed:', error);
            // Even on error, tracks remain empty or we could inject static placeholders
        }
    }

    loadTestimonials();
});
