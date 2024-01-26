import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { disabledSubmitButton, enabledSubmitButton } from '../../utils/dom';
import { inValidImage, invalidPassword } from '../../utils/errorChecker';
import * as sessionActions from '../../store/session';

function SignupFormPage() {
  const dispatch = useDispatch();
  const [image, setImage] = useState(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async e => {
    e.preventDefault();
    disabledSubmitButton();

    if (inValidImage(setErrors, image)) return;
    if (invalidPassword(setErrors, password, confirmPassword)) return;

    const data = await dispatch(
      sessionActions.signup({
        email,
        username,
        firstName,
        lastName,
        password,
        image
      })
    );

    if (data?.errors) {
      enabledSubmitButton();
      setErrors(data.errors);
    } else {
      closeModal();
    }
  };

  const inputIsInValid = () => {
    return (
      !email.length ||
      username.length < 4 ||
      !firstName.length ||
      !lastName.length ||
      password.length < 6 ||
      !confirmPassword.length
    );
  }

  const updateFile = e => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  return (
    <>
      <h2 className="subheading">Sign Up</h2>
      <form id="signup-form" onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="text"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        {errors.email && <p className="error-message">{errors.email}</p>}
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        {errors.username && <p className="error-message">{errors.username}</p>}
        <label>First Name</label>
        <input
          type="text"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          required
        />
        {errors.firstName && <p className="error-message">{errors.firstName}</p>}
        <label>Last Name</label>
        <input
          type="text"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          required
        />
        {errors.lastName && <p className="error-message">{errors.lastName}</p>}
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {errors.password && <p className="error-message">{errors.password}</p>}
        <label>Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
        />
        {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
        <label>Avatar</label>
        <input type="file" onChange={updateFile} />
        {errors.image && <p className="error-message">{errors.image}</p>}
        <button
          className={`btn-primary ${inputIsInValid() ? '' : 'enabled'}`}
          type="submit"
          disabled={inputIsInValid()}
        >
          Sign Up
        </button>
      </form>
    </>
  );
}

export default SignupFormPage;
