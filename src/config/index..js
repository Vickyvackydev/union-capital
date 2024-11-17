import axios from "axios";
import { QueryClient } from "react-query";

import { Store } from "../state/store";

export const API = axios.create({
  baseURL: "https://ugc-api-production.up.railway.app",
});

API.defaults.headers.common.Accept = "application/json";
API.defaults.headers.common["Content-Type"] = "application/json";

//  request interceptor
API.interceptors.request.use(
  async (config) => {
    const { token } = Store.getState().auths;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Store.dispatch(reset()); // Clear token using Redux action
      // restore initial auth state
      // window.location.href = "/login";
    }
    throw error;
  }
);

// Create a QueryClient instance
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const response = await API.get(queryKey[0]);
        return response.data;
      },
    },
  },
});
