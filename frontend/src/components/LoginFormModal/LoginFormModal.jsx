import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './LoginForm.css';

function LoginFormPage() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async e => {
    e.preventDefault();

    const data = await dispatch(
      sessionActions.login({
        credential,
        password
      })
    );

    if (data?.errors) {
      setErrors({ credential: "The provided credentials were invalid" });
    } else {
      closeModal();
    }
  };

  const inputIsValid = () => credential.length < 4 || password.length < 6;

  const signInAsDemoUser = e => {
    setCredential("demo@user.io");
    setPassword("password");
    handleSubmit(e);
  }

  return (
    <>
      <h1 className="subheading">Log in</h1>
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
          className={`btn-primary ${inputIsValid() ? '' : 'enabled'}`}
          type="submit"
          disabled={inputIsValid()}
        >
          Log in
        </button>
        <a type="submit" onClick={signInAsDemoUser}>Login in as Demo User</a>
      </form>
    </>
  );
}

export default LoginFormPage;
