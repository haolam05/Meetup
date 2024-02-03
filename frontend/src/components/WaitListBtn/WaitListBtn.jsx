import { useModal } from "../../context/Modal";

function WaitListBtn() {
  const { setModalContent } = useModal();

  return <button id="group-join-btn" className="btn-accent" onClick={() => setModalContent(<div>
    <h2 className="subheading alert-success">You are on the waitlist!</h2>
  </div>)}>Waitlist</button>;
}

export default WaitListBtn;
