"use client";

import React from "react";
import RecordCard from "@/components/RecordCard";
import LoadingOrEmpty from "@/components/LoadingOrEmpty";
import Section from "@/components/Section";
import useRecords from "@/hooks/useRecords";
import { useParams } from "next/navigation";

const Page: React.FC = () => {
    const { role } = useParams<{ role: string }>();
    const endpoint =
        role === "admin"
            ? "/records"
            : role === "doctor"
                ? "/doctors/me/records"
                : role === "patient"
                    ? "/patients/me/records"
                    : "";
    const { records, loading } = useRecords(endpoint);

    return (
        <Section title="Medical Records">
            {records.length > 0 ? (
                records.map((record) => (
                    <RecordCard key={record.id} record={record} />
                ))
            ) : (
                <LoadingOrEmpty loading={loading} emptyText="No records found" />
            )}
        </Section>
    );
};

export default Page;
