import { configureStore } from "@reduxjs/toolkit";
import appointmentReducer from "./features/appointment/appointmentSlice";
import alertReducer from "./features/alert/alertSlice";

export const store = configureStore({
  reducer: {
    appointment: appointmentReducer,
    alert: alertReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
