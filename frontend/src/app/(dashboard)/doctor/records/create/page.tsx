"use client";
import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// import { axiosInstance } from "@/lib/axios";
import useLoader from "@/hooks/useLoader";
// import { AlertType, showAlert } from "@/lib/features/alert/alertSlice";
// import { useAppDispatch } from "@/hooks/redux";

const CreateRecordPage: React.FC = () => {
    // const searchParams = useSearchParams();
    const router = useRouter();
    // const dispatch = useAppDispatch();
    const { showLoader, hideLoader, loading } = useLoader();

    // const appointmentId = searchParams.get("appointmentId");
    // const patientId = searchParams.get("patientId");

    const [title, setTitle] = useState("Follow-up Consultation");
    const [description, setDescription] = useState("");
    const [prescriptions, setPrescriptions] = useState<string[]>([""]);
    const [attachments, setAttachments] = useState<string[]>([""]);

    const handleAddPrescription = () => setPrescriptions([...prescriptions, ""]);
    const handleRemovePrescription = (index: number) =>
        setPrescriptions(prescriptions.filter((_, i) => i !== index));

    const handlePrescriptionChange = (index: number, value: string) => {
        const updated = [...prescriptions];
        updated[index] = value;
        setPrescriptions(updated);
    };

    const handleAddAttachment = () => setAttachments([...attachments, ""]);
    const handleRemoveAttachment = (index: number) =>
        setAttachments(attachments.filter((_, i) => i !== index));

    const handleAttachmentChange = (index: number, value: string) => {
        const updated = [...attachments];
        updated[index] = value;
        setAttachments(updated);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        return
        // e.preventDefault();

        // if (!appointmentId || !patientId) {
        //     dispatch(
        //         showAlert({
        //             message: "Missing patientId or appointmentId in URL.",
        //             type: AlertType.Error,
        //         })
        //     );
        //     return;
        // }

        // const payload = {
        //     patientId,
        //     appointmentId,
        //     title,
        //     description,
        //     prescription: prescriptions.filter((p) => p.trim() !== ""),
        //     attachments: attachments.filter((a) => a.trim() !== ""),
        // };

        // showLoader();
        // try {
        //     const res = await axiosInstance.post("/records", payload);
        //     dispatch(
        //         showAlert({
        //             message: "Record created successfully",
        //             type: AlertType.Success,
        //         })
        //     );
        //     router.push(`/doctor/records/${res.data.id}`);
        // } catch (error) {
        //     console.error("Failed to create record:", error);
        //     dispatch(
        //         showAlert({
        //             message: "Failed to create record. Please try again.",
        //             type: AlertType.Error,
        //         })
        //     );
        // } finally {
        //     hideLoader();
        // }
    };

    const inputClass = "text-white placeholder:text-[#fdfdfd9c]"

    return (
        <div className="container flex items-center justify-center py-10">
            <div className="w-full md:w-[60%]">
                <Card className="bg-[#D9D9D952] border-none shadow-lg rounded-[25px]">
                    <CardHeader>
                        <CardTitle className="text-3xl text-white">
                            Create Patient Record
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            {/* Title */}
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Follow-up Consultation"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="The patient reported mild chest pain..."
                                    className={inputClass}
                                    required
                                />
                            </div>

                            {/* Prescription Array */}
                            <div>
                                <Label>Prescriptions</Label>
                                {prescriptions.map((item, index) => (
                                    <div key={index} className="flex gap-2 mt-2">
                                        <Input
                                            className={inputClass}
                                            value={item}
                                            onChange={(e) =>
                                                handlePrescriptionChange(index, e.target.value)
                                            }
                                            placeholder="Paracetamol 500mg, twice a day"
                                        />
                                        {prescriptions.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                onClick={() => handleRemovePrescription(index)}
                                            >
                                                -
                                            </Button>
                                        )}
                                        {index === prescriptions.length - 1 && (
                                            <Button type="button" onClick={handleAddPrescription}>
                                                +
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Attachments */}
                            <div>
                                <Label>Attachments (URLs)</Label>
                                {attachments.map((item, index) => (
                                    <div key={index} className="flex gap-2 mt-2">
                                        <Input
                                            className={inputClass}
                                            type="url"
                                            value={item}
                                            onChange={(e) =>
                                                handleAttachmentChange(index, e.target.value)
                                            }
                                            placeholder="https://cdn.medichoice.ai/reports/lab1.pdf"
                                        />
                                        {attachments.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                onClick={() => handleRemoveAttachment(index)}
                                            >
                                                -
                                            </Button>
                                        )}
                                        {index === attachments.length - 1 && (
                                            <Button type="button" onClick={handleAddAttachment}>
                                                +
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-2 mt-6">
                                <Button type="submit" disabled={loading}>
                                    {loading ? "Creating..." : "Create Record"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CreateRecordPage;
