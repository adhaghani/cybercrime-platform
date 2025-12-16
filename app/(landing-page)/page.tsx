import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, FileText, Siren, Sparkles } from "lucide-react";

export default function LandingHomePage() {
	return (
		<div className="space-y-10">
			<section className="space-y-4">
				<div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm text-muted-foreground">
					<Sparkles className="h-4 w-4" />
					Public portal
				</div>

				<h1 className="text-4xl font-bold tracking-tight md:text-5xl">
					Report and respond faster on campus
				</h1>
				<p className="max-w-2xl text-muted-foreground">
					A centralized platform for crime and facility incidents, with clear workflows for students and staff.
					Browse the latest reports snapshot, find emergency contacts, and learn how the system helps keep UiTM safer.
				</p>

				<div className="flex flex-col gap-2 sm:flex-row">
					<Button asChild>
						<Link href="/auth/login">Login to Submit a Report</Link>
					</Button>
					<Button asChild variant="outline">
						<Link href="/report">View Latest Reports</Link>
					</Button>
				</div>
			</section>

			<Separator />

			<section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="space-y-2">
						<div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
							<FileText className="h-5 w-5 text-primary" />
						</div>
						<CardTitle className="text-base">Structured reporting</CardTitle>
					</CardHeader>
					<CardContent className="text-sm text-muted-foreground">
						Submit crime or facility reports with consistent fields for faster triage.
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="space-y-2">
						<div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
							<Shield className="h-5 w-5 text-primary" />
						</div>
						<CardTitle className="text-base">Clear accountability</CardTitle>
					</CardHeader>
					<CardContent className="text-sm text-muted-foreground">
						Staff assignment and progress updates improve visibility and resolution.
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="space-y-2">
						<div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
							<Siren className="h-5 w-5 text-primary" />
						</div>
						<CardTitle className="text-base">Emergency directory</CardTitle>
					</CardHeader>
					<CardContent className="text-sm text-muted-foreground">
						Quick access to national emergency services and UiTM auxiliary police contacts.
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="space-y-2">
						<div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
							<Sparkles className="h-5 w-5 text-primary" />
						</div>
						<CardTitle className="text-base">Better decisions</CardTitle>
					</CardHeader>
					<CardContent className="text-sm text-muted-foreground">
						Reporting data helps identify hotspots and recurring facility issues.
					</CardContent>
				</Card>
			</section>

			<section className="grid gap-4 lg:grid-cols-3">
				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle>How it works</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3 text-sm text-muted-foreground">
						<ol className="list-decimal pl-4 space-y-2">
							<li>Login with your UiTM account.</li>
							<li>Submit a crime or facility report with details and location.</li>
							<li>Staff review, assign, and track actions until resolved.</li>
						</ol>
						<div className="pt-2">
							<Button asChild variant="outline">
								<Link href="/faq">Read the FAQ</Link>
							</Button>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Need help now?</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3 text-sm text-muted-foreground">
						<p>For urgent, life-threatening emergencies, call 999 immediately.</p>
						<div className="flex flex-col gap-2">
							<Button asChild variant="destructive">
								<a href="tel:999">Call 999</a>
							</Button>
							<Button asChild variant="outline">
								<Link href="/emergency-services">View emergency services</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			</section>
		</div>
	);
}

