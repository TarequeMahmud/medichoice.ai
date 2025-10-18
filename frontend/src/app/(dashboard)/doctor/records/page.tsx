"use client";

import React from "react";
import RecordCard from "@/components/RecordCard";
import LoadingOrEmpty from "@/components/LoadingOrEmpty";
import Section from "@/components/Section";
import useRecords from "@/hooks/useRecords";

const Page: React.FC = () => {
  const { records, loading } = useRecords("/doctors/records");

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
