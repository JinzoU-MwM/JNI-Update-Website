/* =====================================================
   Main JavaScript Entry Point
   Corporate Consultant Website
   ===================================================== */

/**
 * This file serves as the main entry point for JavaScript.
 * Individual modules are loaded via script tags in HTML.
 * 
 * Module Files:
 * - modules/components.js  → Navbar/Footer loader
 * - modules/tabs.js        → Services page tabs
 * - modules/animations.js  → Scroll reveal, counters
 * - modules/gallery.js     → Lightbox functionality
 * 
 * Usage:
 * Include this file and the required modules in your HTML:
 * <script src="assets/js/modules/components.js"></script>
 * <script src="assets/js/modules/animations.js"></script>
 * <script src="assets/js/main.js"></script>
 */

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 JNI Consultant Website Initialized');

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});

// Form validation (if forms exist)
const initFormValidation = () => {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });

            if (!isValid) {
                e.preventDefault();
                alert('Mohon lengkapi semua field yang diperlukan.');
            }
        });
    });
};

document.addEventListener('DOMContentLoaded', initFormValidation);
