import axios from "axios";
import { reviewApiUrl } from "../config/apiConfig";
import { getAuthHeaders } from "./authStorage";

const API_URL = reviewApiUrl;

export const getReviews = async (eventId) => {
  const params = {
    _t: Date.now(),
  };

  if (eventId) {
    params.eventId = eventId;
  }

  return await axios.get(API_URL, {
    params,
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
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
