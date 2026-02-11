console.log('Test script loaded');

const root = document.getElementById('root');
console.log('Root:', root);

if (root) {
  root.innerHTML = `
    <div style="padding: 20px; color: var(--vscode-foreground);">
      <h1>✅ JavaScript está funcionando</h1>
      <p>Si ves esto, el problema está en SolidJS</p>
    </div>
  `;
}