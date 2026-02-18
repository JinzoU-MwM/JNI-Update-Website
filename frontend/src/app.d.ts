// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			message: string;
			code?: string;
			status?: number;
		}

		interface PageData {
			error?: App.Error;
		}

		interface Platform {
			// Add platform-specific types if needed
		}
	}
}

export {};
