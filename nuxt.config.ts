import { defineNuxtConfig } from "nuxt3";

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
	build: {
		transpile: ["@ethersproject", "ethers"],
	},
	vite: {
		optimizeDeps: {
			include: ["bn.js", "js-sha3", "hash.js", "aes-js", "scrypt-js", "bech32"],
		},
	},
	publicRuntimeConfig: {
		WEB3_PROVIDER_URL: "https://eth-mainnet.alchemyapi.io/v2/YOUR_KEY",
	},
});
