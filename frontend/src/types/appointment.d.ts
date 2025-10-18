export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export type UserSummary = {
  id: string;
  full_name: string;
  email: string;
};

type AppointmentCardProps = {
  appointment: Appointment;
  role: UserRole | "";
};

export interface Appointment {
  id: string;
  scheduled_time: string;
  clinic: string;
  status: AppointmentStatus;
  admin_approved: boolean;
  reason: string;
  created_at: string;
  updated_at: string;
  patient: UserSummary;
  doctor: UserSummary;
}

interface AppointmentButtonAction {
  label: string;
  variant?: "default" | "destructive" | "outline" | null;
  className?: string;
  onClick?: () => Promise<void> | void;
}

interface AppointmentState {
  appointments: Appointment[];
  fetched: boolean;
}

// record types

export interface RecordAppointment {
  id: string;
  scheduled_time: string;
  status: AppointmentStatus;
  admin_approved: boolean;
  reason: string;
  clinic: string | null;
  created_at: string;
  updated_at: string;
}

export interface MedicalRecord {
  id: string;
  title: string;
  description: string;
  prescription: string[];
  attachments: string[];
  created_at: string;
  updated_at: string;
  patient: UserSummary;
  doctor: UserSummary;
  appointment: RecordAppointment;
}

type RecordCardProps = {
  record: MedicalRecord;

};

export interface RecordState {
  records: MedicalRecord[];
  fetched: boolean;
}