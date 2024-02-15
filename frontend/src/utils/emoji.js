import { csrfFetch } from "../store/csrf"

export const getEmojis = async () => {
  const response = await csrfFetch("/api/messages/message-icons");
  const emojis = await response.json();
  if (emojis.message) return;
  return emojis;
}
