import { useModal } from "../../context/Modal";

function PendingBtn() {
  const { setModalContent } = useModal();

  return <button id="group-join-btn" className="btn-accent" onClick={() => setModalContent(<div>
    <h2 className="subheading alert-success">Your request will be reviewed shortly!</h2>
  </div>)}>Pending</button>;
}

export default PendingBtn;
