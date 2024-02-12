import { sendGeneralMsg } from "../../utils/socket";
import "./ChatWindow.css"

function ChatWindow({ messages, setMessages, messageInput, setMessageInput }) {
  const handleSubmit = async e => {
    e.preventDefault();
    setMessages([...messages, messageInput]);
    setMessageInput("");
    await sendGeneralMsg(messageInput);
  }

  return (
    <div id="chat-window">
      <div id="chat-header">
        Chat
      </div>
      <div id="chat-body">
        <ul>
          {messages.map((msg, i) => <li key={i}>{msg}</li>)}
        </ul>
      </div>
      <div id="chat-footer">
        <form onSubmit={handleSubmit}>
          <input className="chat-input" value={messageInput} onChange={e => setMessageInput(e.target.value)} type="text" autoComplete='false' />
          <button className="btn-primary">Send</button>
        </form>
      </div>
    </div>
  );
}

export default ChatWindow;
