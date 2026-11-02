JavaScript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Hokkaido2026/', // ⚠️ 必須與您的 GitHub Repository 名稱大小寫完全一致！
})
