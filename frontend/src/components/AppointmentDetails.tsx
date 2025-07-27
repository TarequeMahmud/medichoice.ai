"use client";

import React from "react";
import { Appointment } from "@/types/appointment";
import { X } from "lucide-react";

interface Props {
  appointment: Appointment;
  doctor: Doctor | null;
  patient: Patient | null;
  onClose: () => void;
}

const AppointmentDetails: React.FC<Props> = ({
  appointment,
  doctor,
  patient,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-[900] bg-[#D9D9D952] bg-opacity-20 flex items-center justify-center">
      <div className="w-[90%] max-w-[550px] max-h-[90vh] overflow-y-auto bg-white rounded-2xl border border-white/70 p-6 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 text-gray-500 hover:text-black"
        >
          <X size={20} />
        </button>

        <h1 className="text-3xl font-bold text-center text-black mb-6">
          Appointment Details
        </h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2 border-b pb-1">
            Appointment Info
          </h2>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>
              <strong>ID:</strong> {appointment.id}
            </li>
            <li>
              <strong>Date & Time:</strong>{" "}
              {new Date(appointment.scheduled_time).toLocaleString()}
            </li>
            <li>
              <strong>Clinic:</strong> {appointment.clinic}
            </li>
            <li>
              <strong>Status:</strong> {appointment.status}
            </li>
            <li>
              <strong>Admin Approved:</strong>{" "}
              {appointment.admin_approved ? "Yes" : "No"}
            </li>
            <li>
              <strong>Reason:</strong> {appointment.reason}
            </li>
            <li>
              <strong>Created At:</strong>{" "}
              {new Date(appointment.created_at).toLocaleString()}
            </li>
            <li>
              <strong>Updated At:</strong>{" "}
              {new Date(appointment.updated_at).toLocaleString()}
            </li>
          </ul>
        </div>

        {doctor && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2 border-b pb-1">
              Doctor Info
            </h2>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>
                <strong>Name:</strong> {doctor.name}
              </li>
              <li>
                <strong>Specializations:</strong>{" "}
                {doctor.specializations.join(", ")}
              </li>
              <li>
                <strong>Experience:</strong> {doctor.experience_years} years
              </li>
              <li>
                <strong>Rating:</strong> {doctor.rating} ★
              </li>
              <li>
                <strong>Verified:</strong> {doctor.is_verified ? "Yes" : "No"}
              </li>
              <li>
                <strong>Bio:</strong> {doctor.bio}
              </li>
              <li>
                <strong>Clinic Address:</strong> {doctor.clinic_address}
              </li>
              <li>
                <strong>Available Days:</strong>{" "}
                {doctor.available_days.join(", ")}
              </li>
              <li>
                <strong>Available Time:</strong> {doctor.available_time_start} -{" "}
                {doctor.available_time_end}
              </li>
            </ul>
          </div>
        )}

        {patient && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2 border-b pb-1">
              Patient Info
            </h2>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>
                <strong>Date of Birth:</strong> {patient.date_of_birth}
              </li>
              <li>
                <strong>Gender:</strong> {patient.gender}
              </li>
              <li>
                <strong>Blood Type:</strong> {patient.blood_type}
              </li>
              <li>
                <strong>Height:</strong> {patient.height_cm} cm
              </li>
              <li>
                <strong>Weight:</strong> {patient.weight_kg} kg
              </li>
              <li>
                <strong>Known Allergies:</strong>{" "}
                {patient.known_allergies?.length > 0
                  ? patient.known_allergies.join(", ")
                  : "None"}
              </li>
              <li>
                <strong>Chronic Conditions:</strong>{" "}
                {patient.chronic_conditions?.length > 0
                  ? patient.chronic_conditions.join(", ")
                  : "None"}
              </li>
              <li>
                <strong>Medications:</strong>{" "}
                {patient.medications?.length > 0
                  ? patient.medications.join(", ")
                  : "None"}
              </li>
              <li>
                <strong>Medical History:</strong> {patient.medical_history}
              </li>
              <li>
                <strong>Address:</strong> {patient.address}
              </li>
              <li>
                <strong>Emergency Contact:</strong>{" "}
                {patient.emergency_contact_name} (
                {patient.emergency_contact_relation}) -{" "}
                {patient.emergency_contact}
              </li>
              <li>
                <strong>Insurance:</strong> {patient.insurance_provider} (#
                {patient.insurance_number})
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentDetails;
