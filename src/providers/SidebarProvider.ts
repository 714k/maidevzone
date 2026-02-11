import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { ToWebviewMessage, FromWebviewMessage } from '../types/messages';

export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this._extensionUri, 'dist', 'webview'),
      ],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    // Escuchar mensajes del webview
    webviewView.webview.onDidReceiveMessage(
      async (message: FromWebviewMessage) => {
        switch (message.command) {
          case 'ready':
            console.log('Webview is ready');
            this.sendMessage({ type: 'theme', payload: this._getTheme() });
            break;

          case 'action':
            vscode.window.showInformationMessage(
              `Action received: ${message.data}`,
            );
            break;

          case 'request':
            // Manejar solicitudes del webview
            this.handleRequest(message.data);
            break;

          case 'log':
            console.log('Webview log:', message.data);
            break;
        }
      },
    );

    // Detectar cambios de tema
    vscode.window.onDidChangeActiveColorTheme(() => {
      this.sendMessage({ type: 'theme', payload: this._getTheme() });
    });
  }

  private handleRequest(data: any) {
    // Solución 1: Usar 'as const' en el objeto
    const response = {
      type: 'update' as const,
      payload: {
        message: 'Data from extension',
        timestamp: Date.now(),
      },
    };
    this.sendMessage(response);
  }

  public sendMessage(message: ToWebviewMessage) {
    if (this._view) {
      this._view.webview.postMessage(message);
    }
  }

  public refresh() {
    this.sendMessage({ type: 'command', payload: 'refresh' });
  }

  public clear() {
    this.sendMessage({ type: 'command', payload: 'clear' });
  }

  private _getTheme(): string {
    const config = vscode.workspace.getConfiguration('maidevzone');
    const themePref = config.get('theme', 'auto');

    if (themePref !== 'auto') {
      return themePref;
    }

    const theme = vscode.window.activeColorTheme;
    return theme.kind === vscode.ColorThemeKind.Dark ? 'dark' : 'light';
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    const webviewPath = path.join(this._extensionUri.fsPath, 'dist', 'webview');
    const indexPath = path.join(webviewPath, 'index.html');

    console.log('=== WEBVIEW LOADING ===');
    console.log('Webview path:', webviewPath);
    console.log('Index exists:', fs.existsSync(indexPath));

    if (!fs.existsSync(indexPath)) {
      return `<!DOCTYPE html>
      <html>
      <head>
        <style>
          body { 
            padding: 20px; 
            font-family: var(--vscode-font-family);
            color: var(--vscode-errorForeground);
            background: var(--vscode-editor-background);
          }
          pre {
            background: var(--vscode-textCodeBlock-background);
            padding: 10px;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <h1>❌ Webview build not found</h1>
        <p>Expected: <code>${indexPath}</code></p>
        <h3>Run:</h3>
        <pre>npm run compile:webview</pre>
      </body>
      </html>`;
    }

    let html = fs.readFileSync(indexPath, 'utf8');

    // Convertir todas las rutas de assets a URIs de webview
    html = html.replace(/(href|src)="([^"]+)"/g, (match, attr, assetPath) => {
      // Ignorar URLs externas y data URIs
      if (
        assetPath.startsWith('http://') ||
        assetPath.startsWith('https://') ||
        assetPath.startsWith('data:')
      ) {
        return match;
      }

      // Limpiar la ruta (remover / inicial)
      const cleanPath = assetPath.replace(/^\//, '');
      const fullPath = path.join(webviewPath, cleanPath);

      // Verificar que el archivo existe
      if (!fs.existsSync(fullPath)) {
        console.warn(`Asset not found: ${fullPath}`);
      }

      // Convertir a URI de webview
      const resourceUri = webview.asWebviewUri(vscode.Uri.file(fullPath));

      console.log(`${attr}: ${assetPath} -> ${resourceUri.toString()}`);

      return `${attr}="${resourceUri}"`;
    });

    // Generar nonce para CSP
    const nonce = getNonce();

    // Content Security Policy
    const cspContent = [
      `default-src 'none'`,
      `style-src ${webview.cspSource} 'unsafe-inline'`,
      `script-src 'nonce-${nonce}'`,
      `img-src ${webview.cspSource} https: data:`,
      `font-src ${webview.cspSource}`,
    ].join('; ');

    // Insertar CSP en el head
    html = html.replace(
      '<head>',
      `<head>
      <meta http-equiv="Content-Security-Policy" content="${cspContent}">`,
    );

    // Agregar nonce a todos los scripts
    html = html.replace(/<script/g, `<script nonce="${nonce}"`);

    // Remover type="module" si existe (no es necesario con IIFE)
    html = html.replace(/type="module"/g, '');

    console.log('✅ HTML loaded successfully');
    console.log('=== END WEBVIEW LOADING ===');

    return html;
  }
}

function getNonce() {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
