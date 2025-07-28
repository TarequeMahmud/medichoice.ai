import { Appointment } from "@/types/appointment";
import { useState, useEffect } from "react";
import { authorizedUser } from "@/lib/axios";
import useLoader from "@/hooks/useLoader";
import { useAppDispatch, useAppSelector } from "./redux";
import {
  fetchAppointments,
  selectAllAppointments,
} from "@/lib/features/appointment/appointmentSlice";

export default function useAppointmentsWithRole(url: string) {
  const [role, setRole] = useState<UserRole | "">("");
  const { loading, showLoader, hideLoader } = useLoader();
  const appointments: Appointment[] = useAppSelector(selectAllAppointments);
  const dispatch = useAppDispatch();
  const fetched = useAppSelector((state) => state.appointment.fetched);

  useEffect(() => {
    const checkUser = async () => {
      showLoader();
      const user = await authorizedUser();
      setRole(user.role);
      await dispatch(fetchAppointments(url));
      hideLoader();
    };
    if (!fetched) checkUser();
  }, [url, dispatch, fetched, showLoader, hideLoader]);

  return { appointments, role, loading };
}
