"use client";
import AppointmentCard from "@/components/AppointmentCard";
import { authorizedUser, axiosInstance } from "@/lib/axios";
import { Appointment } from "@/types/appointment";
import React, { useEffect, useState } from "react";

const Page: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  useEffect(() => {
    const checkUser = async () => {
      const validUser = await authorizedUser();
      const response = await axiosInstance.get("/patients/me/appointments", {
        withCredentials: true,
      });
      setAppointments(response.data);
      console.log(response.data);
    };
    checkUser();
  }, []);

  return (
    <div className="w-[100%]">
      <h1>Appointment page</h1>
      <p>Welcome to the patient dashboard page.</p>
      {appointments.map((appointment) => (
        <AppointmentCard appointment={appointment} />
      ))}
    </div>
  );
};

export default Page;
