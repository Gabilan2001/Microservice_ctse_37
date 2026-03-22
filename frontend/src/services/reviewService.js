import axios from "axios";
import { reviewApiUrl } from "../config/apiConfig";
import { getAuthHeaders } from "./authStorage";

const API_URL = reviewApiUrl;

export const getReviews = async (eventId) => {
  return await axios.get(API_URL, { params: { eventId } });
};

export const createReview = async (reviewData) => {
  return await axios.post(API_URL, reviewData, {
    headers: {
      ...getAuthHeaders(),
    },
  });
};

export const deleteReview = async (id) => {
  return await axios.delete(`${API_URL}/${id}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
};
