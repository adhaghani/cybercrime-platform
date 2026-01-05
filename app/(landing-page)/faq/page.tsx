import Link from "next/link";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FaqPage() {
	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<h1 className="text-3xl font-bold tracking-tight">FAQ</h1>
				<p className="text-muted-foreground">
					Common questions about reporting and emergency support.
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Frequently Asked Questions</CardTitle>
				</CardHeader>
				<CardContent>
					<Accordion type="single" collapsible>
						<AccordionItem value="item-1">
							<AccordionTrigger>Who can submit a report?</AccordionTrigger>
							<AccordionContent>
								Students and staff can submit reports after logging in.
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value="item-2">
							<AccordionTrigger>What types of reports are supported?</AccordionTrigger>
							<AccordionContent>
								The platform supports both crime reports and facility issue reports.
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value="item-3">
							<AccordionTrigger>Can I view full report details publicly?</AccordionTrigger>
							<AccordionContent>
								The public portal only shows a limited snapshot of the latest submissions.
								Full details are available after login.
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value="item-4">
							<AccordionTrigger>What should I do in an emergency?</AccordionTrigger>
							<AccordionContent>
								Call 999 immediately for life-threatening emergencies. You can also find
								campus contacts under Emergency Services.
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value="item-5">
							<AccordionTrigger>How are reports handled?</AccordionTrigger>
							<AccordionContent>
								Reports are reviewed and assigned to staff, with progress updates recorded until the report is resolved.
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</CardContent>
			</Card>

			<div className="flex flex-col gap-2 sm:flex-row">
				<Button asChild>
					<Link href="/auth/login">Login</Link>
				</Button>
			</div>
		</div>
	);
}

