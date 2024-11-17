import { API } from "../../config/index.";

export const RegisterApi = async (data) => {
  const response = await API.post("/users", data);
  return response?.data;
};
export const VerifyApi = async (data) => {
  const response = await API.post("/auth/otp/verify", data);
  return response?.data;
};
export const LoginApi = async (data) => {
  const response = await API.post("/auth/user/login", data);
  return response?.data;
};
