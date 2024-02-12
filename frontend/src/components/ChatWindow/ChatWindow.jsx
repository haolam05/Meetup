import { useRef } from "react";
import { getProfileImageUrl } from "../../utils/images";
import { sendGeneralMsg } from "../../utils/socket";
import "./ChatWindow.css"

function ChatWindow({ user, messages, setMessages, messageInput, setMessageInput }) {
  const inputRef = useRef();

  const handleSubmit = async e => {
    e.preventDefault();
    setMessages([...messages, { message: messageInput, sender: user, at: new Date() }]);
    setMessageInput("");
    await sendGeneralMsg(messageInput);
    inputRef.current.scrollIntoView();
  }

  return (
    <div id="chat-window">
      <div id="chat-header">
        Meetup General Chat
      </div>
      <div id="chat-body">
        <ul>
          {messages.map((m, i) => (
            <li key={i} className="chat-box">
              <div className={`chat-message ${user.id === m.sender.id ? "me" : ""}`}>
                {user.id !== m.sender.id && <div><img src={getProfileImageUrl(m.sender.profileImageUrl)} alt="avatar" /></div>}
                <div className="message-wrapper"><div>{m.message}</div></div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div id="chat-footer">
        <form onSubmit={handleSubmit}>
          <input ref={inputRef} placeholder="Aa" className="chat-input" value={messageInput} onChange={e => setMessageInput(e.target.value)} type="text" autoComplete='false' />
        </form>
      </div>
    </div>
  );
}

export default ChatWindow;
