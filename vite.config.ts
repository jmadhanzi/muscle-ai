import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: { overlay: false },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  build: {
    // Capacitor loads files from its own server (capacitor://localhost),
    // so relative paths are required. This is a no-op in the browser.
    outDir: "dist",
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom"],
          "vendor-router": ["react-router-dom"],
          "vendor-motion": ["framer-motion"],
          "vendor-supabase": ["@supabase/supabase-js"],
          "vendor-charts": ["recharts"],
          "vendor-radix": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-tabs",
            "@radix-ui/react-select",
            "@radix-ui/react-toast",
            "@radix-ui/react-tooltip",
            "@radix-ui/react-accordion",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-switch",
            "@radix-ui/react-slider",
            "@radix-ui/react-progress",
            "@radix-ui/react-avatar",
          ],
          "vendor-markdown": ["react-markdown"],
          "vendor-html2canvas": ["html2canvas"],
          // Keep Capacitor plugins in their own chunk
          "vendor-capacitor": [
            "@capacitor/core",
            "@capacitor/push-notifications",
            "@capacitor/browser",
            "@capacitor/share",
            "@capacitor/clipboard",
            "@capacitor/haptics",
            "@capacitor/status-bar",
            "@capacitor/splash-screen",
            "@capacitor/app",
          ],
        },
      },
    },
  },
}));
