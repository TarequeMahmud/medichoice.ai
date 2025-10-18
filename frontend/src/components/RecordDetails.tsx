"use client";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MedicalRecord } from "@/types/appointment";
import { Button } from "@/components/ui/button";

type RecordDetailsProps = {
    record: MedicalRecord;
    onClose: () => void;
};

const RecordDetails: React.FC<RecordDetailsProps> = ({ record, onClose }) => {
    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="bg-[#1a1a1a] text-white max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{record.title}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <p>
                        <b>Doctor:</b> {record.doctor.full_name}
                    </p>
                    <p>
                        <b>Patient:</b> {record.patient.full_name}
                    </p>
                    <p>
                        <b>Description:</b> {record.description}
                    </p>

                    <div>
                        <b>Prescription:</b>
                        <ul className="list-disc pl-5">
                            {record.prescription.map((med, idx) => (
                                <li key={idx}>{med}</li>
                            ))}
                        </ul>
                    </div>

                    {record.attachments.length > 0 && (
                        <div>
                            <b>Attachments:</b>
                            <ul className="list-disc pl-5">
                                {record.attachments.map((file, idx) => (
                                    <li key={idx}>
                                        <a
                                            href={file}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 underline"
                                        >
                                            {file}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div>
                        <b>Created:</b>{" "}
                        {new Date(record.created_at).toLocaleString()}
                    </div>
                </div>

                <Button
                    className="mt-4"
                    variant="secondary"
                    onClick={onClose}
                >
                    Close
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default RecordDetails;
