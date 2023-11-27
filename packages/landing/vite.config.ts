
import { defineConfig } from "vite"
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { viteSingleFile } from "vite-plugin-singlefile"

export default defineConfig({
	plugins: [
        nodePolyfills({}),
      viteSingleFile({ removeViteModuleLoader: true })
    ],
    build: {
    
		minify: true,
	},
    define: {
        'process.env': {}
      }
})