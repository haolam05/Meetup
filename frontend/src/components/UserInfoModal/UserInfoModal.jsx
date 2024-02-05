import "./UserInfoModal.css";

function UserInfoModal({ user }) {
  console.log(user)
  return (
    <div className="user-info-wrapper">
      <h2 className="subheading">User Information</h2>
      <div className="user-info-details">
        <div>
          <img src={user.profileImageUrl} alt="avatar" />
        </div>
        <div>
          <div className="user-info">
            <div className="user-info-title">
              <div>First name</div>
              <div>Last name</div>
              <div>Email</div>
            </div>
            <div className="user-info-text">
              <div>{user.firstName}</div>
              <div>{user.lastName}</div>
              <div>{user.email}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserInfoModal;
