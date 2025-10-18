import { useAppDispatch } from "@/hooks/redux";
import { AlertType, showAlert } from "@/lib/features/alert/alertSlice";
import axios, { AxiosResponse } from "axios";
import React, { useState } from "react";

interface RescheduleAppointmentProps {
  isOpen: boolean;
  onReschedule: (
    newtime: string
  ) => Promise<[AxiosResponse | null, Error | null]>;
  onClose: () => void;
}
const RescheduleAppointment: React.FC<RescheduleAppointmentProps> = ({
  isOpen,
  onReschedule,
  onClose,
}) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (date && time) {
      const newDateTime = `${date}T${time}`;
      console.log(newDateTime);
      const [res, err] = await onReschedule(newDateTime);
      if (res) {
        dispatch(
          showAlert({
            message: "Rescheduled successfully",
            type: "success" as AlertType,
          })
        );
      } else {
        if (axios.isAxiosError(err))
          dispatch(
            showAlert({
              message: err.response?.data?.message,
              type: "error" as AlertType,
            })
          );
      }
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[900] bg-[#D9D9D952] bg-opacity-20 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Reschedule Appointment
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Reschedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RescheduleAppointment;
