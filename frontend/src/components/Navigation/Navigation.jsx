import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import * as sessionActions from '../../store/session';
import './Navigation.css';


function Navigation({ isLoaded }) {
  const sessionUser = useSelector(sessionActions.sessionUser);

  return (
    <ul id="header">
      <li>
        <NavLink to="/"><img src="/images/logo.png" alt="logo" /></NavLink>
      </li>
      {isLoaded && <ProfileButton user={sessionUser} />}
    </ul>
  );
}

export default Navigation;
