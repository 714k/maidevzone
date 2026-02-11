import { createSignal } from 'solid-js';
import { addMessage, messages } from './chatStore';
import { getBridge } from '../../bridge';

export default function ChatView() {
  const [input, setInput] = createSignal('');
  const bridge = getBridge();

  function send() {
    addMessage(input());
    bridge.sendPrompt(input());
    setInput('');
  }

  return (
    <>
      <div class="messages">
        {messages().map((msg) => (
          <div>{msg}</div>
        ))}
      </div>

      <vscode-text-area
        value={input()}
        onInput={(e: any) => setInput(e.target.value)}
        placeholder="Whats on your mind?"
      ></vscode-text-area>
      <vscode-button onclick={send}>Send</vscode-button>
    </>
  );
}
