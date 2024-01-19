import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import * as sessionActions from '../../store/session';
import './Navigation.css';


function Navigation({ isLoaded }) {
  const sessionUser = useSelector(sessionActions.sessionUser);

  return (
    <ul>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      {
        isLoaded && (
          <li>
            <ProfileButton user={sessionUser} />
          </li>
        )
      }
    </ul>
  );
}

export default Navigation;
