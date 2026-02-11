import type { Component } from 'solid-js';

const Footer: Component = () => {
  return (
    <footer style={{
      "padding": "var(--spacing-md)",
      "border-top": "1px solid var(--vscode-panel-border)",
      "background-color": "var(--vscode-sideBarSectionHeader-background)",
      "text-align": "center",
      "font-size": "11px",
      "color": "var(--vscode-descriptionForeground)"
    }}>
      <p>Powered by Astro + SolidJS</p>
    </footer>
  );
};

export default Footer;