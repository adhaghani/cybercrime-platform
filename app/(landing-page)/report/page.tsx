import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_REPORTS } from "@/lib/api/mock-data";
import type { AnyReport, ReportStatus, ReportType } from "@/lib/types";
import { Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";

function getStatusBadgeClass(status: ReportStatus) {
	switch (status) {
		case "PENDING":
			return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
		case "IN_PROGRESS":
			return "bg-blue-500/10 text-blue-500 border-blue-500/20";
		case "RESOLVED":
			return "bg-green-500/10 text-green-500 border-green-500/20";
		case "REJECTED":
			return "bg-red-500/10 text-red-500 border-red-500/20";
	}
}

function getTypeBadgeClass(type: ReportType) {
	return type === "CRIME"
		? "bg-red-500/10 text-red-500 border-red-500/20"
		: "bg-orange-500/10 text-orange-500 border-orange-500/20";
}

export default function PublicLatestReportsPage() {
	const latestTen = [...MOCK_REPORTS]
		.sort(
			(a: AnyReport, b: AnyReport) =>
				new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
		)
		.slice(0, 10);

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold tracking-tight">Latest Reports</h1>
				<p className="text-muted-foreground">
					Showing a limited public snapshot of the latest 10 submissions.
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				{latestTen.map((report) => (
					<Card key={report.reportId}>
						<CardHeader className="space-y-2">
							<div className="flex flex-wrap items-center justify-between gap-2">
								<CardTitle className="text-base">{report.title}</CardTitle>
								<div className="flex items-center gap-2">
									<Badge className={getTypeBadgeClass(report.type)} variant="outline">
										{report.type}
									</Badge>
									<Badge
										className={getStatusBadgeClass(report.status)}
										variant="outline"
									>
										{report.status.replace("_", " ")}
									</Badge>
								</div>
							</div>
						</CardHeader>
						<CardContent className="space-y-3">
							<p className="text-sm text-muted-foreground line-clamp-2">{report.description}</p>
							<div className="flex flex-col gap-2 text-sm text-muted-foreground">
								<div className="flex items-center gap-2">
									<MapPin className="h-4 w-4" />
									<span>{report.location}</span>
								</div>
								<div className="flex items-center gap-2">
									<Calendar className="h-4 w-4" />
									<span>{format(new Date(report.submittedAt), "MMM d, yyyy")}</span>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			<div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
				To view full report details and submit new reports, please log in.
				<div className="mt-3">
					<Button asChild>
						<Link href="/auth/login">Login</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}

