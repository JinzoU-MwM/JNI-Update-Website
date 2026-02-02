/* =====================================================
   Animations Module (Scroll Reveal, Counters)
   ===================================================== */

const AnimationsModule = {
    init() {
        this.initScrollReveal();
        this.initCounters();
        this.initBackToTop();
    },

    // Scroll Reveal Animation
    initScrollReveal() {
        const reveals = document.querySelectorAll('.reveal');
        if (reveals.length === 0) return;

        const revealOnScroll = () => {
            reveals.forEach(el => {
                const windowHeight = window.innerHeight;
                const revealTop = el.getBoundingClientRect().top;
                const revealPoint = 150;

                if (revealTop < windowHeight - revealPoint) {
                    el.classList.add('active');
                }
            });
        };

        window.addEventListener('scroll', revealOnScroll);
        revealOnScroll(); // Initial check
    },

    // Counter Animation
    initCounters() {
        const counters = document.querySelectorAll('[data-count]');
        if (counters.length === 0) return;

        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    },

    // Back to Top Button
    initBackToTop() {
        const backToTop = document.querySelector('.back-to-top');
        if (!backToTop) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    AnimationsModule.init();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationsModule;
}
