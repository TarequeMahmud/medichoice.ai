import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { AppointmentCardProps } from "@/types/appointment";

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
  const appointmentsWithDetails = {
    Doctor: appointment.doctor.full_name,
    Time: new Date(appointment.scheduled_time).toLocaleTimeString(),
    Symptom: appointment.reason,
    Status: appointment.status,
    Approved: appointment.admin_approved ? "Yes" : "No",
    Location: appointment.clinic,
  };

  return (
    <Card className="bg-[#D9D9D952] w-[60%] m-auto text-white mb-10">
      <CardTitle className="m-auto">
        Date: <em>20/20/2001</em>
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
        <Button className="bg-green-800">Rescedule</Button>
        <Button variant="destructive">Cencel</Button>
        <Button>View Details</Button>
      </CardFooter>
    </Card>
  );
};

export default AppointmentCard;
