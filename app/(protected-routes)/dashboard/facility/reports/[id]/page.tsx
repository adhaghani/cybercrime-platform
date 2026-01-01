"use client";

import { generateMetadata } from "@/lib/seo";
import { ReportDetail } from "@/components/report/reportDetail";

export default function ReportDetailsPage({ params }: { params: { id: string } }) {
  generateMetadata({
    title: `Report Details - Cybercrime Reporting Platform`,
    description: `Detailed view of the report on the Cybercrime Reporting Platform.`,
    canonical: `/dashboard/facility/reports/${params.id}`,
  });

  return <ReportDetail reportId={params.id} showAdminActions={false} />;
}
