// // import '@vscode/webview-ui-toolkit/dist/toolkit.js';
// import { createSignal } from 'solid-js';

// export default function App() {
//   const [count, setCount] = createSignal(0);

//   function sendMessage() {
//     vscode.postMessage({
//       type: 'increment',
//       value: count(),
//     });
//   }

//   return (
//     <div style={{ padding: '12px' }}>
//       <h2>Main Dev Zone</h2>

//       <vscode-button onClick={() => setCount(count() + 1)}>
//         Increment
//       </vscode-button>

//       <vscode-button appearance="secondary" onClick={sendMessage}>
//         Send to Extension
//       </vscode-button>

//       <p>Count: {count()}</p>
//     </div>
//   );
// }
import ChatView from './features/chat/ChatView';

export default function App() {
  return <ChatView />;
}
