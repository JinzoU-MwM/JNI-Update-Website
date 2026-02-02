/**
 * Services Loader Module
 * Dynamically loads services from API to Homepage
 */

document.addEventListener('DOMContentLoaded', function () {
    const servicesGrid = document.querySelector('.services-grid');
    if (!servicesGrid) return;

    // Fetch Services
    fetch('api/get_services.php')
        .then(response => response.json())
        .then(result => {
            if (result.success && result.data.length > 0) {
                renderServices(result.data);
            } else {
                console.log('No services found.');
            }
        })
        .catch(error => console.error('Error fetching services:', error));

    function renderServices(services) {
        servicesGrid.innerHTML = services.map(service => `
            <a href="service-detail.php?slug=${service.slug}" class="service-card reveal">
                <div class="service-icon">
                    ${service.icon_svg || '<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>'}
                </div>
                <h3>${escapeHtml(service.title)}</h3>
                <p>${escapeHtml(service.short_description)}</p>
                <span class="service-link">Selengkapnya &rarr;</span>
            </a>
        `).join('');

        // Trigger Reveal Animation check manually after injection
        if (window.handleScrollReveal) window.handleScrollReveal(); // Assuming you have a global handler
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
});
