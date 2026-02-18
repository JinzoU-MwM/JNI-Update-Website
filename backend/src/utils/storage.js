const getStorageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;

    const supabaseUrl = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
    if (!supabaseUrl) return path;

    // Remove trailing slash from base and leading slash from path to avoid double slashes
    const baseUrl = supabaseUrl.replace(/\/+$/, '');
    const cleanPath = path.replace(/^\/+/, '');

    // Construct the public storage URL
    // Format: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
    // The relative paths in DB are like 'uploads/thumbnails/...' or 'assets/images/...'
    // This assumes buckets named 'uploads' and 'assets' exist and are public.
    return `${baseUrl}/storage/v1/object/public/${cleanPath}`;
};

module.exports = { getStorageUrl };
