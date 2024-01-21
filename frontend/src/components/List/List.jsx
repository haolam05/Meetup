import Groups from "../Groups";
import "./List.css";

function List({ list }) {
  return (
    <div id="lists-container">
      <ul id="lists">
        <li id="list-headers">
          <h1 className="heading">
            <a id="header-event">Events</a>
            <a id="header-group">Groups</a>
          </h1>
        </li>
        <li id="caption">Groups in Meetup</li>
        {list === "Groups" && <Groups />}
      </ul>
    </div >
  );
}

export default List;
