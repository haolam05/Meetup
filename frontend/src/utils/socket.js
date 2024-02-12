import { csrfFetch } from "../store/csrf";

export const choosePort = () => {
  return import.meta.env.MODE === 'development' ? 'http://localhost:8000' : 'https://meetup-tzx9.onrender.com';
}

export const sendGeneralMsg = async messageInput => {
  await csrfFetch(`/api/messages/general`, {
    method: 'POST',
    body: JSON.stringify({
      message: messageInput
    })
  });
}
