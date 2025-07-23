import { Appointment } from "@/types/appointment";
import { useState, useEffect } from "react";
import { authorizedUser, axiosInstance } from "@/lib/axios";
import useLoader from "@/hooks/useLoader";

export default function useAppointmentsWithRole(url: string) {
  const [role, setRole] = useState<UserRole | "">("");
  const { loading, showLoader, hideLoader } = useLoader();
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const checkUser = async () => {
      showLoader();
      const user = await authorizedUser();

      setRole(user.role);

      const response = await axiosInstance.get(url, {
        withCredentials: true,
      });
      setAppointments(response.data);
      hideLoader();
    };
    checkUser();
  }, [url]);

  return { appointments, role, loading };
}
