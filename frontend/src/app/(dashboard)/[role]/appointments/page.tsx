"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import AppointmentCard from "@/components/AppointmentCard";
import LoadingOrEmpty from "@/components/LoadingOrEmpty";
import Section from "@/components/Section";
import useAppointmentsWithRole from "@/hooks/useAppointmentsWithRole";
import { MdOutlineCreate } from "react-icons/md";
import CreateAppointment from "@/components/CreateAppointment";


const Page: React.FC = () => {
  const { role } = useParams<{ role: string }>();
  const [showModal, setShowModal] = useState(false);

  // Determine the API endpoint based on the role
  const endpoint =
    role === "admin"
      ? "/appointments"
      : role === "doctor"
        ? "/doctors/me/appointments"
        : role === "patient"
          ? "/patients/me/appointments"
          : "";
  console.log(endpoint)
  const { appointments, loading } = useAppointmentsWithRole(endpoint);

  // If invalid role or missing endpoint
  if (!endpoint) {
    return (
      <Section title="Appointments">
        <LoadingOrEmpty
          loading={false}
          emptyText="Invalid role. Please check your URL."
        />
      </Section>
    );
  }

  return (
    <Section title="Appointments">
      {/* Appointment list */}
      {!showModal &&
        (appointments.length > 0 ? (
          appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              role={role as UserRole}
            />
          ))
        ) : (
          <LoadingOrEmpty loading={loading} emptyText="No Appointment found" />
        ))}

      {/* Floating button only for patient */}
      {role === "patient" && (
        <div
          className="fixed bottom-[50px] right-[50px] rounded-full w-20 h-20 bg-[rgba(114,1,99,0.3)] border-none text-2xl text-white flex items-center justify-center cursor-pointer z-10 transition-transform duration-200 ease-in-out hover:bg-[rgba(218,22,191,1)]"
          onClick={() => setShowModal(!showModal)}
        >
          <MdOutlineCreate width={40} height={40} />
        </div>
      )}

      {/* Modal for creating appointment */}
      {showModal && role === "patient" && (
        <CreateAppointment setShowModal={setShowModal} />
      )}
    </Section>
  );
};

export default Page;

