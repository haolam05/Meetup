import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = e => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  }

  const closeMenu = () => setShowMenu(false);

  const logout = e => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
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
    <li id="profile-btns">
      <button id="userMenu" onClick={toggleMenu}>
        <i className="fas fa-user-circle" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {
          user ? (
            <>
              <li>{user.username}</li>
              <li>{user.firstName} {user.lastName}</li>
              <li>{user.email}</li>
              <li>
                <button onClick={logout}>Log Out</button>
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
    </li>
  );
}

export default ProfileButton;