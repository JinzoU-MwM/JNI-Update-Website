require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

// ====================================
// SEED DATA (from existing PHP site)
// ====================================

const servicesData = [
    {
        title: 'Izin PPIU & PIHK',
        slug: 'izin-ppiu-pihk',
        short_description: 'Pengurusan izin Penyelenggara Perjalanan Ibadah Umrah dan Haji Khusus dengan proses cepat dan legal.',
        full_description: '<p>Layanan lengkap pengurusan izin PPIU (Penyelenggara Perjalanan Ibadah Umrah) dan PIHK (Penyelenggara Ibadah Haji Khusus) sesuai regulasi Kementerian Agama. Kami mendampingi dari awal hingga izin terbit.</p>',
        icon_svg: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M5 21V7l8-4v18M13 21V3l8 4v14" /></svg>',
        display_order: 1,
    },
    {
        title: 'Izin Kontraktor',
        slug: 'izin-kontraktor',
        short_description: 'Pengurusan SBU, SIUJK, NIB Konstruksi, dan berbagai izin kontraktor sesuai standar LPJK.',
        full_description: '<p>Layanan profesional untuk pengurusan Sertifikat Badan Usaha (SBU), SIUJK, NIB Konstruksi, dan semua perizinan kontraktor yang diperlukan sesuai standar LPJK terbaru.</p>',
        icon_svg: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 20h20M4 20V10l8-6 8 6v10M10 20v-6h4v6" /></svg>',
        display_order: 2,
    },
    {
        title: 'Izin VISA',
        slug: 'izin-visa',
        short_description: 'Layanan pengurusan visa untuk bisnis, wisata, kunjungan kerja, dan studi ke berbagai negara.',
        full_description: '<p>Pengurusan visa ke berbagai negara untuk keperluan bisnis, wisata, kunjungan kerja, dan studi. Kami menangani seluruh proses dari persiapan dokumen hingga pengambilan visa.</p>',
        icon_svg: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>',
        display_order: 3,
    },
    {
        title: 'Akreditasi IATA',
        slug: 'akreditasi-iata',
        short_description: 'Pendampingan lengkap untuk mendapatkan akreditasi IATA bagi agen perjalanan wisata.',
        full_description: '<p>Konsultasi dan pendampingan proses akreditasi IATA (International Air Transport Association) untuk meningkatkan kredibilitas dan kapabilitas agen perjalanan wisata Anda.</p>',
        icon_svg: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>',
        display_order: 4,
    },
    {
        title: 'Bank Garansi',
        slug: 'bank-garansi',
        short_description: 'Jaminan bank garansi untuk tender, jaminan pelaksanaan, uang muka, dan pemeliharaan proyek.',
        full_description: '<p>Layanan penerbitan Bank Garansi dan asuransi proyek meliputi jaminan tender, jaminan pelaksanaan, jaminan uang muka, dan jaminan pemeliharaan dengan syarat mudah dan proses transparan.</p>',
        icon_svg: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="8" width="18" height="12" rx="2" /><path d="M7 8V6a5 5 0 0110 0v2" /></svg>',
        display_order: 5,
    },
    {
        title: 'Laporan Keuangan',
        slug: 'laporan-keuangan',
        short_description: 'Penyusunan laporan keuangan sesuai standar akuntansi untuk audit dan pelaporan pajak.',
        full_description: '<p>Jasa penyusunan laporan keuangan yang valid dan akuntabel oleh tenaga ahli berpengalaman, sesuai standar akuntansi untuk kebutuhan audit dan pelaporan pajak perusahaan Anda.</p>',
        icon_svg: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h8" /></svg>',
        display_order: 6,
    },
    {
        title: 'Perpajakan',
        slug: 'perpajakan',
        short_description: 'Konsultasi pajak, pelaporan SPT, perhitungan PPh/PPN, dan pendampingan pemeriksaan pajak.',
        full_description: '<p>Layanan komprehensif perpajakan meliputi konsultasi pajak bulanan dan tahunan, pelaporan SPT, perhitungan PPh/PPN, serta pendampingan dalam pemeriksaan pajak.</p>',
        icon_svg: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>',
        display_order: 7,
    },
];

