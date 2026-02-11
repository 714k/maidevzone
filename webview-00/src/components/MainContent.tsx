import type { Component } from 'solid-js';
import { createSignal, onMount } from 'solid-js';
import { sendMessage, onMessage, getVsCodeApi } from '../utils/vscode.js';

const MainContent: Component = () => {
  const [count, setCount] = createSignal(0);
  const [message, setMessage] = createSignal('');
  const [theme, setTheme] = createSignal('dark');

  onMount(() => {
    sendMessage('ready');

    onMessage((msg) => {
      console.log('Message from extension:', msg);
      
      switch (msg.type) {
        case 'update':
          setMessage(`Update received: ${msg.payload.message}`);
          break;
        case 'command':
          if (msg.payload === 'refresh') {
            handleRefresh();
          } else if (msg.payload === 'clear') {
            handleClear();
          }
          break;
        case 'theme':
          setTheme(msg.payload);
          break;
      }
    });

    const vscode = getVsCodeApi();
    const state = vscode.getState();
    if (state?.count) {
      setCount(state.count);
    }
  });

  const handleIncrement = () => {
    const newCount = count() + 1;
    setCount(newCount);
    
    const vscode = getVsCodeApi();
    vscode.setState({ count: newCount });
    
    sendMessage('action', `Incremented to ${newCount}`);
  };

  const handleRequest = () => {
    sendMessage('request', { type: 'getData' });
  };

  const handleRefresh = () => {
    setMessage('Refreshed at ' + new Date().toLocaleTimeString());
  };

  const handleClear = () => {
    setCount(0);
    setMessage('');
    const vscode = getVsCodeApi();
    vscode.setState({ count: 0 });
  };

  return (
    <main style={{
      "padding": "var(--spacing-md)",
      "display": "flex",
      "flex-direction": "column",
      "gap": "var(--spacing-md)"
    }}>
      <section style={{
        "padding": "var(--spacing-md)",
        "background-color": "var(--vscode-editor-background)",
        "border-radius": "var(--radius)",
        "border": "1px solid var(--vscode-panel-border)"
      }}>
        <h2 style={{
          "font-size": "14px",
          "font-weight": "600",
          "margin-bottom": "var(--spacing-sm)",
          "color": "var(--vscode-foreground)"
        }}>
          Counter Demo
        </h2>
        
        <div style={{
          "display": "flex",
          "align-items": "center",
          "gap": "var(--spacing-md)"
        }}>
          <div style={{
            "font-size": "32px",
            "font-weight": "bold",
            "color": "var(--vscode-textLink-foreground)",
            "min-width": "60px",
            "text-align": "center"
          }}>
            {count()}
          </div>
          
          <button
            onClick={handleIncrement}
            style={{
              "padding": "8px 16px",
              "background-color": "var(--vscode-button-background)",
              "color": "var(--vscode-button-foreground)",
              "border-radius": "var(--radius)",
              "font-size": "13px",
              "font-weight": "500"
            }}
          >
            Increment
          </button>
        </div>
      </section>

      <section style={{
        "padding": "var(--spacing-md)",
        "background-color": "var(--vscode-editor-background)",
        "border-radius": "var(--radius)",
        "border": "1px solid var(--vscode-panel-border)"
      }}>
        <h2 style={{
          "font-size": "14px",
          "font-weight": "600",
          "margin-bottom": "var(--spacing-sm)",
          "color": "var(--vscode-foreground)"
        }}>
          Actions
        </h2>
        
        <div style={{
          "display": "flex",
          "flex-direction": "column",
          "gap": "var(--spacing-sm)"
        }}>
          <button
            onClick={handleRequest}
            style={{
              "padding": "8px 16px",
              "background-color": "var(--vscode-button-secondaryBackground)",
              "color": "var(--vscode-button-secondaryForeground)",
              "border-radius": "var(--radius)",
              "font-size": "13px",
              "text-align": "left"
            }}
          >
            📡 Request Data from Extension
          </button>
        </div>
      </section>

      {message() && (
        <div style={{
          "padding": "var(--spacing-md)",
          "background-color": "var(--vscode-textBlockQuote-background)",
          "border-left": "4px solid var(--vscode-textLink-foreground)",
          "border-radius": "var(--radius)",
          "font-size": "12px"
        }}>
          {message()}
        </div>
      )}

      <div style={{
        "padding": "var(--spacing-md)",
        "font-size": "11px",
        "color": "var(--vscode-descriptionForeground)",
        "text-align": "center"
      }}>
        Theme: {theme()} | State persists across reloads
      </div>
    </main>
  );
};

export default MainContent;