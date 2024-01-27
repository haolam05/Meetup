import { useNavigate } from 'react-router-dom';
import "./BackButton.css";

function BackButton({ url, btnText = url.slice(1) }) {
  const navigate = useNavigate();

  const addBackBtnText = () => {
    const span = document.createElement('span');
    span.innerText = btnText[0].toUpperCase() + btnText.slice(1).toLowerCase();
    document.querySelector('#back-to-list').appendChild(span);
  }

  const removeBackBtnText = () => {
    document.querySelector('#back-to-list>span').remove();
  }

  return (
    <button
      id="back-to-list"
      onMouseOver={addBackBtnText}
      onMouseOut={removeBackBtnText}
      onClick={() => navigate(url, { replace: true })}
    >
      <i className="fa-sharp fa-solid fa-arrow-left"></i>
    </button>
  );
}

export default BackButton;
