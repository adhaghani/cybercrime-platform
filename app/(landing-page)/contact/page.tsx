"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function ContactPage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");

	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<h1 className="text-3xl font-bold tracking-tight">Contact</h1>
				<p className="text-muted-foreground">
					Questions or feedback? Send a message to the team.
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Send a message</CardTitle>
					<CardDescription>
						This is a public contact form. For emergencies, call 999.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						className="space-y-4"
						onSubmit={(e) => {
							e.preventDefault();
							toast.success("Message sent", {
								description: "Thanks — we will get back to you soon.",
							});
							setName("");
							setEmail("");
							setMessage("");
						}}
					>
						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="name">Name</Label>
								<Input
									id="name"
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="Your name"
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="you@example.com"
									required
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="message">Message</Label>
							<Textarea
								id="message"
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								placeholder="How can we help?"
								rows={6}
								required
							/>
						</div>

						<Button type="submit">Send</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}

