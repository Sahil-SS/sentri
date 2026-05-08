import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const sendVitals = async (payload) => {
  try {
    await axios.post(`${API_URL}/vitals`, payload);
  } catch (error) {
    console.error("Failed to send vitals", error.message);
  }
};