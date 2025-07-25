import { tryCatch } from "./utils";
import { axiosInstance } from "./axios";
import { Appointment, AppointmentButtonAction } from "@/types/appointment";
import { store } from "@/lib/store";
import { AlertType, showAlert } from "@/lib/features/alert/alertSlice";
import { addAppointmentArray } from "@/lib/features/appointment/appointmentSlice";

export class AppointmentActions {
  appointment: Appointment;
  patientId: string;
  doctorId: string;
  appointmentId: string;

  constructor(appointment: Appointment) {
    this.appointment = appointment;
    this.doctorId = appointment.doctor.id;
    this.patientId = appointment.patient.id;
    this.appointmentId = appointment.id;
  }
  async approve() {
    await tryCatch(() =>
      axiosInstance.patch(`/appointments/${this.appointmentId}/approve`)
    );
  }

  async decline() {
    await tryCatch(() =>
      axiosInstance.patch(`/appointments/${this.appointmentId}/decline`)
    );
  }

  async doctorInfo() {
    return await tryCatch(() => axiosInstance.get(`/doctors/${this.doctorId}`));
  }

  async delete() {
    return await tryCatch(() =>
      axiosInstance.delete(`/appointments/${this.appointmentId}`)
    );
  }

  async getAppointments() {
    return await tryCatch(() => axiosInstance.get("patients/me/appointments"));
  }

  async reschedule(time: string) {
    return await tryCatch(() =>
      axiosInstance.patch(`/appointments/${this.appointmentId}/`, {
        scheduled_time: time,
      })
    );
  }
}

export const getActionsByRole = (
  role: UserRole | "",
  appointment: Appointment,
  setDoctor: React.Dispatch<React.SetStateAction<Doctor | null>>,
  setViewDetails: React.Dispatch<React.SetStateAction<boolean>>,
  setReschedule: React.Dispatch<React.SetStateAction<boolean>>
): AppointmentButtonAction[] | null => {
  const actions = new AppointmentActions(appointment);
  switch (role) {
    case "admin":
      return [
        {
          label: "Approve",
          className: "bg-green-800",
          onClick: () => actions.approve(),
        },
        {
          label: "Decline",
          variant: "destructive",
          onClick: () => actions.decline(),
        },
        { label: "View Details", onClick: () => setViewDetails(true) },
      ];
    case "patient":
      return [
        {
          label: "Reschedule",
          className: "bg-green-800",
          onClick: () => setReschedule(true),
        },
        {
          label: "Delete",
          variant: "destructive",
          onClick: async () => {
            const [res, err] = await actions.delete();
            if (res) {
              const [res, err] = await actions.getAppointments();

              store.dispatch(addAppointmentArray(res!.data));
              store.dispatch(
                showAlert({
                  message: "Deleted successfully",
                  type: "success" as AlertType,
                })
              );
            } else {
              store.dispatch(
                showAlert({
                  message: err.response?.data?.message,
                  type: "error" as AlertType,
                })
              );
            }
          },
        },
        {
          label: "View Details",
          onClick: async () => {
            const [res] = await actions.doctorInfo();
            setDoctor(res?.data);
            setViewDetails(true);
          },
        },
      ];
    default:
      return null;
  }
};
