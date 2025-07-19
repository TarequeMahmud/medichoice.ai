"use client";
import AppointmentCard from "@/components/AppointmentCard";

import Spinner from "@/components/Spinner";
import useLoader from "@/hooks/useLoader";
import { axiosInstance } from "@/lib/axios";
import { axiosInstance } from "@/lib/axios";
import { Appointment } from "@/types/appointment";
import React, { useEffect, useState } from "react";

const Page: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { loading, showLoader, hideLoader } = useLoader();
  useEffect(() => {
    const checkUser = async () => {
      showLoader();
  useEffect(() => {
    const checkUser = async () => {
      const response = await axiosInstance.get("/patients/me/appointments", {
        withCredentials: true,
      });
      setAppointments(response.data);
      hideLoader();
      console.log(response.data);
    };
    checkUser();
  }, []);

  return (
    <div className="w-full m-auto px-4 py-6 ml-10">
      <h1 className="text-3xl text-center text-white font-bold mb-2 mx-auto">
        All Appointments
      </h1>
      <hr className="mb-10 w-[80%] mx-auto" />
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))
        ) : loading ? (
          <Spinner size="w-12 h-12" color="border-white" />
        ) : (
          <h1 className="text-3xl text-center text-white/50 font-bold mb-2 mx-auto">
            No Appointment found
          </h1>
        )}
      </div>
    </div>
  );
};

export default Page;
