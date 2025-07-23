import { tryCatch } from "./utils";
import { axiosInstance } from "./axios";

export class AppointmentActions {
  id: string;

  constructor(id: string) {
    this.id = id;
  }
  async approve() {
    await tryCatch(() =>
      axiosInstance.patch(`/appointments/${this.id}/approve`)
    );
  }

  async decline() {
    await tryCatch(() =>
      axiosInstance.patch(`/appointments/${this.id}/decline`)
    );
  }
}
