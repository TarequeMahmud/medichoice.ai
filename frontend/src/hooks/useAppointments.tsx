import { Appointment } from "@/types/appointment";
import { useEffect } from "react";

import useLoader from "@/hooks/useLoader";
import { useAppDispatch, useAppSelector } from "./redux";
import {
  fetchAppointments,
  selectAllAppointments,
} from "@/lib/features/appointment/appointmentSlice";

export default function useAppointments(url: string) {
  const { loading, showLoader, hideLoader } = useLoader();
  const appointments: Appointment[] = useAppSelector(selectAllAppointments);
  const dispatch = useAppDispatch();
  const fetched = useAppSelector((state) => state.appointment.fetched);

  useEffect(() => {
    const checkUser = async () => {
      showLoader();
      await dispatch(fetchAppointments(url));
      hideLoader();
    };
    if (!fetched) checkUser();
  }, [url, dispatch, fetched]);

  return { appointments, loading };
}
