import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import * as sessionActions from '../../store/session';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';

function ProfileButton({ user }) {
  const navigate = useNavigate();
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
      <button id="userMenu" onClick={toggleMenu}>
        <i className="fas fa-user-circle" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user && (
          <>
            <li className="greet-user">
              <button className="btn-accent">Hello, {user.firstName}</button>
            </li>
            <li className="greet-user">
              <button className="btn-accent">{user.email}</button>
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
            <li>
              <button className="btn-accent" onClick={() => alert("Feature coming soon")}>Your groups</button>
            </li>
            <li>
              <button className="btn-accent" onClick={() => alert("Feature coming soon")}>Your events</button>
            </li>
            <li>
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
