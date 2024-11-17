/* eslint-disable import/no-cycle */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  refreshToken: "",
  role: "",
  globalLoading: false,
};

export const AuthSlice = createSlice({
  initialState,
  name: "auths",
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },
    reset: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setUser, setToken, reset, setRefreshToken, setRole, setGlobalLoading } = AuthSlice.actions;

export const selectUser = (state) => state.auths.user;
export const selectToken = (state) => state.auths.token;
export const globalLoading = (state) => state.auths.globalLoading;
export const selectRefreshToken = (state) => state.auths.refreshToken;
export const selectRole = (state) => state.auths.role;

export const authReducer = AuthSlice.reducer;
