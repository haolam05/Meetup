import Groups from "../Groups";
import "./List.css";

function List({ list }) {
  return (
    <div id="lists-container">
      <ul id="lists">
        <li id="list-headers">
          <h1 className="heading">
            <a id={`${list === "Events" ? "selected" : "unselected"}`}>Events</a>
            <a id={`${list === "Groups" ? "selected" : "unselected"}`}>Groups</a>
          </h1>
        </li>
        <li id="caption">{list} in Meetup</li>
        {list === "Groups" && <Groups />}
      </ul>
    </div >
  );
}

export default List;
