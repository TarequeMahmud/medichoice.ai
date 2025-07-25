import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const CreateAppointment: React.FC = () => {
  const [form, setForm] = useState({
    date: "",
    time: "",
    reason: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: handle appointment creation
    // setShowModal(false);
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
              <div>
                <Label htmlFor="doctorId">Doctor</Label>
                <select
                  id="doctorId"
                  name="doctorId"
                  //   value={form.doctorId || ""}
                  //   onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="" disabled selected>
                    Select a doctor
                  </option>
                  <option value="1b2c3d4e-1111-2222-3333-123456789abc">
                    Dr. Alice Smith
                  </option>
                  <option value="2c3d4e5f-2222-3333-4444-abcdef123456">
                    Dr. Bob Johnson
                  </option>
                  <option value="3d4e5f6a-3333-4444-5555-9876543210ab">
                    Dr. Carol Lee
                  </option>
                </select>
              </div>
              <div>
                <Label htmlFor="scheduled_date">Date</Label>
                <Input
                  id="scheduled_date"
                  name="scheduled_date"
                  type="date"
                  //   value={form.scheduled_date || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="scheduled_time">Time</Label>
                <Input
                  id="scheduled_time"
                  name="scheduled_time"
                  type="time"
                  //   value={form.scheduled_time || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="clinic">Clinic Address</Label>

                <select
                  id="doctorId"
                  name="doctorId"
                  //   value={form.doctorId || ""}
                  //   onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="" disabled selected>
                    select clinic
                  </option>
                  <option value="1b2c3d4e-1111-2222-3333-123456789abc">
                    St Johnson road
                  </option>
                </select>
              </div>
              <div>
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  name="reason"
                  value={form.reason || "General Checkup"}
                  onChange={handleChange}
                />
              </div>

              <div className="flex gap-2 mt-4">
                <Button type="submit">Create</Button>
                <Button
                  type="button"
                  variant="outline"
                  //   onClick={() => setShowModal(false)}
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
