import { render } from 'solid-js/web';
import App from './App.js';
import './styles/global.css';

console.log('=== MAIN.TSX START ===');
console.log('Window:', typeof window);
console.log('Document:', typeof document);

const root = document.getElementById('root');
console.log('Root element found:', !!root);
console.log('Root element:', root);

if (root) {
  try {
    console.log('Attempting to render...');
    render(() => App(), root);
    console.log('✅ Render complete');
  } catch (error) {
    console.error('❌ Render error:', error);
  }
} else {
  console.error('❌ Root element #root not found');
  // Mostrar qué elementos existen
  console.log('Body children:', document.body.children);
}

console.log('=== MAIN.TSX END ===');