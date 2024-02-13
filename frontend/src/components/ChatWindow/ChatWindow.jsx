import { useEffect, useState } from "react";
import { getProfileImageUrl } from "../../utils/images";
import { sendGeneralMsg } from "../../utils/socket";
import { formattedDate, formattedTime } from "../../utils/dateFormatter";
import "./ChatWindow.css"

function ChatWindow({ user, socket }) {
  const [windowOpen, setWindowOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    const inputMessage = document.querySelector('.chat-input');
    await sendGeneralMsg(inputMessage.value);
    inputMessage.value = "";
  }

  useEffect(() => {
    const cb = data => {
      setMessages(prev => [...prev, data]);
      setNewMsg(true);
    }

    socket.on('connect_error', () => setTimeout(() => socket.connect(), 5000));
    socket.on('new_general_message', cb);
    return () => socket.off('new_general_message', cb);
  }, [socket]);

  useEffect(() => {
    const chatBody = document.querySelector("#chat-body");
    if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
  }, [messages]);

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

  function Avatar({ url, indexes, index }) {
    if (!indexes.has(index)) {
      return <div><img className="hidden" /></div>;
    }
    return <div><img src={getProfileImageUrl(url)} alt="avatar" /></div>;
  }

  function ChatWindowBody() {
    const avatarIndexes = new Set();
    console.log(messages);
    let i = 0;
    while (i < messages.length - 1) {
      let currSenderId = true;
      let nextSenderId = true;

      avatarIndexes.add(i);
      while (currSenderId == nextSenderId) {
        if (i + 1 >= messages.length) break;
        currSenderId = messages[i].sender.id;
        nextSenderId = messages[i + 1].sender.id;
        i++;
      }
      if (currSenderId !== nextSenderId) avatarIndexes.add(i);
      console.log(i)
      i++;
    }
    if (messages.length === 1 || (messages[i - 1]?.sender.id !== messages[i]?.sender.id)) avatarIndexes.add(i);
    console.log(avatarIndexes)
    return (
      <div id="chat-body">
        <ul>
          {messages.map((m, i) => (
            <li key={i} className="chat-box">
              <div className={`chat-message ${user.id === m.sender.id ? "me" : ""}`}>
                {user.id !== m.sender.id && <Avatar url={m.sender.profileImageUrl} indexes={avatarIndexes} index={i} />}
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
            <input placeholder="Aa" className="chat-input" type="text" autoComplete='false' />
          </form>
        </div>
      </div>
    </>
  );
}

export default ChatWindow;
