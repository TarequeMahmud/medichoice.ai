import { configureStore } from "@reduxjs/toolkit";
import appointmentReducer from "./features/appointment/appointmentSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      appointment: appointmentReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
