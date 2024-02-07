import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation() {
  const sessionUser = useSelector(state => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <ProfileButton user={sessionUser} />
    );
  } else {
    sessionLinks = (
      <>
        <NavLink to="/signup">Sign Up</NavLink>
        <NavLink to="/login">Log In</NavLink>
      </>
    );
  }

  return (
    <header className="site-header">
      <NavLink to="/" className="nav-title">
        <h1>BenchBnB (MC)</h1>
      </NavLink>
      <div className="session-links">
        {sessionLinks}
      </div>
    </header>
  );
}

export default Navigation;
