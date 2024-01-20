import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as sessionActions from '../../store/session';
import './LandingPage.css';

function LandingPage() {
  const user = useSelector(sessionActions.sessionUser);

  return (
    <div id="landing-page">
      <section id="section-1">
        <div id="intro">
          <h1 id="intro-title" className="heading">
            The people platform—Where interests become friendships
          </h1>
          <p id="intro-text">
            Whatever your interest, from hiking and reading to networking and skill sharing, there are thousands of people who share it on Meetup. Events are happening every day—sign up to join the fun.
          </p>
        </div>
        <div id="infographic">
          <img src="./images/meeting.png" alt="meeting" />
        </div>
      </section>
      <section id="section-2">
        <h2 id="sub-title" className="subheading">
          How Meetup works
        </h2>
        <p id="caption">See all groups | Find an event | Start a new group</p>
      </section>
      <section id="section-3">
        <div id="see-all-groups">
          <img src="./images/hands.png" alt="hands" />
          <Link to="groups" className="enabled">See all groups</Link>
          <p>Join a group and make new friends!</p>
        </div>
        <div id="find-an-event">
          <img src="./images/events.png" alt="events" />
          <Link to="#" className="enabled">Find an event</Link>
          <p>Enjoy doing something fun with your friends!</p>
        </div>
        <div id="start-a-group">
          <img src="./images/friends.png" alt="friends" />
          <Link to="#" className={user ? "enabled" : "disabled"}>Start a group</Link>
          <p>Create your own group and invite your friends to join!</p>
        </div>
      </section>
      <section id="section-4">
        <button>Join Meetup</button>
      </section>
    </div>
  );
}

export default LandingPage;
