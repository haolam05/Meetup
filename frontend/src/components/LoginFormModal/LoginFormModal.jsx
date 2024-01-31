import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { disabledSubmitButton, enabledSubmitButton } from '../../utils/dom';
import * as sessionActions from '../../store/session';
import "./LoginFormModal.css";

function LoginFormPage() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { setModalContent } = useModal();

  const handleSubmit = async (e, loginAsDemoUser) => {
    e.preventDefault();
    disabledSubmitButton();

    const data = await dispatch(
      sessionActions.login({
        credential: loginAsDemoUser ? "luffy@user.io" : credential,
        password: loginAsDemoUser ? "luffyPassword" : password
      })
    );

    if (data?.errors) {
      enabledSubmitButton();
      setErrors({ credential: "The provided credentials were invalid" });
    } else {
      setModalContent(<h2 className="subheading alert-success">Successully Logged In!</h2>)
    }
  };

  const inputIsInValid = () => credential.length < 4 || password.length < 6;

  return (
    <>
      <h2 className="subheading">Log in</h2>
      <form id="login-form" onSubmit={handleSubmit}>
        <label>Username or Email</label>
        <input
          type="text"
          value={credential}
          onChange={e => setCredential(e.target.value)}
          required
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {errors.credential && <p className="error-message">{errors.credential}</p>}
        <button
          className={`btn-primary ${inputIsInValid() ? 'disabled' : 'enabled'}`}
          type="submit"
          disabled={inputIsInValid()}
        >
          Log in
        </button>
        <div id="login-form-links">
          <a type="submit" onClick={() => alert("Feature coming soon")}>
            Forgot password?
          </a>
          <a type="submit" onClick={e => handleSubmit(e, true)}>
            Login in as Demo User
          </a>
        </div>
      </form>
    </>
  );
}

export default LoginFormPage;
