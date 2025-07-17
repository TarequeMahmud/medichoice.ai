import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";

const AppointmentCard: React.FC = () => {
  return (
    <Card className="bg-[#D9D9D952] w-[60%] m-auto text-white">
      <CardTitle className="m-auto">
        Date: <em>20/20/2001</em>
      </CardTitle>
      <CardContent className="grid grid-cols-2 gap-4 m-auto">
        <p>
          <b>Doctor: </b>
          <em>Dr. Alex Jonson(Dermatologist)</em>
        </p>
        <p>
          <b>Time: </b>
          <em>11.10am</em>
        </p>{" "}
        <p>
          <b>Symptom: </b>
          <em>Recurrent Boils</em>
        </p>{" "}
        <p>
          <b>Status: </b>
          <em>Completed</em>
        </p>{" "}
        <p>
          <b>Approved: </b>
          <em>Yes</em>
        </p>{" "}
        <p>
          <b>Location: </b>
          <em>Mayo Health Clinic</em>
        </p>
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
