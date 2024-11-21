/* eslint-disable import/no-cycle */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  data: {},
  password: "",
};

export const GlobalSlice = createSlice({
  initialState,
  name: "globalstate",
  reducers: {
    setSelectedPlanData: (state, action) => {
      state.data = action.payload;
    },
    setTransferPassCode: (state, action) => {
      state.password = action.payload;
    },
  },
});

export const { setSelectedPlanData, setTransferPassCode } = GlobalSlice.actions;

export const selectPlan = (state) => state.globalstate.data;
export const transferCode = (state) => state.globalstate.password;

export const globalReducer = GlobalSlice.reducer;
