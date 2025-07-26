import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export const authorizedUser = async () => {
  try {
    const response = await axios.get("/api/me", {
      withCredentials: true,
    });
    return response.data.user;
  } catch (error) {
    console.error("Error checking user validity:", error);
    return false;
  }
};
