import mkcert from 'vite-plugin-mkcert'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [sveltekit(), mkcert()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	server: {
		https: {
			key: 'certs/localhost+2-key.pem',
			cert: 'certs/localhost+2.pem'
		},
		proxy: {}
	}
})
