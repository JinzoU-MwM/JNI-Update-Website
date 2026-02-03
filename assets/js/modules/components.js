/* =====================================================
   Component Loader Module
   Loads navbar and footer components into pages
   ===================================================== */

const ComponentLoader = {
    /**
     * Load an HTML component into a target element
     * @param {string} componentPath - Path to the HTML file
     * @param {string} targetId - ID of the element to inject into
     * @param {Function} callback - Optional callback after loading
     */
    async load(componentPath, targetId, callback) {
        try {
            // Add cache busting timestamp
            const timestamp = new Date().getTime();
            const response = await fetch(`${componentPath}?v=${timestamp}`);
            if (!response.ok) throw new Error(`Failed to load ${componentPath}`);

            const html = await response.text();
            const target = document.getElementById(targetId);

            if (target) {
                target.innerHTML = html;
                if (callback) callback();
            }
        } catch (error) {
            console.warn(`Component load warning: ${error.message}`);
        }
    },

    /**
     * Initialize components and set active page
     */
    init() {
        const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
        const isInnerPage = currentPage !== 'index';

        // Load Navbar
        this.load('assets/components/navbar.html', 'navbar-container', () => {
            const navbar = document.getElementById('navbar');

            // Add nav-inner class for inner pages
            if (isInnerPage && navbar) {
                navbar.classList.add('nav-inner');
            }

            // Set active link
            const links = document.querySelectorAll('.navbar-menu a');
            links.forEach(link => {
                const page = link.getAttribute('data-page');
                if (page === currentPage) {
                    link.classList.add('active');
                }
            });

            // Initialize navbar functionality
            this.initNavbarBehavior();
        });

        // Load Footer
        this.load('assets/components/footer.html', 'footer-container');
    },

    /**
     * Initialize navbar scroll and toggle behavior
     */
    initNavbarBehavior() {
        const navbar = document.getElementById('navbar');
        const navbarToggle = document.querySelector('.navbar-toggle');
        const navbarCenter = document.querySelector('.navbar-center');

        if (!navbar) return;

        // Mobile toggle
        // Mobile toggle
        if (navbarToggle && navbarCenter) {
            const toggleMenu = () => {
                navbarCenter.classList.toggle('active');
                navbarToggle.classList.toggle('active');
                document.body.classList.toggle('menu-open'); // Prevent scroll
            };

            navbarToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleMenu();
            });

            // Close when clicking a link
            const links = navbarCenter.querySelectorAll('a');
            links.forEach(link => {
                link.addEventListener('click', () => {
                    if (navbarCenter.classList.contains('active')) {
                        toggleMenu();
                    }
                });
            });

            // Close when clicking outside
            document.addEventListener('click', (e) => {
                if (navbarCenter.classList.contains('active') &&
                    !navbarCenter.contains(e.target) &&
                    !navbarToggle.contains(e.target)) {
                    toggleMenu();
                }
            });
        }

        // Scroll effect
        const handleScroll = () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
    }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    ComponentLoader.init();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ComponentLoader;
}
