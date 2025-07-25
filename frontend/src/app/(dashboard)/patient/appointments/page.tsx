"use client";
import AppointmentCard from "@/components/AppointmentCard";
import { MdOutlineCreate } from "react-icons/md";
import LoadingOrEmpty from "@/components/LoadingOrEmpty";
import Section from "@/components/Section";
import useAppointmentsWithRole from "@/hooks/useAppointmentsWithRole";
import React from "react";
import { useState } from "react";
import CreateAppointment from "@/components/CreateAppointment";

const Page: React.FC = () => {
  const { appointments, role, loading } = useAppointmentsWithRole(
    "/patients/me/appointments"
  );

  const [showModal, setShowModal] = useState(false);

  return (
    <Section title="All Appointments">
      {!showModal &&
        (appointments.length > 0 ? (
          appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              role={role}
            />
          ))
        ) : (
          <LoadingOrEmpty loading={loading} emptyText="No Appointment found" />
        ))}
      <div
        className="fixed bottom-[50px] right-[50px] rounded-full w-20 h-20 bg-[rgba(114,1,99,0.3)] border-none text-2xl text-white flex items-center justify-center cursor-pointer z-10 transition-transform duration-200 ease-in-out hover:bg-[rgba(218,22,191,1)]"
        onClick={() => setShowModal(true)}
      >
        <MdOutlineCreate width={40} height={40} />
      </div>

      {showModal && <CreateAppointment />}
    </Section>
  );
};

export default Page;
