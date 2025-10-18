"use client";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { MedicalRecord } from "@/types/appointment";

const useRecords = (endpoint: string) => {
    const [records, setRecords] = useState<MedicalRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        let isMounted = true;
        const fetchRecords = async () => {
            try {
                const res = await axiosInstance.get(endpoint);
                if (isMounted) setRecords(res.data);
            } catch (err) {
                console.error("Error fetching records:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchRecords();

        return () => {
            isMounted = false;
        };
    }, [endpoint]);

    return { records, loading };
};

export default useRecords;
