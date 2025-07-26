import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import {
  Appointment,
  AppointmentButtonAction,
  AppointmentCardProps,
} from "@/types/appointment";
import { AppointmentActions } from "@/lib/actions";
import AppointmentDetails from "./AppointmentDetails";

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  role,
}) => {
  const [viewDetails, setViewDetails] = useState<boolean>(false);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const appointmentsWithDetails = {
    Doctor: appointment.doctor.full_name,
    Time: new Date(appointment.scheduled_time).toLocaleTimeString(),
    Date: new Date(appointment.scheduled_time).toLocaleDateString(),
    Symptom: appointment.reason,
    Status: appointment.status,
    Approved: appointment.admin_approved ? "Yes" : "No",
    Location: appointment.clinic,
  };

  const appointmentActions = getActionsByRole(
    role,
    appointment,
    setDoctor,
    setViewDetails
  );

  return (
    <>
      <Card className="bg-[#D9D9D952] w-[60%] m-auto text-white mb-10">
        <CardTitle className="m-auto">
          Date: <em>{appointmentsWithDetails.Date}</em>
        </CardTitle>
        <CardContent className="grid grid-cols-2 gap-4 m-auto">
          {Object.entries(appointmentsWithDetails).map(([label, value]) => (
            <p key={label}>
              <b>{label}: </b>
              <em>{value}</em>
            </p>
          ))}
        </CardContent>
        <CardFooter className="flex justify-around">
          {appointmentActions &&
            appointmentActions.map((action, idx) => (
              <Button
                className={action.className}
                key={idx}
                variant={action.variant}
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            ))}
        </CardFooter>
      </Card>
      {viewDetails && (
        <AppointmentDetails
          appointment={appointment}
          doctor={doctor!}
          onClose={() => {
            setViewDetails(false);
            setDoctor(null);
          }}
        />
      )}
    </>
  );
};

const getActionsByRole = (
  role: UserRole | "",
  appointment: Appointment,
  setDoctor: React.Dispatch<React.SetStateAction<Doctor | null>>,
  setViewDetails: React.Dispatch<React.SetStateAction<boolean>>
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
        { label: "Reschedule", className: "bg-green-800" },
        { label: "Cancel", variant: "destructive" },
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

export default AppointmentCard;
