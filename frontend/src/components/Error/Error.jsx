import "./Error.css";

function Error({ title, message }) {
  return (
    <div id="error-container">
      <div id="error-header">
        <h1 className="heading">{title}</h1>
        <div id="error-icon"><i className="fa-regular fa-face-frown"></i></div>
      </div>
      <h2 id="error-message" className="subheading">{message}</h2>
    </div>
  );
}

export default Error;
