import { io } from 'socket.io-client'
import { useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { choosePort } from '../../utils/socket';
import ProfileButton from './ProfileButton';
import Loading from '../Loading';
import ChatWindow from '../ChatWindow';
import * as sessionActions from '../../store/session';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(sessionActions.sessionUser);

  useEffect(() => {
    const setNotification = (notification, msg) => {
      notification.innerText = `⭐ ${msg} ⭐\n`;
      notification.classList.remove("hidden");
    }

    const registerNotification = data => {
      const notification = document.querySelector("#notification");
      setNotification(notification, data.msg);
    };

    const notify = data => sessionUser && sessionUser.id !== data.userId && registerNotification(data);
    const notifyMembership = data => sessionUser && data.userIds.includes(sessionUser.id) && registerNotification(data);
    const socket = io(choosePort());
    socket.on('connect_error', () => setTimeout(() => socket.connect(), 5000));
    socket.on('data_change', notify);
    socket.on('membership', notifyMembership);
  }, [sessionUser]);

  return (
    <ul id="header">
      <li>
        <NavLink to="/"><img src="/images/logo.png" alt="logo" /></NavLink>
      </li>
      {!isLoaded && <li><Loading /></li>}
      <div id="notification" className="hidden" onClick={() => window.location.reload()}></div>
      {sessionUser && <ChatWindow user={sessionUser} />}
      <li id="header-right-section">
        {isLoaded &&
          <>
            {sessionUser && <Link to="/groups/new">Start a new group</Link>}
            <ProfileButton user={sessionUser} />
          </>
        }
      </li>
    </ul >
  );
}

export default Navigation;
