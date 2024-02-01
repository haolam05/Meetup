function AttendanceStatusModal() {
  return (
    <>
      <h2 className="subheading">Attendance status</h2>
      <div className="label-breakdown">
        <div className="label-icons">
          <span className="owner"><i className="fa-solid fa-square-check"></i></span>
          <span className="co-host"> <i className="fa-solid fa-square-check"></i></span>
          <span className="member"> <i className="fa-solid fa-square-check"></i></span>
        </div>
        <div className="label-text">
          <div>Host</div>
          <div>Co-host</div>
          <div>Attendee</div>
        </div>
      </div>
    </>
  );
}

export default AttendanceStatusModal;
