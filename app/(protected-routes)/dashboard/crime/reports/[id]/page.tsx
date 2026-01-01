"use client";

import { generateMetadata } from "@/lib/seo";
import { ReportDetail } from "@/components/report/reportDetail";

export default function ReportDetailsPage({ params }: { params: { id: string } }) {
  generateMetadata({
    title: `Report Details - Cybercrime Reporting Platform`,
    description: `Detailed information about the report submitted on the Cybercrime Reporting Platform.`,
    canonical: `/dashboard/crime/reports/${params.id}`,
  });

  return <ReportDetail reportId={params.id} showAdminActions={false} />;
}
