const App = () => {
  console.log('App component rendering');
  
  return (
    <div style={{
      "padding": "20px",
      "color": "var(--vscode-foreground)",
      "background-color": "var(--vscode-editor-background)"
    }}>
      <h1>✅ SolidJS is working!</h1>
      <p>If you see this, the problem was with the components.</p>
    </div>
  );
};

export default App;