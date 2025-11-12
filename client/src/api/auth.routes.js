
import axiosNoAuth from "../axios/axiosNoAuth";

export const loginUser = async (credentials) => {
  try {
    const response = await axiosNoAuth.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error("Error logging in user:", error);
    return error.response?.data;
  }
};