const testimonialsData = [
    {
        client_name: 'Budi Santoso',
        client_role: 'CEO, PT Maju Jaya',
        review_text: 'JNI Consultant sangat profesional dalam mengurus izin PPIU kami. Prosesnya cepat dan transparan. Sangat direkomendasikan!',
        rating: 5,
        photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    },
    {
        client_name: 'Siti Rahayu',
        client_role: 'Direktur, CV Berkah Abadi',
        review_text: 'Terima kasih JNI atas bantuannya dalam mengurus SBU konstruksi perusahaan kami. Tim sangat helpful dan responsif.',
        rating: 5,
        photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    },
    {
        client_name: 'Ahmad Wijaya',
        client_role: 'Owner, PT Sukses Mandiri',
        review_text: 'Pelayanan prima! Bank Garansi kami selesai tepat waktu. Akan menggunakan jasa JNI lagi untuk kebutuhan legalitas lainnya.',
        rating: 5,
        photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    },
    {
        client_name: 'Dewi Kusuma',
        client_role: 'Manager, PT Travel Nusantara',
        review_text: 'Proses akreditasi IATA berjalan lancar berkat tim JNI. Sangat membantu dan selalu memberikan update terkini.',
        rating: 5,
        photo_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    },
];

const sampleArticles = [
    {
        slug: 'panduan-lengkap-izin-ppiu',
        title: 'Panduan Lengkap Mengurus Izin PPIU untuk Travel Umrah',
        category: 'Perizinan',
        author: 'Admin JNI',
        image_url: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800',
        excerpt: 'Pelajari langkah-langkah lengkap untuk mendapatkan izin PPIU dan memulai bisnis travel umrah yang legal.',
        content: '<h2>Apa itu Izin PPIU?</h2><p>Izin PPIU adalah izin resmi yang diberikan oleh Kementerian Agama kepada badan hukum yang ingin menyelenggarakan perjalanan ibadah umrah.</p><h2>Persyaratan</h2><ul><li>Badan hukum berbentuk PT</li><li>Modal disetor minimal Rp 5 Miliar</li><li>Memiliki kantor tetap</li><li>Memiliki tenaga profesional</li></ul>',
        read_time: '8 menit baca',
        is_published: true,
    },
    {
        slug: 'tips-memilih-bank-garansi',
        title: 'Tips Memilih Bank Garansi yang Tepat untuk Proyek Anda',
        category: 'Keuangan',
        author: 'Admin JNI',
        image_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
        excerpt: 'Panduan praktis memilih jenis bank garansi yang sesuai dengan kebutuhan proyek konstruksi Anda.',
        content: '<h2>Jenis-jenis Bank Garansi</h2><p>Bank garansi adalah jaminan yang diberikan oleh bank atas permintaan nasabah.</p><h3>1. Jaminan Tender</h3><p>Digunakan saat mengikuti tender proyek.</p><h3>2. Jaminan Pelaksanaan</h3><p>Diperlukan setelah memenangkan tender.</p>',
        read_time: '6 menit baca',
        is_published: true,
    },
];

// ====================================
// SEED FUNCTION
// ====================================

async function seed() {
    try {
        console.log('\n🌱 Starting Supabase database seed...\n');

        // Clear existing data
        await supabase.from('services').delete().neq('id', 0);
        await supabase.from('testimonials').delete().neq('id', 0);
        await supabase.from('articles').delete().neq('id', 0);
        console.log('🗑️  Cleared existing data');

        // Insert services
        const { error: sErr } = await supabase.from('services').insert(servicesData);
        if (sErr) throw sErr;
        console.log(`✅ Inserted ${servicesData.length} services`);

        // Insert testimonials
        const { error: tErr } = await supabase.from('testimonials').insert(testimonialsData);
        if (tErr) throw tErr;
        console.log(`✅ Inserted ${testimonialsData.length} testimonials`);

        // Insert sample articles
        const { error: aErr } = await supabase.from('articles').insert(sampleArticles);
        if (aErr) throw aErr;
        console.log(`✅ Inserted ${sampleArticles.length} articles`);

        console.log('\n🎉 Supabase database seeded successfully!\n');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
}

seed();
