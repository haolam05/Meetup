import { useModal } from '../../context/Modal';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import { getProfileImageUrl } from '../../utils/images';
import * as sessionActions from '../../store/session';
import * as groupActions from '../../store/group';
import * as eventActions from '../../store/event';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';

function ProfileButton({ user }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const { setModalContent } = useModal();

  const toggleMenu = e => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  }

  const closeMenu = () => setShowMenu(false);

  const logout = async e => {
    e.preventDefault();
    await dispatch(sessionActions.logout());
    await dispatch(groupActions.resetUserGroups());
    await dispatch(eventActions.resetUserEvents());
    closeMenu();
    setModalContent(<h2 className="subheading alert-success">Successully Logged Out!</h2>)
    navigate("/", { replace: true });
  }

  useEffect(() => {
    if (showMenu) {
      const closeMenu = e => {
        if (ulRef.current && !ulRef.current.contains(e.target)) {
          setShowMenu(false);
        }
      }

      document.addEventListener('click', closeMenu);
      return () => document.removeEventListener('click', closeMenu);
    }
  }, [showMenu]);

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <div id="profile-btns">
      {user ? (
        <div id="userMenu" className="avatar" onClick={toggleMenu}>
          <img src={getProfileImageUrl(user.profileImageUrl)} alt="avatar" />
        </div>
      ) : (
        <button id="userMenu" onClick={toggleMenu}>
          <i className="fas fa-user-circle" />
        </button>
      )}
      <ul className={ulClassName} ref={ulRef}>
        {user && (
          <>
            <li className="greet-user">
              <button className="btn-accent">Hello, {user.firstName}</button>
            </li>
            <li className="greet-user">
              <button className="btn-accent">{user.email}</button>
            </li>
            <li className="user-profile">
              <button className="btn-accent" onClick={() => navigate("/me")}>Your Profile</button>
            </li>
            <li className="user-profile">
              <button className="btn-accent" onClick={() => navigate("groups/current")}>Your groups</button>
            </li>
            <li className="user-profile">
              <button className="btn-accent" onClick={() => navigate("events/current")}>Your events</button>
            </li>
          </>
        )}
        <li>
          <button className="btn-accent" onClick={() => navigate("groups", { replace: true })}>View groups</button>
        </li>
        <li>
          <button className="btn-accent" onClick={() => navigate("events", { replace: true })}>View events</button>
        </li>
        {
          user ? (<>
            <li className="logout-btn">
              <button className="btn-accent" onClick={logout}>Log Out</button>
            </li>
          </>
          ) : (
            <>
              <li>
                <OpenModalButton
                  buttonText="Log In"
                  onButtonClick={closeMenu}
                  modalComponent={<LoginFormModal />}
                />
              </li>
              <li>
                <OpenModalButton
                  buttonText="Sign Up"
                  onButtonClick={closeMenu}
                  modalComponent={<SignupFormModal />}
                />
              </li>
            </>
          )
        }
      </ul>
    </div>
  );
}

export default ProfileButton;
