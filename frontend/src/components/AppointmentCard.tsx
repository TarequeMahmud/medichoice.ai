import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import {
  AppointmentButtonAction,
  AppointmentCardProps,
} from "@/types/appointment";

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  role,
}) => {
  const appointmentsWithDetails = {
    Doctor: appointment.doctor.full_name,
    Time: new Date(appointment.scheduled_time).toLocaleTimeString(),
    Date: new Date(appointment.scheduled_time).toLocaleDateString(),
    Symptom: appointment.reason,
    Status: appointment.status,
    Approved: appointment.admin_approved ? "Yes" : "No",
    Location: appointment.clinic,
  };

  const appointmentActions = getActionsByRole(role);
  console.log("appointment actions: ", appointmentActions);

  return (
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
            >
              {action.label}
            </Button>
          ))}
      </CardFooter>
    </Card>
  );
};

const getActionsByRole = (
  role: UserRole | ""
): AppointmentButtonAction[] | null => {
  switch (role) {
    case "admin":
      return [
        { label: "Approve", className: "bg-green-800" },
        { label: "Cancel", variant: "destructive" },
        { label: "View Details" },
      ];
    case "patient":
      return [
        { label: "Reschedule", className: "bg-green-800" },
        { label: "Cancel", variant: "destructive" },
        { label: "View Details" },
      ];
    default:
      return null;
  }
};

export default AppointmentCard;
