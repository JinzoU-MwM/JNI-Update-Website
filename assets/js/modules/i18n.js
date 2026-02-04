/**
 * Internationalization (i18n) Module
 * Handles client-side translation switching (ID <-> EN)
 */

const I18n = {
    // Current Language
    currentLang: 'id',

    // Translation Dictionary
    translations: {
        // Navbar
        "nav_home": { "id": "Beranda", "en": "Home" },
        "nav_services": { "id": "Layanan", "en": "Services" },
        "nav_about": { "id": "Tentang Kami", "en": "About Us" },
        "nav_blog": { "id": "Artikel", "en": "Articles" },
        "nav_gallery": { "id": "Galeri", "en": "Gallery" },
        "nav_contact": { "id": "Kontak", "en": "Contact" },
        "nav_cta": { "id": "Konsultasi", "en": "Consult Us" },

        // Hero
        "hero_badge": { "id": "🏆 Konsultan Terpercaya Sejak 2017", "en": "🏆 Trusted Consultant Since 2017" },
        "hero_title_1": { "id": "Solusi ", "en": "Professional " },
        "hero_title_highlight": { "id": "Perizinan", "en": "Licensing" },
        "hero_title_2": { "id": " & Konsultasi Bisnis Profesional", "en": " & Business Consulting" },
        "hero_desc": {
            "id": "Kami membantu mengurus segala kebutuhan perizinan usaha Anda dengan cepat, tepat, dan terpercaya. Mulai dari izin PPIU, kontraktor, hingga layanan keuangan.",
            "en": "We help manage all your business licensing needs quickly, accurately, and reliably. From PPIU licenses, contractor permits, to financial services."
        },
        "hero_btn_primary": { "id": "Konsultasi Gratis", "en": "Free Consultation" },
        "hero_btn_outline": { "id": "Lihat Layanan", "en": "View Services" },

        // Hero Stats
        "stat_projects": { "id": "Proyek Selesai", "en": "Projects Completed" },
        "stat_success": { "id": "Tingkat Keberhasilan", "en": "Success Rate" },
        "stat_exp": { "id": "Tahun Pengalaman", "en": "Years Experience" },

        // Services Section
        "services_badge": { "id": "Layanan Kami", "en": "Our Services" },
        "services_title_1": { "id": "Solusi Lengkap untuk ", "en": "Complete Solutions for " },
        "services_title_highlight": { "id": "Kebutuhan Bisnis", "en": "Business Needs" },
        "services_title_2": { "id": " Anda", "en": "" },
        "services_desc": {
            "id": "Kami menyediakan berbagai layanan konsultasi dan perizinan untuk membantu bisnis Anda berkembang dengan legal dan profesional.",
            "en": "We provide various consulting and licensing services to help your business grow legally and professionally."
        },
        "srv_ppiu_title": { "id": "Izin PPIU & PIHK", "en": "PPIU & PIHK License" },
        "srv_ppiu_desc": { "id": "Pengurusan izin Penyelenggara Perjalanan Ibadah Umrah (PPIU) dan Penyelenggara Ibadah Haji Khusus (PIHK) dengan proses cepat dan legal.", "en": "Management of Umrah Travel Organizer (PPIU) and Special Hajj Organizer (PIHK) licenses with a fast and legal process." },

        "srv_contractor_title": { "id": "Izin Kontraktor", "en": "Contractor License" },
        "srv_contractor_desc": { "id": "Pengurusan Sertifikat Badan Usaha (SBU), Surat Izin Usaha Jasa Konstruksi (SIUJK), dan izin kontraktor lainnya.", "en": "Management of Business Entity Certificate (SBU), Construction Services Business License (SIUJK), and other contractor permits." },

        "srv_visa_title": { "id": "Izin VISA", "en": "VISA Permit" },
        "srv_visa_desc": { "id": "Layanan pengurusan visa untuk berbagai keperluan bisnis, wisata, dan kunjungan kerja ke berbagai negara.", "en": "Visa management services for various business, tourism, and work visit purposes." },

        "srv_iata_title": { "id": "Akreditasi IATA", "en": "IATA Accreditation" },
        "srv_iata_desc": { "id": "Pendampingan dan pengurusan akreditasi IATA untuk agen perjalanan dan biro perjalanan wisata.", "en": "Assistance and management of IATA accreditation for travel agents and tour operators." },

        "srv_bank_title": { "id": "Bank Garansi", "en": "Bank Guarantee" },
        "srv_bank_desc": { "id": "Layanan pengurusan jaminan bank garansi untuk tender, proyek konstruksi, dan keperluan bisnis lainnya.", "en": "Bank guarantee management services for tenders, construction projects, and other business needs." },

        "srv_finance_title": { "id": "Laporan Keuangan", "en": "Financial Report" },
        "srv_finance_desc": { "id": "Jasa penyusunan laporan keuangan, audit, dan konsultasi perpajakan untuk bisnis dan perusahaan.", "en": "Financial statement preparation, audit, and tax consulting services for businesses and companies." },

        "srv_tax_title": { "id": "Perpajakan", "en": "Taxation" },
        "srv_tax_desc": { "id": "Konsultasi dan pengurusan pajak perusahaan, pelaporan SPT, dan tax planning yang efektif dan legal.", "en": "Corporate tax consulting and management, SPT reporting, and effective tax planning." },

        // Why Us Section
        "why_badge": { "id": "Mengapa Kami", "en": "Why Choose Us" },
        "why_title_1": { "id": "Alasan Memilih ", "en": "Reasons to Choose " },
        "why_title_highlight": { "id": "Jamnasindo", "en": "Jamnasindo" },
        "why_desc": { "id": "Dengan pengalaman lebih dari 15 tahun, kami telah membantu ratusan perusahaan dalam mengurus perizinan dan kebutuhan bisnis mereka.", "en": "With over 15 years of experience, we have helped hundreds of companies manage their licensing and business needs." },

        "why_team_title": { "id": "Tim Profesional dan ", "en": "Professional Team & " },
        "why_team_highlight": { "id": "Berpengalaman", "en": "Experienced" },
        "why_team_desc": { "id": "Kami memiliki tim konsultan yang ahli di bidangnya dengan rekam jejak yang terbukti dalam menangani berbagai kasus perizinan.", "en": "We have a team of expert consultants with a proven track record in handling various licensing cases." },

        "why_point_1": { "id": "Konsultan bersertifikasi dan berpengalaman lebih dari 10 tahun", "en": "Certified consultants with over 10 years of experience" },
        "why_point_2": { "id": "Memahami regulasi terbaru di berbagai sektor industri", "en": "Understand the latest regulations in various industrial sectors" },
        "why_point_3": { "id": "Jaringan luas dengan instansi pemerintah terkait", "en": "Extensive network with relevant government agencies" },

        "why_fast_title": { "id": "Proses Cepat dan ", "en": "Fast Process & " },
        "why_fast_highlight": { "id": "Transparan", "en": "Transparent" },
        "why_fast_desc": { "id": "Kami berkomitmen memberikan layanan yang cepat dengan proses yang transparan, sehingga Anda dapat fokus pada bisnis utama Anda.", "en": "We are committed to providing fast service with a transparent process, so you can focus on your core business." },

        "why_point_4": { "id": "Estimasi waktu penyelesaian yang jelas dan realistis", "en": "Clear and realistic completion time estimates" },
        "why_point_5": { "id": "Update progress secara berkala melalui berbagai channel", "en": "Regular progress updates via various channels" },
        "why_point_6": { "id": "Biaya transparan tanpa biaya tersembunyi", "en": "Transparent costs with no hidden fees" },

        // Testimonials
        "testi_badge": { "id": "Testimoni", "en": "Testimonials" },
        "testi_title_1": { "id": "Apa Kata ", "en": "What Our " },
        "testi_title_highlight": { "id": "Klien Kami", "en": "Clients Say" },
        "testi_desc": { "id": "Kepuasan klien adalah prioritas utama kami. Berikut adalah pengalaman mereka bekerja sama dengan Jamnasindo.", "en": "Client satisfaction is our top priority. Here are their experiences working with Jamnasindo." },

        // CTA
        "cta_title": { "id": "Siap Memulai Konsultasi?", "en": "Ready to Start Consulting?" },
        "cta_desc": { "id": "Hubungi kami sekarang untuk mendapatkan konsultasi gratis dan solusi terbaik untuk kebutuhan perizinan bisnis Anda.", "en": "Contact us now to get a free consultation and the best solution for your business licensing needs." },
        "cta_btn": { "id": "Hubungi Kami Sekarang", "en": "Contact Us Now" },

        // Footer
        "footer_desc": { "id": "Partner terpercaya untuk mengurus segala kebutuhan perizinan dan konsultasi bisnis Anda dengan profesional dan efisien.", "en": "Your trusted partner to manage all licensing and business consulting needs professionally and efficiently." },
        "footer_services": { "id": "Layanan", "en": "Services" },
        "footer_company": { "id": "Perusahaan", "en": "Company" },
        "footer_contact": { "id": "Kontak", "en": "Contact" },
        "footer_rights": { "id": "© 2024 Jaminan Nasional Indonesia. All Rights Reserved.", "en": "© 2024 Jaminan Nasional Indonesia. All Rights Reserved." },
        "footer_privacy": { "id": "Kebijakan Privasi", "en": "Privacy Policy" },
        "footer_terms": { "id": "Syarat & Ketentuan", "en": "Terms & Conditions" }
    },

    /**
     * Initialize Language Selector
     */
    init() {
        // Load saved language or default to ID
        const savedLang = localStorage.getItem('jni_lang') || 'id';
        this.setLanguage(savedLang);

        console.log('I18n Initialized. Current Lang:', savedLang);

        // Robust Event Listener (Delegation)
        document.body.addEventListener('click', (e) => {
            const selector = e.target.closest('.lang-selector');
            if (selector) {
                e.preventDefault(); // Prevent default if it's a link (just in case)
                const newLang = this.currentLang === 'id' ? 'en' : 'id';
                console.log('Language toggled to:', newLang);
                this.setLanguage(newLang);
            }
        });
    },

    /**
     * Set active language and update DOM
     * @param {string} lang - 'id' or 'en'
     */
    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('jni_lang', lang);

        // Update selector UI
        const selectorText = document.querySelector('.lang-selector span');
        if (selectorText) {
            selectorText.textContent = lang.toUpperCase();
        }

        // Translate all elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.dataset.i18n;
            const translation = this.translations[key];

            if (translation) {
                // If element has children (like spans for highlighting), we might need to be careful
                // But for this simple implementation, we'll replace text content or innerHTML if needed
                if (element.children.length === 0) {
                    element.textContent = translation[lang];
                } else {
                    // For elements with HTML structure (like headers with <span>), we need specific handling
                    // or we can allow innerHTML in translations (less secure but easier for this static site)
                    // Here we'll check if we have specific sub-keys in our dictionary or if we should just assume simple text

                    // Fallback: mostly replace textContent, unless specific specific keys used
                    element.textContent = translation[lang];
                }
            }
        });

        // Special handling for elements split into parts (Title + Span)
        // We will manually update specific IDs if the generic data-i18n loop isn't enough
        this.updateCompositeElements(lang);
    },

    /**
     * Handle complex elements that have mixed HTML/Spans
     */
    updateCompositeElements(lang) {
        // Safe Helper
        const setText = (id, text) => {
            const el = document.getElementById(id);
            if (el) el.textContent = text;
        };

        const setHtml = (selector, html) => {
            const el = document.querySelector(selector);
            if (el) el.innerHTML = html;
        };

        // Hero Title
        const heroTitle = document.querySelector('#hero h1');
        if (heroTitle) {
            heroTitle.innerHTML = this.translations['hero_title_1'][lang] +
                `<span>${this.translations['hero_title_highlight'][lang]}</span>` +
                this.translations['hero_title_2'][lang];
        }

        // Services Title
        const servicesTitle = document.querySelector('#services h2');
        if (servicesTitle) {
            servicesTitle.innerHTML = this.translations['services_title_1'][lang] +
                `<span>${this.translations['services_title_highlight'][lang]}</span>` +
                this.translations['services_title_2'][lang];
        }

        // Why Us Title
        const whyTitle = document.querySelector('#why-us h2');
        if (whyTitle) {
            whyTitle.innerHTML = this.translations['why_title_1'][lang] +
                `<span>${this.translations['why_title_highlight'][lang]}</span>`;
        }

        // Why Us Content Titles
        const whyTeamTitle = document.querySelector('.why-block:not(.reverse) h2');
        if (whyTeamTitle) {
            whyTeamTitle.innerHTML = this.translations['why_team_title'][lang] +
                `<span>${this.translations['why_team_highlight'][lang]}</span>`;
        }

        const whyFastTitle = document.querySelector('.why-block.reverse h2');
        if (whyFastTitle) {
            whyFastTitle.innerHTML = this.translations['why_fast_title'][lang] +
                `<span>${this.translations['why_fast_highlight'][lang]}</span>`;
        }

        // Testimonials Title
        const testiTitle = document.querySelector('#testimonials h2');
        if (testiTitle) {
            testiTitle.innerHTML = this.translations['testi_title_1'][lang] +
                `<span>${this.translations['testi_title_highlight'][lang]}</span>`;
        }
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    I18n.init();
});
