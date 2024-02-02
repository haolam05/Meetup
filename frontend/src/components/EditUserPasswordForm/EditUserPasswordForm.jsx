import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { useNavigate } from 'react-router-dom';
import { disabledSubmitButton, enabledSubmitButton } from '../../utils/dom';
import * as sessionActions from '../../store/session';

function EditUserPasswordForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { setModalContent } = useModal();

  const handleSubmit = async e => {
    e.preventDefault();
    disabledSubmitButton();

    if (newPassword !== confirmNewPassword) {
      enabledSubmitButton();
      return setErrors({ confirmNewPassword: "Confirm Password field must be the same as the Password field" });
    }

    const data = await dispatch(
      sessionActions.updateUserPassword({
        password,
        newPassword
      })
    );

    if (data?.errors) {
      enabledSubmitButton();
      setErrors({ password: data.errors.message });
    } else {
      setModalContent(<h2 className="subheading alert-success">Successully Updated! Please log in again.</h2>);
      navigate("/", { replace: true });
    }
  };

  const inputIsInValid = () => {
    return (
      password.length < 6 ||
      newPassword.length < 6 ||
      confirmNewPassword.length < 6
    );
  }

  return (
    <>
      <h2 className="subheading">Edit Password</h2>
      <form id="signup-form" onSubmit={handleSubmit}>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {errors.password && <p className="error-message">{errors.password}</p>}
        <label>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
        />
        {errors.newPassword && <p className="error-message">{errors.newPassword}</p>}
        <label>Confirm New Password</label>
        <input
          type="password"
          value={confirmNewPassword}
          onChange={e => setConfirmNewPassword(e.target.value)}
          required
        />
        {errors.confirmNewPassword && <p className="error-message">{errors.confirmNewPassword}</p>}
        <button
          className={`btn-primary ${inputIsInValid() ? 'disabled' : 'enabled'}`}
          type="submit"
          disabled={inputIsInValid()}
        >
          Update
        </button>
      </form>
    </>
  );
}


export default EditUserPasswordForm;
