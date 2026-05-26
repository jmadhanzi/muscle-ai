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
    // Raise the warning threshold slightly (the app is media-heavy)
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // React runtime — changes almost never
          "vendor-react": ["react", "react-dom"],
          // Router
          "vendor-router": ["react-router-dom"],
          // Animation library
          "vendor-motion": ["framer-motion"],
          // Supabase client
          "vendor-supabase": ["@supabase/supabase-js"],
          // Charting
          "vendor-charts": ["recharts"],
          // All Radix UI primitives together
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
          // Markdown renderer (only used in coach chat)
          "vendor-markdown": ["react-markdown"],
          // html2canvas (only used in milestone sharing)
          "vendor-html2canvas": ["html2canvas"],
        },
      },
    },
  },
}));
