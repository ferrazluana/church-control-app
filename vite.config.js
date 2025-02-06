import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Garante que os caminhos das rotas estão corretos
  resolve: {
    extensions: ['.js', '.jsx']
  }
});
