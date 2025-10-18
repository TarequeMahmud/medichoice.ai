import { tryCatch } from "./utils";
import { axiosInstance } from "./axios";
import { Appointment, AppointmentButtonAction } from "@/types/appointment";
import { store } from "@/lib/store";
import { AlertType, showAlert } from "@/lib/features/alert/alertSlice";
import { addAppointmentArray } from "@/lib/features/appointment/appointmentSlice";
import { AxiosError } from "axios";

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
    return await tryCatch(() =>
      axiosInstance.patch(`/appointments/${this.appointmentId}/approve`)
    );
  }

  async decline() {
    return await tryCatch(() =>
      axiosInstance.patch(`/appointments/${this.appointmentId}/decline`)
    );
  }

  async doctorInfo() {
    return await tryCatch(() => axiosInstance.get(`/doctors/${this.doctorId}`));
  }

  async patientInfo() {
    return await tryCatch(() =>
      axiosInstance.get(`/patients/${this.patientId}`)
    );
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

  async markAsComplete() {
    return await tryCatch(() =>
      axiosInstance.patch(`/appointments/${this.appointmentId}/complete`)
    );
  }
}

export const getActionsByRole = (
  role: UserRole | "",
  appointment: Appointment,
  setDoctor: React.Dispatch<React.SetStateAction<Doctor | null>>,
  setPatient: React.Dispatch<React.SetStateAction<Patient | null>>,
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
          onClick: async () => {
            const [res, err] = await actions.approve();
            if (res) {
              store.dispatch(
                showAlert({
                  message: "Appointment approved",
                  type: "success" as AlertType,
                })
              );
            } else if (err instanceof AxiosError) {
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
          label: "Decline",
          variant: "destructive",
          onClick: async () => {
            const [res, err] = await actions.decline();
            if (res) {
              store.dispatch(
                showAlert({
                  message: "Appointment successfully declined",
                  type: "success" as AlertType,
                })
              );
            } else if (err instanceof AxiosError) {
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
            const [doctorRes, patientRes] = await Promise.all([
              actions.doctorInfo().then(([res]) => res),
              actions.patientInfo().then(([res]) => res),
            ]);
            setDoctor(doctorRes?.data);
            setPatient(patientRes?.data);
            setViewDetails(true);
          },
        },
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
              const [listRes] = await actions.getAppointments();
              store.dispatch(addAppointmentArray(listRes!.data));
              store.dispatch(
                showAlert({
                  message: "Deleted successfully",
                  type: "success" as AlertType,
                })
              );
            } else if (err instanceof AxiosError) {
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

    case "doctor": {
      const isCompleted = appointment.status === "completed";

      const baseActions: AppointmentButtonAction[] = [
        {
          label: "Decline",
          variant: "destructive",
          onClick: async () => {
            const [res, err] = await actions.decline();
            if (res) {
              store.dispatch(
                showAlert({
                  message: "Appointment successfully declined",
                  type: "success" as AlertType,
                })
              );
            } else if (err instanceof AxiosError) {
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
            const [res] = await actions.patientInfo();
            setPatient(res?.data);
            setViewDetails(true);
          },
        },
      ];

      // Conditional button
      const statusAction: AppointmentButtonAction = isCompleted
        ? {
          label: "Create Record",
          className: "bg-blue-700",
          onClick: () => {
            window.location.href = `/doctor/records/create?patientId=${appointment.patient.id}&appointmentId=${appointment.id}`;
          },
        }
        : {
          label: "Mark As Complete",
          className: "bg-green-800",
          onClick: async () => {
            const [res, err] = await actions.markAsComplete();
            if (res) {
              store.dispatch(
                showAlert({
                  message: "Appointment marked as completed",
                  type: "success" as AlertType,
                })
              );
            } else if (err instanceof AxiosError) {
              store.dispatch(
                showAlert({
                  message: err.response?.data?.message,
                  type: "error" as AlertType,
                })
              );
            }
          },
        };

      return [statusAction, ...baseActions];
    }

    default:
      return null;
  }
};

