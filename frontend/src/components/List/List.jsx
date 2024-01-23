import { Link } from "react-router-dom";
import Groups from "../Groups";
import Events from "../Events";
import ManageGroups from "../ManageGroups";
import "./List.css";

function List({ list, title = "" }) {
  return (
    <div id="lists-container">
      <ul id="lists">
        <li id="list-headers">
          <h1 className="heading">
            {(list === "Events" || list === "Groups") && (<>
              <Link to="/events" id={`${list === "Events" ? "selected" : "unselected"}`}>Events</Link>
              <Link to="/groups" id={`${list === "Groups" ? "selected" : "unselected"}`}>Groups</Link>
            </>)}
            {list === "Manage Groups" && list}
          </h1>
        </li>
        <li id="caption">{title ? title : list} in Meetup</li>
        {list === "Groups" && <Groups />}
        {list === "Events" && <Events />}
        {list === "Manage Groups" && <ManageGroups />}
      </ul>
    </div >
  );
}

export default List;
