import Groups from "../Groups";
import Events from "../Events";
import "./List.css";
import { Link } from "react-router-dom";

function List({ list }) {
  return (
    <div id="lists-container">
      <ul id="lists">
        <li id="list-headers">
          <h1 className="heading">
            <Link to="/events" id={`${list === "Events" ? "selected" : "unselected"}`}>Events</Link>
            <Link to="/groups" id={`${list === "Groups" ? "selected" : "unselected"}`}>Groups</Link>
          </h1>
        </li>
        <li id="caption">{list} in Meetup</li>
        {list === "Groups" && <Groups />}
        {list === "Events" && <Events />}
      </ul>
    </div >
  );
}

export default List;
