import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { getProfileImageUrl } from "../../utils/images";
import { choosePort, sendGeneralMsg } from "../../utils/socket";
import { formattedDate, formattedTime } from "../../utils/dateFormatter";
import "./ChatWindow.css"

function ChatWindow({ user }) {
  const [windowOpen, setWindowOpen] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setMessageInput("");
    await sendGeneralMsg(messageInput);
  }

  useEffect(() => {
    const MAX_MESSAGES = 10;
    const socket = io(choosePort());
    socket.on('connect_error', () => setTimeout(() => socket.connect(), 5000));
    socket.on('new_general_message', data => {
      if (user) {
        if (messages.length + 1 > MAX_MESSAGES) {
          setMessages([...messages.slice(1, MAX_MESSAGES), data]);
        } else {
          setMessages([...messages, data]);
        }
        setNewMsg(true);
      }
    });
  }, [messages, user]);

  useEffect(() => {
    const chatBody = document.querySelector("#chat-body");
    if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
  }, [messages, messageInput]);

  function ChatWindowHeader() {
    return (
      <div id="chat-header">
        {!windowOpen && <div className={`chat-${newMsg ? 'red' : 'green'}-circle`}><i className="fa-solid fa-circle"></i></div>}
        <p id="chat-title">Meetup General Chat</p>
        <i id="minimize" onClick={() => {
          if (windowOpen) setNewMsg(false);
          setWindowOpen(!windowOpen);
        }}
          className="fa-solid fa-window-maximize"></i>
      </div>
    );
  }

  function ChatWindowBody() {
    return (
      <div id="chat-body">
        <ul>
          {messages.map((m, i) => (
            <li key={i} className="chat-box">
              <div className={`chat-message ${user.id === m.sender.id ? "me" : ""}`}>
                {user.id !== m.sender.id && <div><img src={getProfileImageUrl(m.sender.profileImageUrl)} alt="avatar" /></div>}
                <div className="message-wrapper" onClick={e => e.target.children[1]?.classList.toggle("hidden")}>
                  <div onClick={e => e.target.parentElement.children[1]?.classList.toggle("hidden")}>{m.message}</div>
                  <div onClick={e => e.target.parentElement.children[1]?.classList.add("hidden")} className="message-time hidden">{formattedDate(m.at)} at {formattedTime(m.at)}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <>
      {!windowOpen && <div id="chat-window" className="fake" style={{ width: 'auto', height: 'auto' }}><ChatWindowHeader /></div>}
      <div id="chat-window" className="real" style={{ display: `${windowOpen ? '' : 'none'}` }}>
        <ChatWindowHeader />
        <ChatWindowBody />
        <div id="chat-footer">
          <form onSubmit={handleSubmit}>
            <input placeholder="Aa" className="chat-input" value={messageInput} onChange={e => setMessageInput(e.target.value)} type="text" autoComplete='false' />
          </form>
        </div>
      </div>
    </>
  );
}

export default ChatWindow;
