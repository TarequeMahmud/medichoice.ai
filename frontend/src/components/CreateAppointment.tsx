import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useLoader from "@/hooks/useLoader";
import { axiosInstance } from "@/lib/axios";
import { useAppDispatch } from "@/hooks/redux";
import { addAppointment } from "@/lib/features/appointment/appointmentSlice";
type CreateAppointmentProps = {
  setShowModal: (value: boolean) => void;
};
const CreateAppointment: React.FC<CreateAppointmentProps> = ({
  setShowModal,
}) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [fetched, setFetched] = useState(false);
  const { showLoader, hideLoader, loading } = useLoader();
  const dispatch = useAppDispatch();

  const fetchDoctors = async () => {
    if (fetched) return;
    showLoader();
    try {
      const res = await axiosInstance.get("/doctors/");
      setDoctors(res.data);
      setFetched(true);
    } catch (err) {
      console.error("Failed to fetch doctors", err);
    } finally {
      hideLoader();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const date = formData.get("scheduled_date") as string;
    const time = formData.get("scheduled_time") as string;
    const combinedDateTime = new Date(`${date}T${time}:00Z`).toISOString();

    const payload = {
      doctorId: formData.get("doctorId"),
      scheduled_time: combinedDateTime,
      clinic: formData.get("clinic"),
      reason: formData.get("reason") || "General Checkup",
    };

    try {
      const res = await axiosInstance.post("/appointments", payload);
      dispatch(addAppointment(res.data));
      setDoctors([]);
      setShowModal(false);
      console.log("Appointment created:", res.data);
    } catch (error) {
      console.error("Failed to create appointment:", error);
    }
  };

  return (
    <div className="container flex items-center justify-center">
      <div className="data-container flex flex-col items-start justify-start relative w-[60%]">
        <Card className="w-full h-full bg-[#D9D9D952] border-none shadow-lg rounded-[25px]">
          <CardHeader>
            <CardTitle className="text-3xl text-white">
              Create Appointment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {/* Doctor Select */}
              <div>
                <Label htmlFor="doctorId">Doctor</Label>
                <select
                  id="doctorId"
                  name="doctorId"
                  onClick={fetchDoctors}
                  required
                  className="w-full border rounded px-3 py-2"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select a doctor
                  </option>
                  {loading && <option>Loading...</option>}
                  {!loading &&
                    doctors.map((doctor) => (
                      <option value={doctor.id} key={doctor.id}>
                        {doctor.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <Label htmlFor="scheduled_date">Date</Label>
                <Input
                  id="scheduled_date"
                  name="scheduled_date"
                  type="date"
                  required
                />
              </div>

              {/* Time */}
              <div>
                <Label htmlFor="scheduled_time">Time</Label>
                <Input
                  id="scheduled_time"
                  name="scheduled_time"
                  type="time"
                  required
                />
              </div>

              {/* Clinic Address */}
              <div>
                <Label htmlFor="clinic">Clinic Address</Label>
                <select
                  id="clinic"
                  name="clinic"
                  required
                  className="w-full border rounded px-3 py-2"
                  defaultValue=""
                >
                  <option value="" disabled>
                    {doctors.length === 0
                      ? "Select a doctor first"
                      : "Select a clinic"}
                  </option>
                  {doctors.map((doctor) => (
                    <option value={doctor.clinic_address} key={doctor.id}>
                      {doctor.clinic_address}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reason */}
              <div>
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  name="reason"
                  placeholder="Enter reason or leave as General Checkup"
                  defaultValue="General Checkup"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2 mt-4">
                <Button type="submit">Create</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
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

export default CreateAppointment;
