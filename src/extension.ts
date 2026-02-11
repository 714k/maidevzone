import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { getNonce } from './getNonce';

class MainViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'maidevzone.mainView';

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ) {
    const webview = webviewView.webview;

    webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this._extensionUri, 'dist')],
    };

    webview.html = this._getHtml(webview);
  }

  private _getHtml(webview: vscode.Webview): string {
    const distRoot = vscode.Uri.joinPath(this._extensionUri, 'dist', 'webview');

    const assetsDiskPath = path.join(
      this._extensionUri.fsPath,
      'dist',
      'webview',
      'assets',
    );

    if (!fs.existsSync(assetsDiskPath)) {
      return `<h1>Frontend not built</h1><p>Run: npm run build in webview folder</p>`;
    }

    const files = fs.readdirSync(assetsDiskPath);

    const jsFile = files.find((f) => f.endsWith('.js'));
    const cssFile = files.find((f) => f.endsWith('.css'));

    if (!jsFile) {
      return `<h1>No JS bundle found in dist/webview/assets</h1>`;
    }

    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(distRoot, 'assets', 'index.js'),
    );

    const styleUri = cssFile
      ? webview.asWebviewUri(vscode.Uri.joinPath(distRoot, 'assets', cssFile))
      : undefined;

    const nonce = getNonce();

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />

        <meta http-equiv="Content-Security-Policy"
          content="
            default-src 'none';
            img-src ${webview.cspSource} https:;
            style-src ${webview.cspSource} 'unsafe-inline';
            font-src ${webview.cspSource};
            script-src 'nonce-${nonce}';
            connect-src https:;
          "
        />

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        ${styleUri ? `<link href="${styleUri}" rel="stylesheet" />` : ''}
      </head>

      <body>
        <div id="root"></div>
        <script nonce="${nonce}" type="module" src="${scriptUri}"></script>
      </body>
      </html>
    `;
  }
}

export function activate(context: vscode.ExtensionContext) {
  console.log('maidevzone extension activated');

  const provider = new MainViewProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      MainViewProvider.viewType,
      provider,
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('maidevzone.open', () => {
      vscode.commands.executeCommand(
        'workbench.view.extension.maidevzone-sidebar',
      );
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('maidevzone.refresh', () => {
      vscode.window.showInformationMessage('Refreshing maidevzone...');
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('maidevzone.clear', () => {
      vscode.window.showInformationMessage('Clearing maidevzone data...');
    }),
  );
}

export function deactivate() {}
