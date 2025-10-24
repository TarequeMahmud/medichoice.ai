type Doctor = {
  id: string;
  name: string;
  specializations: string[];
  experience_years: number;
  bio: string;
  clinic_address: string;
  available_days: string[];
  available_time_start: string;
  available_time_end: string;
  rating: number;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
};

interface Patient {
  blood_type: string;
  emergency_contact: string;
  emergency_contact_name: string;
  emergency_contact_relation: string;
  address: string;
  date_of_birth: string;
  gender: "male" | "female" | "other";
  height_cm: number;
  weight_kg: number;
  known_allergies: string[];
  chronic_conditions: string[];
  medications: string[];
  medical_history: string;
  insurance_provider: string;
  insurance_number: string;
}


type ChatMessage = { senderId: string; receiverId: string; name: string; message: string; };