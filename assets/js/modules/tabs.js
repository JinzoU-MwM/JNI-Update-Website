/* =====================================================
   Services Tab Filtering Module
   ===================================================== */

const TabsModule = {
    init() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const serviceCards = document.querySelectorAll('.services-page .service-card');

        if (tabButtons.length === 0 || serviceCards.length === 0) return;

        // Filter function
        const filterServices = (category) => {
            serviceCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (category === 'all' || cardCategory === category) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        };

        // Tab click handler
        tabButtons.forEach(btn => {
            btn.addEventListener('click', function () {
                tabButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const category = this.getAttribute('data-category');
                filterServices(category);
            });
        });

        // Initial filter - show "legal" category by default
        filterServices('legal');
    }
};

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    TabsModule.init();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TabsModule;
}
