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
  onClick?: () => Promise<void>;
}

interface AppointmentState {
  appointments: Appointment[];
  fetched: boolean;
}
