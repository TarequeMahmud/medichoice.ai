"use client";
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MedicalRecord } from "@/types/appointment";
import RecordDetails from "./RecordDetails";

type RecordCardProps = {
  record: MedicalRecord;
  onOpenAttachment?: (url: string) => void;
};

const RecordCard: React.FC<RecordCardProps> = ({ record, onOpenAttachment }) => {
  const [viewDetails, setViewDetails] = useState(false);

  const recordSummary = {
    Title: record.title,
    Doctor: record.doctor.full_name,
    Patient: record.patient.full_name,
    Date: new Date(record.created_at).toLocaleDateString(),
    Appointment: record.appointment.reason,
  };

  return (
    <>
      <Card className="bg-[#05050580] w-[60%] m-auto text-white mb-10">
        <CardTitle className="m-auto mt-2 text-xl font-semibold">
          {record.title}
        </CardTitle>

        <CardContent className="grid grid-cols-2 gap-4 m-auto text-sm">
          {Object.entries(recordSummary).map(([label, value]) => (
            <p key={label}>
              <b>{label}: </b>
              <em>{value || "—"}</em>
            </p>
          ))}
        </CardContent>

        <CardFooter className="flex justify-around mt-2">
          <Button variant="default" className="bg-green-600" onClick={() => setViewDetails(true)}>
            View Details
          </Button>

          {record.attachments.length > 0 && (
            <Button
              variant="outline"
              className="bg-amber-600"
              onClick={() =>
                onOpenAttachment
                  ? onOpenAttachment(record.attachments[0])
                  : window.open(record.attachments[0], "_blank")
              }
            >
              View Attachment
            </Button>
          )}
        </CardFooter>
      </Card>

      {viewDetails && (
        <RecordDetails
          record={record}
          onClose={() => setViewDetails(false)}
        />
      )}
    </>
  );
};

export default RecordCard;


