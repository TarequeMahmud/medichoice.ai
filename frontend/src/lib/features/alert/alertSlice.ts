import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum AlertType {
  Success = "success",
  Error = "error",
}

export interface Alert {
  message: string;
  type: AlertType | "";
}

const initialState: Alert = {
  message: "",
  type: "",
};

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    showAlert: (state, action: PayloadAction<Alert>) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    clearAlert: (state) => {
      state.message = "";
      state.type = "";
    },
  },
});

export const { showAlert, clearAlert } = alertSlice.actions;

export default alertSlice.reducer;
