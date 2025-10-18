"use client";
import AppointmentCard from "@/components/AppointmentCard";
import LoadingOrEmpty from "@/components/LoadingOrEmpty";
import Section from "@/components/Section";
import useAppointmentsWithRole from "@/hooks/useAppointmentsWithRole";

import React from "react";

const Page: React.FC = () => {
  const { appointments, role, loading } = useAppointmentsWithRole(
    "/doctors/me/appointments/"
  );

  return (
    <Section title="Appointments">
      {appointments.length > 0 && role ? (
        appointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            role={role}
          />
        ))
      ) : (
        <LoadingOrEmpty loading={loading} emptyText="No Appointment found" />
      )}
    </Section>
  );
};

export default Page;
