"use client";
import AppointmentCard from "@/components/AppointmentCard";
import LoadingOrEmpty from "@/components/LoadingOrEmpty";
import Section from "@/components/Section";
import useLoader from "@/hooks/useLoader";
import { axiosInstance } from "@/lib/axios";
import { Appointment } from "@/types/appointment";
import React, { useEffect, useState } from "react";

const Page: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { loading, showLoader, hideLoader } = useLoader();
  useEffect(() => {
    const checkUser = async () => {
      showLoader();
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
    <Section title="All Appointments">
      {appointments.length > 0 ? (
        appointments.map((appointment) => (
          <AppointmentCard key={appointment.id} appointment={appointment} />
        ))
      ) : (
        <LoadingOrEmpty loading={loading} emptyText="No Appointment found" />
      )}
    </Section>
  );
};

export default Page;
