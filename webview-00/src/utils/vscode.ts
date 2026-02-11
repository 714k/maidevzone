import type { VsCodeApi } from '../types/vscode.js';

let vscodeApi: VsCodeApi | undefined;

export function getVsCodeApi(): VsCodeApi {
  if (!vscodeApi) {
    vscodeApi = window.acquireVsCodeApi();
  }
  return vscodeApi;
}

export function sendMessage(command: string, data?: any) {
  const vscode = getVsCodeApi();
  vscode.postMessage({ command, data });
}

export function onMessage(callback: (message: any) => void) {
  window.addEventListener('message', (event) => {
    callback(event.data);
  });
}