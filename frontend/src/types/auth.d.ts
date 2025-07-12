declare namespace NodeJS {
  interface ProcessEnv {
    JWT_SECRET_KEY: string;
  }
}

interface AuthLinksProps {
  mode?: "login" | "register" | "reset";
}
