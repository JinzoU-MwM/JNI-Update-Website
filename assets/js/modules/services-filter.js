/**
 * Services Filter Module
 * Simplified and robust filtering logic.
 */

document.addEventListener('DOMContentLoaded', function () {
    // Select elements
    const tabButtons = document.querySelectorAll('.tab-btn');
    const serviceCards = document.querySelectorAll('.services-page .service-card');

    if (tabButtons.length === 0 || serviceCards.length === 0) return;

    // Filter Function
    const filterServices = (category) => {
        serviceCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');

            // Check if card matches category
            // Note: If we had an 'all' button, we would check for that too.
            // Currently assuming buttons only have specific categories.
            const shouldShow = (category === 'all') || (cardCategory === category);

            if (shouldShow) {
                // SHOW CARD
                if (card.classList.contains('hidden-card')) {
                    card.classList.remove('hidden-card');

                    // Reset inline styles to allow CSS to take over or animation script to run
                    card.style.display = '';
                    card.style.opacity = '';
                    card.style.transform = '';

                    // Optional: slight fade in if not handled by scroll script
                    card.style.animation = 'fadeIn 0.5s ease forwards';
                }
            } else {
                // HIDE CARD
                card.classList.add('hidden-card');

                // Clear inline styles to ensure it stays hidden and doesn't conflict
                card.style.display = 'none'; // Force it just in case class is delayed (redundant but safe)
                card.style.opacity = '';
                card.style.transform = '';
                card.style.animation = '';
            }
        });
    };

    // Event Listeners
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            // Remove active class from all
            tabButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked
            this.classList.add('active');

            const category = this.getAttribute('data-category');
            filterServices(category);
        });
    });

    // Initial Filter based on active tab
    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab) {
        filterServices(activeTab.getAttribute('data-category'));
    }
});
