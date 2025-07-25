import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";
import { Appointment, AppointmentState } from "@/types/appointment";
import { axiosInstance } from "@/lib/axios";

const initialState: AppointmentState = {
  appointments: [],
  fetched: false,
};

const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    addAppointment: (state, action: PayloadAction<Appointment>) => {
      state.appointments.push(action.payload);
    },
    addAppointmentArray: (state, action) => {
      state.appointments = action.payload;
    },
    clearAppointments: (state) => {
      state.appointments = [];
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchAppointments.fulfilled, (state, action) => {
      if (Array.isArray(action.payload)) {
        state.appointments = action.payload;
        state.fetched = true;
      } else {
        state.appointments = [];
      }
    });
  },
});

export const selectAllAppointments = (state: RootState) =>
  state.appointment.appointments;

export const fetchAppointments = createAsyncThunk(
  "appointment/fetchAppointments",
  async (url: string) => {
    try {
      const response = await axiosInstance.get(url);
      return response.data as Appointment[];
    } catch (err) {
      if (err instanceof Error)
        return err.message || "Failed to fetch appointments";
      return "Failed to fetch appointments";
    }
  }
);

export const { addAppointment, addAppointmentArray, clearAppointments } =
  appointmentSlice.actions;

export default appointmentSlice.reducer;
