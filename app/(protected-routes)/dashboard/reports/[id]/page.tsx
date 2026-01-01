"use client";

import { use } from "react";
import { useSearchParams } from "next/navigation";
import { ReportDetail } from "@/components/report/reportDetail";

export default function ReportDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const showAssignDialog = searchParams.get("action") === "assign";

  return (
    <ReportDetail 
      reportId={resolvedParams.id} 
      showAdminActions={true}
      showAssignDialog={showAssignDialog}
    />
  );
}
