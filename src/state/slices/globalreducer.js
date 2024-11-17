/* eslint-disable import/no-cycle */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  data: {},
};

export const GlobalSlice = createSlice({
  initialState,
  name: "globalstate",
  reducers: {
    setSelectedPlanData: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setSelectedPlanData } = GlobalSlice.actions;

export const selectPlan = (state) => state.globalstate.data;

export const globalReducer = GlobalSlice.reducer;
