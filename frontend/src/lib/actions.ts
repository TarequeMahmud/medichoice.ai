import { tryCatch } from "./utils";
import { axiosInstance } from "./axios";
import { Appointment } from "@/types/appointment";

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
}
