import axios from "axios";

const API_URL = "http://localhost:5001/api/events";

export const getEvents = async () => {
  return await axios.get(API_URL);
};

export const createEvent = async (eventData) => {
  return await axios.post(API_URL, eventData);
};

export const deleteEvent = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
};
