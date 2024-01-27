import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { disabledSubmitButton, enabledSubmitButton } from '../../utils/dom';
import { inValidImage } from '../../utils/errorChecker';
import { updateFile } from '../../utils/images';
import * as sessionActions from '../../store/session';

function EditUserForm({ user }) {
  const dispatch = useDispatch();
  const [image, setImage] = useState(user.profileImageUrl);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { setModalContent } = useModal();

  const handleSubmit = async e => {
    e.preventDefault();
    disabledSubmitButton();

    if (inValidImage(setErrors, image)) return;

    const data = await dispatch(
      sessionActions.updateUser({
        email: user.email,
        username: user.username,
        firstName,
        lastName,
        password,
        image
      })
    );

    if (data?.errors) {
      enabledSubmitButton();
      setErrors({ password: "The provided credentials were invalid" });
    } else {
      setModalContent(<h2 className="subheading alert-success">Successully Updated!</h2>);
    }
  };

  const inputIsInValid = () => {
    return (
      !firstName.length ||
      !lastName.length ||
      password.length < 6
    );
  }

  return (
    <>
      <h2 className="subheading">Edit Profile</h2>
      <form id="signup-form" onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="text"
          value={user.email}
          disabled
        />
        <label>Username</label>
        <input
          type="text"
          value={user.username}
          disabled
        />
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
        <label>Avatar</label>
        <input type="file" onChange={e => updateFile(e, setImage)} />
        {errors.image && <p className="error-message">{errors.image}</p>}
        <button
          className={`btn-primary ${inputIsInValid() ? '' : 'enabled'}`}
          type="submit"
          disabled={inputIsInValid()}
        >
          Update
        </button>
      </form>
    </>
  );
}

export default EditUserForm;
