import type { Component } from 'solid-js';

const Header: Component = () => {
  return (
    <header style={{
      "padding": "var(--spacing-md)",
      "border-bottom": "1px solid var(--vscode-panel-border)",
      "background-color": "var(--vscode-sideBarSectionHeader-background)"
    }}>
      <h1 style={{
        "font-size": "18px",
        "font-weight": "600",
        "color": "var(--vscode-sideBarTitle-foreground)"
      }}>
        🚀 maidevzone
      </h1>
      <p style={{
        "font-size": "12px",
        "color": "var(--vscode-descriptionForeground)",
        "margin-top": "4px"
      }}>
        Your AI Development Companion
      </p>
    </header>
  );
};

export default Header;