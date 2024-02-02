import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import MembershipStatus from "../MembershipStatus";
import Loading from "../Loading";
import Member from "../Member";
import * as sessionActions from "../../store/session";
import * as groupActions from "../../store/group";
import "./GroupMembers.css";

function GroupMembers() {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const user = useSelector(sessionActions.sessionUser);
  const group = useSelector(groupActions.getGroupById(groupId));
  const members = useSelector(groupActions.getGroupMembers(groupId));
  const [isLoaded, setIsLoaded] = useState(false);


  const getStatus = () => {
    if (user) {
      if (group.organizerId === user.id) return "owner";
      const member = group.members.find(member => member.id === user.id);
      if (!member) return "stranger";
      if (member.Membership.status === 'co-host') return 'co-host';
      if (member.Membership.status === 'member') return 'member';
    }
    return false;
  }

  function MembershipHeader() {
    return <h1 className="heading membership">Memberships <MembershipStatus user={user} group={group} /></h1>;
  }

  function PendingMembershipHeader() {
    if (pendingMembers.length) return <h2 className="subheading membership">Pending ({pendingMembers.length})</h2>;
  }

  function RealMembershipHeader() {
    if (realMembers.length) return <h2 className="subheading membership">Members ({realMembers.length})</h2>;
  }

  function PendingMembers() {
    if (pendingMembers.length) return pendingMembers.map(m => <Member member={m} status={getStatus()} key={m.id} />);
  }

  function RealMembers() {
    if (realMembers.length) return realMembers.map(m => <Member member={m} status={getStatus()} key={m.id} />);
  }

  function NoMembers() {
    if (!members.length) return <h2 className="subheading membership">There isn&apos;t any members for this group.</h2>
  }

  useEffect(() => {
    const loadInfo = async () => {
      await dispatch(sessionActions.restoreSession());
      await dispatch(groupActions.loadGroupDetails(groupId));
      await dispatch(groupActions.loadGroupMembers(groupId));
      setIsLoaded(true);
    }
    loadInfo();
  }, [dispatch, groupId]);

  if (!isLoaded) return <Loading />;

  const pendingMembers = members.filter(m => m.Membership.status === 'pending');
  const realMembers = members.filter(m => m.Membership.status !== 'pending');

  return (
    <div id="lists-container">
      <div id="lists">
        <MembershipHeader />
        <h2 className="subheading membership-group">{group.name}</h2>
        <PendingMembershipHeader />
        <div className="membership-container"><PendingMembers /></div>
        <RealMembershipHeader />
        <div className="membership-container"><RealMembers /></div>
        <NoMembers />
      </div>
    </div>
  );
}

export default GroupMembers;
