/* =====================================================
   JNI Admin Dashboard - JavaScript (Enhanced)
   =====================================================
   Handles:
   - Session verification
   - Navigation & section switching
   - Article CRUD with SEO fields
   - Real-time SEO Scoring
   - Analytics with Chart.js
   - Activity log display
   - Sitemap generation
   - Toast notifications
*/

const AdminDashboard = {
    apiUrl: 'admin_api.php',
    authUrl: 'auth.php',
    analyticsUrl: '../api/analytics.php',
    sitemapUrl: '../api/generate_sitemap.php',
    deleteArticleId: null,
    deleteModal: null,
    viewsChart: null,
    deviceChart: null,

    // =====================================================
    // Initialization
    // =====================================================
    async init() {
        // Check if user is logged in
        const isLoggedIn = await this.checkSession();
        if (!isLoggedIn) {
            window.location.href = 'login.html';
            return;
        }

        // Initialize components
        this.deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
        this.setupNavigation();
        this.setupEventListeners();
        this.setupTinyMCE();
        this.setupSEOScoring();
        this.setCurrentDate();

        // Load initial data
        await this.loadDashboardData();

        // Hide loading overlay
        document.getElementById('loadingOverlay').style.display = 'none';
    },

    // =====================================================
    // Session Management
    // =====================================================
    async checkSession() {
        try {
            const response = await fetch(`${this.authUrl}?check=1`);
            const result = await response.json();

            if (result.success && result.logged_in) {
                document.getElementById('userName').textContent = result.user.username;
                document.getElementById('userAvatar').textContent = result.user.username.charAt(0).toUpperCase();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Session check failed:', error);
            return false;
        }
    },

    async logout() {
        try {
            await fetch(`${this.authUrl}?logout=1`);
            window.location.href = 'login.html';
        } catch (error) {
            window.location.href = 'login.html';
        }
    },

    // =====================================================
    // Navigation
    // =====================================================
    setupNavigation() {
        document.querySelectorAll('[data-section]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.showSection(section);
            });
        });

        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });
    },

    showSection(sectionName) {
        document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));

        const targetSection = document.getElementById(`section-${sectionName}`);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === sectionName) {
                link.classList.add('active');
            }
        });

        const titles = {
            'dashboard': 'Dashboard',
            'analytics': 'Analytics',
            'articles': 'Semua Artikel',
            'add-article': 'Tambah Artikel',
            'activity': 'Log Aktivitas'
        };
        document.getElementById('pageTitle').textContent = titles[sectionName] || 'Dashboard';

        // Load section-specific data
        if (sectionName === 'articles') {
            this.loadArticles();
        } else if (sectionName === 'activity') {
            this.loadActivityLog();
        } else if (sectionName === 'analytics') {
            this.loadAnalytics();
        } else if (sectionName === 'add-article') {
            if (!document.getElementById('articleId').value) {
                this.resetArticleForm();
            }
        }
    },

    // =====================================================
    // Event Listeners
    // =====================================================
    // =====================================================
    // TinyMCE Setup
    // =====================================================
    setupTinyMCE() {
        tinymce.init({
            selector: '#articleContent',
            plugins: 'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons',
            menubar: 'file edit view insert format tools table help',
            toolbar: 'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
            toolbar_sticky: true,
            autosave_ask_before_unload: true,
            autosave_interval: '30s',
            autosave_prefix: '{path}{query}-{id}-',
            autosave_restore_when_empty: false,
            autosave_retention: '2m',
            image_advtab: true,
            importcss_append: true,
            height: 600,
            image_caption: true,
            quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
            noneditable_noneditable_class: 'mceNonEditable',
            toolbar_mode: 'sliding',
            contextmenu: 'link image imagetools table',
            skin: 'oxide',
            content_css: 'default',
            content_style: 'body { font-family:Helvetica,Arial,namespace,sans-serif; font-size:14px }',

            // Image Upload Handler
            images_upload_handler: (blobInfo, progress) => new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.withCredentials = false;
                xhr.open('POST', 'upload_handler.php');

                xhr.upload.onprogress = (e) => {
                    progress(e.loaded / e.total * 100);
                };

                xhr.onload = () => {
                    if (xhr.status === 403) {
                        reject({ message: 'HTTP Error: ' + xhr.status, remove: true });
                        return;
                    }

                    if (xhr.status < 200 || xhr.status >= 300) {
                        reject('HTTP Error: ' + xhr.status);
                        return;
                    }

                    const json = JSON.parse(xhr.responseText);

                    if (!json || typeof json.location != 'string') {
                        reject('Invalid JSON: ' + xhr.responseText);
                        return;
                    }

                    resolve(json.location);
                };

                xhr.onerror = () => {
                    reject('Image upload failed due to a XHR Transport error. Code: ' + xhr.status);
                };

                const formData = new FormData();
                formData.append('file', blobInfo.blob(), blobInfo.filename());

                xhr.send(formData);
            })
        });
    },

    // =====================================================
    // Event Listeners
    // =====================================================
    setupEventListeners() {
        // Article form submission
        document.getElementById('articleForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveArticle();
        });

        // File Input Preview
        document.getElementById('featuredImageInput').addEventListener('change', (e) => {
            const file = e.target.files[0];
            const previewBox = document.getElementById('imagePreviewBox');

            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    previewBox.style.backgroundImage = `url('${e.target.result}')`;
                    previewBox.classList.add('has-image');
                    previewBox.innerHTML = ''; // Hide icon/text
                }
                reader.readAsDataURL(file);
            }
        });

        // Auto-generate slug from title
        document.getElementById('articleTitle').addEventListener('blur', () => {
            const slugInput = document.getElementById('articleSlug');
            if (!slugInput.value) {
                const title = document.getElementById('articleTitle').value;
                slugInput.value = this.generateSlug(title);
            }
        });

        // Refresh activity log
        document.getElementById('refreshLogs').addEventListener('click', () => {
            this.loadActivityLog();
        });

        // Delete confirmation
        document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
            this.confirmDelete();
        });

        // Cancel button resets form
        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.resetArticleForm();
        });

        // Generate Sitemap
        document.getElementById('generateSitemapBtn').addEventListener('click', () => {
            this.generateSitemap();
        });

        // Analytics controls
        document.getElementById('chartDays')?.addEventListener('change', () => {
            this.loadDailyViews();
        });

        document.getElementById('refreshTopPages')?.addEventListener('click', () => {
            this.loadTopPages();
        });

        // Character counters for SEO fields
        document.getElementById('metaTitle')?.addEventListener('input', (e) => {
            document.getElementById('metaTitleCount').textContent = `(${e.target.value.length}/70)`;
            this.calculateSEOScore();
        });

        document.getElementById('metaDescription')?.addEventListener('input', (e) => {
            document.getElementById('metaDescCount').textContent = `(${e.target.value.length}/160)`;
            this.calculateSEOScore();
        });
    },

    // ... (rest of code) ...

    async saveArticle() {
        const form = document.getElementById('articleForm');
        const submitBtn = document.getElementById('submitBtn');

        // Sync TinyMCE content to textarea
        tinymce.triggerSave();

        const formData = new FormData(form);

        const articleId = document.getElementById('articleId').value;
        formData.append('action', articleId ? 'update' : 'create');

        // Add SEO score
        const seoScore = this.calculateSEOScore();
        formData.append('seo_score', seoScore);

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Menyimpan...';

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                this.showToast('success', articleId ? 'Artikel berhasil diperbarui!' : 'Artikel berhasil ditambahkan!');
                this.resetArticleForm();
                this.showSection('articles');
            } else {
                this.showToast('danger', result.error || 'Gagal menyimpan artikel.');
            }
        } catch (error) {
            console.error(error);
            this.showToast('danger', 'Terjadi kesalahan. Coba lagi.');
        }

        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="bi bi-check-lg"></i> Simpan Artikel';
    },

    async editArticle(id) {
        try {
            const response = await fetch(`${this.apiUrl}?action=get_article&id=${id}`);
            const result = await response.json();

            if (result.success) {
                const article = result.data;

                document.getElementById('articleId').value = article.id;
                document.getElementById('articleTitle').value = article.title;
                document.getElementById('articleSlug').value = article.slug;
                document.getElementById('articleCategory').value = article.category;
                document.getElementById('articleImage').value = article.image_url;

                // Set Preview for existing image
                const previewBox = document.getElementById('imagePreviewBox');
                if (article.image_url) {
                    previewBox.style.backgroundImage = `url('${article.image_url}')`;
                    previewBox.classList.add('has-image');
                    previewBox.innerHTML = '';
                } else {
                    // Reset preview default
                    previewBox.style.backgroundImage = 'none';
                    previewBox.classList.remove('has-image');
                    previewBox.innerHTML = '<div class="text-center"><i class="bi bi-cloud-upload fs-2"></i><p class="mb-0 small">Klik untuk upload gambar</p><small class="text-muted">(JPG, PNG, WEBP - Max 5MB)</small></div>';
                }

                document.getElementById('articleExcerpt').value = article.excerpt || '';

                // Set TinyMCE content
                if (tinymce.get('articleContent')) {
                    tinymce.get('articleContent').setContent(article.content);
                } else {
                    document.getElementById('articleContent').value = article.content;
                }

                document.getElementById('articleReadTime').value = article.read_time || '5 menit baca';

                // SEO fields
                document.getElementById('focusKeyword').value = article.focus_keyword || '';
                document.getElementById('metaTitle').value = article.meta_title || '';
                document.getElementById('metaDescription').value = article.meta_description || '';

                // Update character counters
                document.getElementById('metaTitleCount').textContent = `(${(article.meta_title || '').length}/70)`;
                document.getElementById('metaDescCount').textContent = `(${(article.meta_description || '').length}/160)`;

                document.getElementById('formTitle').textContent = 'Edit Artikel';
                this.showSection('add-article');

                // Calculate SEO score for loaded article
                setTimeout(() => this.calculateSEOScore(), 500); // Slight delay for TinyMCE
            } else {
                this.showToast('danger', 'Artikel tidak ditemukan.');
            }
        } catch (error) {
            this.showToast('danger', 'Gagal memuat artikel.');
        }
    },

    resetArticleForm() {
        document.getElementById('articleForm').reset();
        document.getElementById('articleId').value = '';
        document.getElementById('formTitle').textContent = 'Tambah Artikel Baru';
        document.getElementById('metaTitleCount').textContent = '(0/70)';
        document.getElementById('metaDescCount').textContent = '(0/160)';
        document.getElementById('wordCount').textContent = '(0 kata)';

        // Reset TinyMCE
        if (tinymce.get('articleContent')) {
            tinymce.get('articleContent').setContent('');
        }

        // Reset Preview
        const previewBox = document.getElementById('imagePreviewBox');
        previewBox.style.backgroundImage = 'none';
        previewBox.classList.remove('has-image');
        previewBox.innerHTML = '<div class="text-center"><i class="bi bi-cloud-upload fs-2"></i><p class="mb-0 small">Klik untuk upload gambar</p><small class="text-muted">(JPG, PNG, WEBP - Max 5MB)</small></div>';

        // Reset SEO score
        this.updateSEOScoreUI(0, {
            keywordTitle: false,
            metaDesc: false,
            wordCount: false,
            keywordContent: false,
            metaTitle: false
        });
    },

    // =====================================================
    // SEO Scoring System
    // =====================================================
    setupSEOScoring() {
        const fields = ['articleTitle', 'focusKeyword', 'metaTitle', 'metaDescription', 'articleContent'];
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', () => this.calculateSEOScore());
            }
        });
    },

    calculateSEOScore() {
        const title = document.getElementById('articleTitle').value.toLowerCase();
        const keyword = document.getElementById('focusKeyword').value.toLowerCase().trim();
        const metaTitle = document.getElementById('metaTitle').value;
        const metaDesc = document.getElementById('metaDescription').value;

        let content = '';
        if (tinymce.get('articleContent')) {
            content = tinymce.get('articleContent').getContent().toLowerCase();
        } else {
            content = document.getElementById('articleContent').value.toLowerCase();
        }

        // Count words in content (strip HTML)
        const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        const wordCount = plainText ? plainText.split(' ').filter(w => w.length > 0).length : 0;
        document.getElementById('wordCount').textContent = `(${wordCount} kata)`;

        let score = 0;
        let checks = {
            keywordTitle: false,
            metaDesc: false,
            wordCount: false,
            keywordContent: false,
            metaTitle: false
        };

        // Check 1: Keyword in title (25 points)
        if (keyword && title.includes(keyword)) {
            score += 25;
            checks.keywordTitle = true;
        }

        // Check 2: Meta description length 120-160 (25 points)
        if (metaDesc.length >= 120 && metaDesc.length <= 160) {
            score += 25;
            checks.metaDesc = true;
        } else if (metaDesc.length >= 100 && metaDesc.length < 120) {
            score += 15; // Partial score
        }

        // Check 3: Content > 300 words (20 points)
        if (wordCount > 300) {
            score += 20;
            checks.wordCount = true;
        } else if (wordCount > 150) {
            score += 10; // Partial score
        }

        // Check 4: Keyword in content (15 points)
        if (keyword && content.includes(keyword)) {
            score += 15;
            checks.keywordContent = true;
        }

        // Check 5: Meta title filled (15 points)
        if (metaTitle.length >= 30) {
            score += 15;
            checks.metaTitle = true;
        } else if (metaTitle.length >= 15) {
            score += 8;
        }

        // Update UI
        this.updateSEOScoreUI(score, checks);

        return score;
    },

    updateSEOScoreUI(score, checks) {
        const scoreCircle = document.getElementById('seoScoreCircle');
        const scoreLabel = document.getElementById('seoScoreLabel');
        const scoreCard = document.getElementById('seoScoreCard');

        scoreCircle.textContent = score;

        // Update score label and color
        if (score >= 80) {
            scoreLabel.textContent = 'Excellent! SEO sangat baik';
            scoreCard.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        } else if (score >= 60) {
            scoreLabel.textContent = 'Good! Masih bisa ditingkatkan';
            scoreCard.style.background = 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
        } else if (score >= 40) {
            scoreLabel.textContent = 'Fair. Perlu perbaikan';
            scoreCard.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
        } else {
            scoreLabel.textContent = 'Perlu banyak perbaikan';
            scoreCard.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
        }

        // Update checklist icons
        this.updateCheckIcon('checkKeywordTitle', checks.keywordTitle);
        this.updateCheckIcon('checkMetaDesc', checks.metaDesc);
        this.updateCheckIcon('checkWordCount', checks.wordCount);
        this.updateCheckIcon('checkKeywordContent', checks.keywordContent);
        this.updateCheckIcon('checkMetaTitle', checks.metaTitle);
    },

    updateCheckIcon(elementId, passed) {
        const icon = document.getElementById(elementId);
        if (passed) {
            icon.className = 'bi bi-check-circle pass';
        } else {
            icon.className = 'bi bi-x-circle fail';
        }
    },

    // =====================================================
    // Dashboard Data
    // =====================================================
    async loadDashboardData() {
        try {
            // Load article stats
            const response = await fetch(`${this.apiUrl}?action=dashboard`);
            const result = await response.json();

            if (result.success) {
                document.getElementById('statArticles').textContent = result.data.total_articles || 0;
                document.getElementById('statActivities').textContent = result.data.today_activities || 0;
                this.renderRecentActivity(result.data.recent_activity || []);
            }

            // Load analytics overview
            await this.loadAnalyticsOverview();

        } catch (error) {
            console.error('Failed to load dashboard:', error);
        }
    },

    async loadAnalyticsOverview() {
        try {
            const response = await fetch(`${this.analyticsUrl}?action=overview`);
            const result = await response.json();

            if (result.success) {
                document.getElementById('statTodayViews').textContent = result.data.today_views || 0;
                document.getElementById('statWeekViews').textContent = result.data.week_views || 0;

                // Calculate mobile percentage
                const devices = result.data.devices || {};
                const total = Object.values(devices).reduce((a, b) => a + b, 0);
                const mobileCount = (devices.mobile || 0) + (devices.tablet || 0);
                const mobilePercent = total > 0 ? Math.round((mobileCount / total) * 100) : 0;
                document.getElementById('statMobile').textContent = mobilePercent + '%';
            }
        } catch (error) {
            console.error('Failed to load analytics overview:', error);
        }
    },

    renderRecentActivity(activities) {
        const container = document.getElementById('recentActivity');

        if (activities.length === 0) {
            container.innerHTML = '<p class="text-muted">Tidak ada aktivitas terbaru.</p>';
            return;
        }

        const html = activities.slice(0, 5).map(activity => {
            const iconClass = this.getActivityIconClass(activity.action);
            return `
                <div class="activity-item">
                    <div class="activity-icon ${iconClass}">
                        <i class="bi ${this.getActivityIcon(activity.action)}"></i>
                    </div>
                    <div class="activity-content">
                        <h5>${this.formatActivityAction(activity)}</h5>
                        <p>${activity.username} • ${this.formatDate(activity.created_at)}</p>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = html;
    },

    // =====================================================
    // Analytics Section
    // =====================================================
    async loadAnalytics() {
        await Promise.all([
            this.loadDailyViews(),
            this.loadDeviceStats(),
            this.loadTopPages(),
            this.loadReferrers()
        ]);
    },

    async loadDailyViews() {
        const days = document.getElementById('chartDays')?.value || 7;

        try {
            const response = await fetch(`${this.analyticsUrl}?action=daily_views&days=${days}`);
            const result = await response.json();

            if (result.success) {
                this.renderViewsChart(result.data);
            }
        } catch (error) {
            console.error('Failed to load daily views:', error);
        }
    },

    renderViewsChart(data) {
        const ctx = document.getElementById('viewsChart');
        if (!ctx) return;

        // Destroy existing chart
        if (this.viewsChart) {
            this.viewsChart.destroy();
        }

        this.viewsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(d => d.label),
                datasets: [{
                    label: 'Total Views',
                    data: data.map(d => d.views),
                    borderColor: '#387C44',
                    backgroundColor: 'rgba(56, 124, 68, 0.1)',
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Unique Visitors',
                    data: data.map(d => d.unique_visitors),
                    borderColor: '#1976d2',
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    },

    async loadDeviceStats() {
        try {
            const response = await fetch(`${this.analyticsUrl}?action=devices&days=30`);
            const result = await response.json();

            if (result.success) {
                this.renderDeviceChart(result.data.devices);
            }
        } catch (error) {
            console.error('Failed to load device stats:', error);
        }
    },

    renderDeviceChart(devices) {
        const ctx = document.getElementById('deviceChart');
        if (!ctx) return;

        if (this.deviceChart) {
            this.deviceChart.destroy();
        }

        const labels = Object.keys(devices);
        const data = Object.values(devices);
        const total = data.reduce((a, b) => a + b, 0);

        this.deviceChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
                datasets: [{
                    data: data,
                    backgroundColor: ['#387C44', '#1976d2', '#f57c00', '#7b1fa2'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });

        // Update stats text
        const statsDiv = document.getElementById('deviceStats');
        if (statsDiv) {
            statsDiv.innerHTML = labels.map(l => {
                const count = devices[l];
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return `<span class="me-3">${l}: ${count} (${pct}%)</span>`;
            }).join('');
        }
    },

    async loadTopPages() {
        const tbody = document.getElementById('topPagesBody');
        if (!tbody) return;

        tbody.innerHTML = '<tr><td colspan="4" class="text-center"><div class="spinner-border spinner-border-sm"></div></td></tr>';

        try {
            const response = await fetch(`${this.analyticsUrl}?action=top_pages&limit=5&days=30`);
            const result = await response.json();

            if (result.success && result.data.length > 0) {
                tbody.innerHTML = result.data.map((page, idx) => `
                    <tr>
                        <td><strong>${idx + 1}</strong></td>
                        <td>
                            <span title="${page.page_url}">${page.page_title || page.page_url}</span>
                            <br><small class="text-muted">${page.page_url.substring(0, 50)}${page.page_url.length > 50 ? '...' : ''}</small>
                        </td>
                        <td><strong>${page.views}</strong></td>
                        <td>${page.unique_visitors}</td>
                    </tr>
                `).join('');
            } else {
                tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Belum ada data.</td></tr>';
            }
        } catch (error) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Gagal memuat data.</td></tr>';
        }
    },

    async loadReferrers() {
        const container = document.getElementById('referrerStats');
        if (!container) return;

        try {
            const response = await fetch(`${this.analyticsUrl}?action=referrers&days=30`);
            const result = await response.json();

            if (result.success && result.data.length > 0) {
                const total = result.data.reduce((sum, r) => sum + r.visits, 0);

                container.innerHTML = `
                    <div class="row">
                        ${result.data.map(ref => {
                    const pct = Math.round((ref.visits / total) * 100);
                    return `
                                <div class="col-md-4 col-6 mb-3">
                                    <div class="d-flex justify-content-between mb-1">
                                        <span>${ref.source}</span>
                                        <strong>${ref.visits}</strong>
                                    </div>
                                    <div class="progress" style="height: 6px;">
                                        <div class="progress-bar bg-success" style="width: ${pct}%"></div>
                                    </div>
                                </div>
                            `;
                }).join('')}
                    </div>
                `;
            } else {
                container.innerHTML = '<p class="text-muted">Belum ada data traffic.</p>';
            }
        } catch (error) {
            container.innerHTML = '<p class="text-danger">Gagal memuat data.</p>';
        }
    },

    // =====================================================
    // Sitemap Generation
    // =====================================================
    async generateSitemap() {
        const btn = document.getElementById('generateSitemapBtn');
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Generating...';

        try {
            const response = await fetch(this.sitemapUrl);
            const result = await response.json();

            if (result.success) {
                this.showToast('success', `Sitemap generated! ${result.urls_count} URLs including ${result.articles_count} articles.`);
            } else {
                this.showToast('danger', result.error || 'Failed to generate sitemap.');
            }
        } catch (error) {
            this.showToast('danger', 'Error generating sitemap.');
        }

        btn.disabled = false;
        btn.innerHTML = '<i class="bi bi-diagram-3 me-1"></i> Generate Sitemap';
    },

    // =====================================================
    // Articles CRUD
    // =====================================================
    async loadArticles() {
        const tbody = document.getElementById('articlesTableBody');
        tbody.innerHTML = '<tr><td colspan="6" class="text-center"><div class="spinner-border spinner-border-sm"></div> Memuat...</td></tr>';

        try {
            const response = await fetch(`${this.apiUrl}?action=list_articles`);
            const result = await response.json();

            if (result.success && result.data.length > 0) {
                tbody.innerHTML = result.data.map(article => {
                    const seoScore = article.seo_score || 0;
                    const seoClass = seoScore >= 80 ? 'success' : seoScore >= 50 ? 'warning' : 'danger';

                    return `
                        <tr>
                            <td>
                                <strong>${article.title}</strong>
                                <br><small class="text-muted">${article.slug}</small>
                            </td>
                            <td><span class="badge bg-secondary badge-category">${article.category}</span></td>
                            <td><span class="badge bg-${seoClass}">${seoScore}</span></td>
                            <td>${article.formatted_date || this.formatDate(article.created_at)}</td>
                            <td>
                                ${article.is_published ?
                            '<span class="badge bg-success">Published</span>' :
                            '<span class="badge bg-warning text-dark">Draft</span>'}
                            </td>
                            <td>
                                <button class="btn btn-outline-primary btn-action me-1" onclick="AdminDashboard.editArticle(${article.id})">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button class="btn btn-outline-danger btn-action" onclick="AdminDashboard.deleteArticle(${article.id}, '${article.title.replace(/'/g, "\\'")}')">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                }).join('');
            } else {
                tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Belum ada artikel.</td></tr>';
            }
        } catch (error) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Gagal memuat artikel.</td></tr>';
        }
    },

    async saveArticle() {
        const form = document.getElementById('articleForm');
        const submitBtn = document.getElementById('submitBtn');
        const formData = new FormData(form);

        const articleId = document.getElementById('articleId').value;
        formData.append('action', articleId ? 'update' : 'create');

        // Add SEO score
        const seoScore = this.calculateSEOScore();
        formData.append('seo_score', seoScore);

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Menyimpan...';

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                this.showToast('success', articleId ? 'Artikel berhasil diperbarui!' : 'Artikel berhasil ditambahkan!');
                this.resetArticleForm();
                this.showSection('articles');
            } else {
                this.showToast('danger', result.error || 'Gagal menyimpan artikel.');
            }
        } catch (error) {
            this.showToast('danger', 'Terjadi kesalahan. Coba lagi.');
        }

        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="bi bi-check-lg"></i> Simpan Artikel';
    },

    async editArticle(id) {
        try {
            const response = await fetch(`${this.apiUrl}?action=get_article&id=${id}`);
            const result = await response.json();

            if (result.success) {
                const article = result.data;

                document.getElementById('articleId').value = article.id;
                document.getElementById('articleTitle').value = article.title;
                document.getElementById('articleSlug').value = article.slug;
                document.getElementById('articleCategory').value = article.category;
                document.getElementById('articleImage').value = article.image_url;
                document.getElementById('articleExcerpt').value = article.excerpt || '';
                document.getElementById('articleContent').value = article.content;
                document.getElementById('articleReadTime').value = article.read_time || '5 menit baca';

                // SEO fields
                document.getElementById('focusKeyword').value = article.focus_keyword || '';
                document.getElementById('metaTitle').value = article.meta_title || '';
                document.getElementById('metaDescription').value = article.meta_description || '';

                // Update character counters
                document.getElementById('metaTitleCount').textContent = `(${(article.meta_title || '').length}/70)`;
                document.getElementById('metaDescCount').textContent = `(${(article.meta_description || '').length}/160)`;

                document.getElementById('formTitle').textContent = 'Edit Artikel';
                this.showSection('add-article');

                // Calculate SEO score for loaded article
                setTimeout(() => this.calculateSEOScore(), 100);
            } else {
                this.showToast('danger', 'Artikel tidak ditemukan.');
            }
        } catch (error) {
            this.showToast('danger', 'Gagal memuat artikel.');
        }
    },

    deleteArticle(id, title) {
        this.deleteArticleId = id;
        document.getElementById('deleteArticleTitle').textContent = title;
        this.deleteModal.show();
    },

    async confirmDelete() {
        if (!this.deleteArticleId) return;

        const btn = document.getElementById('confirmDeleteBtn');
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';

        try {
            const formData = new FormData();
            formData.append('action', 'delete');
            formData.append('id', this.deleteArticleId);

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                this.showToast('success', 'Artikel berhasil dihapus.');
                this.loadArticles();
                this.loadDashboardData();
            } else {
                this.showToast('danger', result.error || 'Gagal menghapus artikel.');
            }
        } catch (error) {
            this.showToast('danger', 'Terjadi kesalahan.');
        }

        this.deleteModal.hide();
        btn.disabled = false;
        btn.innerHTML = 'Hapus';
        this.deleteArticleId = null;
    },

    resetArticleForm() {
        document.getElementById('articleForm').reset();
        document.getElementById('articleId').value = '';
        document.getElementById('formTitle').textContent = 'Tambah Artikel Baru';
        document.getElementById('metaTitleCount').textContent = '(0/70)';
        document.getElementById('metaDescCount').textContent = '(0/160)';
        document.getElementById('wordCount').textContent = '(0 kata)';

        // Reset SEO score
        this.updateSEOScoreUI(0, {
            keywordTitle: false,
            metaDesc: false,
            wordCount: false,
            keywordContent: false,
            metaTitle: false
        });
    },

    // =====================================================
    // Activity Log
    // =====================================================
    async loadActivityLog() {
        const tbody = document.getElementById('activityTableBody');
        tbody.innerHTML = '<tr><td colspan="5" class="text-center"><div class="spinner-border spinner-border-sm"></div> Memuat...</td></tr>';

        try {
            const response = await fetch(`${this.apiUrl}?action=activity_log`);
            const result = await response.json();

            if (result.success && result.data.length > 0) {
                tbody.innerHTML = result.data.map(log => `
                    <tr>
                        <td><small>${this.formatDateTime(log.created_at)}</small></td>
                        <td><strong>${log.username}</strong></td>
                        <td><span class="badge ${this.getActionBadgeClass(log.action)}">${log.action}</span></td>
                        <td>${log.target_title || log.target_type || '-'}</td>
                        <td><small class="text-muted">${log.details || '-'}</small></td>
                    </tr>
                `).join('');
            } else {
                tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Tidak ada log aktivitas.</td></tr>';
            }
        } catch (error) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Gagal memuat log.</td></tr>';
        }
    },

    // =====================================================
    // Utilities
    // =====================================================
    generateSlug(text) {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    },

    formatDate(dateStr) {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    },

    formatDateTime(dateStr) {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    setCurrentDate() {
        const now = new Date();
        document.getElementById('currentDate').textContent = now.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    },

    getActivityIcon(action) {
        const icons = {
            'create': 'bi-plus-circle',
            'update': 'bi-pencil',
            'delete': 'bi-trash',
            'login': 'bi-box-arrow-in-right',
            'logout': 'bi-box-arrow-left',
            'generate': 'bi-diagram-3'
        };
        return icons[action] || 'bi-activity';
    },

    getActivityIconClass(action) {
        const classes = {
            'create': 'create',
            'update': 'update',
            'delete': 'delete',
            'login': 'login',
            'logout': 'login',
            'generate': 'create'
        };
        return classes[action] || 'update';
    },

    getActionBadgeClass(action) {
        const classes = {
            'create': 'bg-success',
            'update': 'bg-info',
            'delete': 'bg-danger',
            'login': 'bg-primary',
            'logout': 'bg-secondary',
            'login_failed': 'bg-warning text-dark',
            'generate': 'bg-info'
        };
        return classes[action] || 'bg-secondary';
    },

    formatActivityAction(activity) {
        const actions = {
            'create': `Membuat artikel "${activity.target_title || 'baru'}"`,
            'update': `Memperbarui artikel "${activity.target_title || ''}"`,
            'delete': `Menghapus artikel "${activity.target_title || ''}"`,
            'login': 'Login ke dashboard',
            'logout': 'Logout dari dashboard',
            'login_failed': 'Percobaan login gagal',
            'generate': `Generated ${activity.target_type || 'sitemap'}`
        };
        return actions[activity.action] || activity.action;
    },

    showToast(type, message) {
        const container = document.getElementById('toastContainer');
        const toastId = 'toast-' + Date.now();

        const bgClass = type === 'success' ? 'bg-success' : type === 'danger' ? 'bg-danger' : 'bg-info';
        const icon = type === 'success' ? 'bi-check-circle' : type === 'danger' ? 'bi-exclamation-circle' : 'bi-info-circle';

        container.innerHTML += `
            <div id="${toastId}" class="toast align-items-center text-white ${bgClass} border-0" role="alert">
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="bi ${icon} me-2"></i>${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;

        const toastEl = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastEl, { delay: 4000 });
        toast.show();

        toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => AdminDashboard.init());
