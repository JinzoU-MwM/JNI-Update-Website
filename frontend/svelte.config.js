import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		warningFilter: (warning) => {
			// Downgrade a11y warnings so they don't break the build
			if (warning.code.startsWith('a11y')) return false;
			return true;
		}
	},
	kit: {
		adapter: adapter({
			runtime: 'nodejs22.x'
		})
	}
};

export default config;
