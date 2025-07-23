declare namespace NodeJS {
  interface ProcessEnv {
    JWT_SECRET_KEY: string;
  }
}

enum UserRole {
  ADMIN = "admin",
  DOCTOR = "doctor",
  PATIENT = "patient",
}

interface AuthLinksProps {
  mode?: "login" | "register" | "reset";
}
