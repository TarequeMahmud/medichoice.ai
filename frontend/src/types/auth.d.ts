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

interface AuthUser {
  userId: string;
  email: string;
  role: UserRole;
}

interface AuthLinksProps {
  mode?: "login" | "register" | "reset";
}
