import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { AppointmentCardProps } from "@/types/appointment";
import { AppointmentActions, getActionsByRole } from "@/lib/actions";
import AppointmentDetails from "./AppointmentDetails";
import RescheduleAppointment from "./RescheduleAppointment";

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  role,
}) => {
  const [viewDetails, setViewDetails] = useState<boolean>(false);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [reschedule, setReschedule] = useState<boolean>(false);
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
    setViewDetails,
    setReschedule
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
      {reschedule && (
        <RescheduleAppointment
          isOpen={reschedule}
          onClose={() => setReschedule(false)}
          onReschedule={(newtime: string) =>
            new AppointmentActions(appointment).reschedule(newtime)
          }
        />
      )}
    </>
  );
};

export default AppointmentCard;
