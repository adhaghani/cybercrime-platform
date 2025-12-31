"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ReportStatus, ReportType } from "@/lib/types";
import { Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";

type PublicReport = {
	REPORT_ID: number;
	TITLE: string;
	DESCRIPTION: string;
	TYPE: ReportType;
	LOCATION: string;
	STATUS: ReportStatus;
	SUBMITTED_AT: string;
};

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
	const [reports, setReports] = useState<PublicReport[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchLatestReports = async () => {
			try {
				const response = await fetch('/api/reports');
				if (!response.ok) throw new Error('Failed to fetch reports');
				const data = await response.json();
				setReports(data.data || []);
			} catch (err) {
				console.error('Error fetching latest reports:', err);
				setError('Failed to load latest reports');
			} finally {
				setLoading(false);
			}
		};

		fetchLatestReports();
	}, []);

	const LimitReportDisplay = 6;
	const limitedReports = reports.slice(0, LimitReportDisplay);

	if (loading) {
		return (
			<div className="space-y-6">
				<Skeleton className="h-12 w-1/3" />
				<Skeleton className="h-8 w-1/2" />
				<div className="grid gap-4 md:grid-cols-2">
					{Array.from({ length: 6 }).map((_, i) => (
						<Skeleton key={i} className="h-48" />
					))}
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="space-y-6">
				<h1 className="text-3xl font-bold tracking-tight">Latest Reports</h1>
				<Card className="border-destructive">
					<CardContent className="pt-6">
						<p className="text-destructive">{error}</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold tracking-tight">Latest Reports</h1>
				<p className="text-muted-foreground">
					Showing a limited public snapshot of the latest {reports.length} submissions.
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				{limitedReports.map((report) => (
					<Card key={report.REPORT_ID}>
						<CardHeader className="space-y-2">
							<div className="flex flex-wrap items-center justify-between gap-2">
								<CardTitle className="text-base">{report.TITLE}</CardTitle>
								<div className="flex items-center gap-2">
									<Badge className={getTypeBadgeClass(report.TYPE)} variant="outline">
										{report.TYPE}
									</Badge>
									<Badge
										className={getStatusBadgeClass(report.STATUS)}
										variant="outline"
									>
										{report.STATUS.replace("_", " ")}
									</Badge>
								</div>
							</div>
						</CardHeader>
						<CardContent className="space-y-3">
							<p className="text-sm text-muted-foreground line-clamp-2">{report.DESCRIPTION}</p>
							<div className="flex flex-col gap-2 text-sm text-muted-foreground">
								<div className="flex items-center gap-2">
									<MapPin className="h-4 w-4" />
									<span>{report.LOCATION}</span>
								</div>
								<div className="flex items-center gap-2">
									<Calendar className="h-4 w-4" />
									<span>{format(new Date(report.SUBMITTED_AT), "MMM d, yyyy")}</span>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{reports.length === 0 && (
				<Card>
					<CardContent className="pt-6 text-center text-muted-foreground">
						No reports available at the moment.
					</CardContent>
				</Card>
			)}

			<div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
				To view All report and the details and submit new reports, please log in.
				<div className="mt-3">
					<Button asChild>
						<Link href="/auth/login">Login</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}

