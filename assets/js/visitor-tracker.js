/**
 * =====================================================
 * JNI Consultant - Visitor Tracking Script
 * =====================================================
 * 
 * Copy this code snippet and paste it in your main.js
 * or include it in your index.html / router setup.
 * 
 * This will track every page visit automatically.
 */

// =====================================================
// VISITOR TRACKER MODULE
// =====================================================
const VisitorTracker = {
    // API endpoint - adjust path based on your folder structure
    apiUrl: '/api/tracker.php',

    /**
     * Track current page visit
     * Call this whenever a new page loads
     */
    async track() {
        try {
            const data = {
                url: window.location.pathname + window.location.search,
                title: document.title,
                referrer: document.referrer || null
            };

            // Use sendBeacon if available (won't block navigation)
            if (navigator.sendBeacon) {
                const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
                navigator.sendBeacon(this.apiUrl, blob);
            } else {
                // Fallback to fetch
                await fetch(this.apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                    keepalive: true
                });
            }
        } catch (error) {
            // Silently fail - tracking should not break the site
            console.debug('Tracking failed:', error);
        }
    },

    /**
     * Initialize tracker
     * Automatically tracks on page load and popstate events
     */
    init() {
        // Track initial page load
        this.track();

        // Track navigation in SPA (for router.js)
        window.addEventListener('popstate', () => this.track());

        // Observe for dynamic title changes (optional)
        const titleObserver = new MutationObserver(() => {
            // Debounce rapid title changes
            clearTimeout(this._titleTimeout);
            this._titleTimeout = setTimeout(() => this.track(), 500);
        });

        // Start observing <title> changes
        const titleElement = document.querySelector('title');
        if (titleElement) {
            titleObserver.observe(titleElement, { childList: true });
        }
    }
};

// =====================================================
// INTEGRATION EXAMPLES
// =====================================================

/**
 * OPTION 1: For simple multi-page sites
 * Add this at the end of your main.js:
 *
 *   VisitorTracker.init();
 *
 */

/**
 * OPTION 2: For SPA with router.js
 * In your router's navigate function, add:
 *
 *   VisitorTracker.track();
 *
 * Example in router.js:
 *
 *   navigate(path) {
 *       history.pushState(null, '', path);
 *       this.loadPage(path);
 *       VisitorTracker.track(); // <-- Add this line
 *   }
 */

/**
 * OPTION 3: Single inline script for index.html
 * Just add this before </body>:
 *
 * <script>
 *   (function() {
 *     const url = '/api/tracker.php';
 *     const data = JSON.stringify({
 *       url: location.pathname + location.search,
 *       title: document.title,
 *       referrer: document.referrer
 *     });
 *     if (navigator.sendBeacon) {
 *       navigator.sendBeacon(url, new Blob([data], {type: 'application/json'}));
 *     } else {
 *       fetch(url, {method:'POST', body:data, headers:{'Content-Type':'application/json'}});
 *     }
 *   })();
 * </script>
 */

// =====================================================
// AUTO-INITIALIZE (uncomment if using Option 1)
// =====================================================
// document.addEventListener('DOMContentLoaded', () => VisitorTracker.init());
