import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { disabledSubmitButton, enabledSubmitButton } from "../../utils/dom";
import { csrfFetch } from "../../store/csrf";
import * as groupActions from "../../store/group";
import "./VenueFormModal.css";

function VenueFormModal({ venue, groupId, apiKey }) {
  const dispatch = useDispatch();
  const { setModalContent } = useModal();
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = async e => {
    e.preventDefault();
    disabledSubmitButton();

    const payload = {
      ...venue,
      address,
      city,
      state
    }

    const data = await dispatch(groupActions.createVenue(groupId, apiKey, payload));
    if (data?.errors) {
      enabledSubmitButton();
      if (data.errors?.message) return setModalContent(<h2 className="subheading modal-errors">{data.errors.message}</h2>)
      return setErrors({ ...data.errors });
    }
    setModalContent(<h2 className="subheading alert-success">Successfully Created Venue!</h2>)
    setTimeout(() => window.location.reload(), 1000);
  }

  const inputIsInValid = () => {
    return (
      !address.length ||
      !city.length ||
      !state.length
    )
  }

  return (
    <form id="venue-form" onSubmit={handleSubmit}>
      <label htmlFor="address">Address</label>
      <input type="text" value={address} onChange={e => setAddress(e.target.value)} />
      {errors.address && <p className="error-message">{errors.address}</p>}
      <label htmlFor="city">City</label>
      <input type="text" value={city} onChange={e => setCity(e.target.value)} />
      {errors.city && <p className="error-message">{errors.city}</p>}
      <label htmlFor="state">State</label>
      <input type="text" value={state} onChange={e => setState(e.target.value)} />
      {errors.state && <p className="error-message">{errors.state}</p>}
      <button
        type="submit"
        className={`btn-primary ${inputIsInValid() ? 'disabled' : 'enabled'}`}
        disabled={inputIsInValid()}
      >
        Create Venue
      </button>
    </form>
  );
}

export default VenueFormModal;
