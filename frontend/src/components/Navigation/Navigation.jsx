import { NavLink, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import Loading from '../Loading';
import * as sessionActions from '../../store/session';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(sessionActions.sessionUser);

  return (
    <ul id="header">
      <li>
        <NavLink to="/"><img src="/images/logo.png" alt="logo" /></NavLink>
      </li>
      {!isLoaded && <li><Loading /></li>}
      <li id="header-right-section">
        {isLoaded &&
          <>
            {sessionUser && <Link to="/groups/new">Start a new group</Link>}
            <ProfileButton user={sessionUser} />
          </>
        }
      </li>
    </ul>
  );
}

export default Navigation;
