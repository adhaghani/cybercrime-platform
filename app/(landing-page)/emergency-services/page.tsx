"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useState } from "react";

type EmergencyContact = {
	EMERGENCY_ID: number;
	NAME: string;
	TYPE: string;
	STATE: string;
	ADDRESS: string;
	PHONE: string;
	EMAIL?: string;
	HOTLINE?: string;
};

export default function PublicEmergencyServicesPage() {
	const [contacts, setContacts] = useState<EmergencyContact[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchEmergencyContacts = async () => {
			try {
				const response = await fetch('/api/emergency/public');
				if (!response.ok) throw new Error('Failed to fetch emergency contacts');
				const data = await response.json();
				setContacts(data);
			} catch (err) {
				console.error('Error fetching emergency contacts:', err);
				setError('Failed to load emergency contacts');
			} finally {
				setLoading(false);
			}
		};

		fetchEmergencyContacts();
	}, []);

	// Group contacts by type
	const nationalContacts = contacts.filter(
		c => c.TYPE && !c.TYPE.includes('UiTM') && !c.TYPE.includes('Campus')
	);
	const uitmContacts = contacts.filter(
		c => c.TYPE && (c.TYPE.includes('UiTM') || c.TYPE.includes('Campus'))
	);

	if (loading) {
		return (
			<div className="space-y-8">
				<Skeleton className="h-12 w-1/3" />
				<Skeleton className="h-8 w-1/2" />
				<Skeleton className="h-32" />
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{Array.from({ length: 6 }).map((_, i) => (
						<Skeleton key={i} className="h-64" />
					))}
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="space-y-8">
				<h1 className="text-3xl font-bold tracking-tight">Emergency Services</h1>
				<Card className="border-destructive">
					<CardContent className="pt-6">
						<p className="text-destructive">{error}</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<div className="space-y-2">
				<h1 className="text-3xl font-bold tracking-tight">Emergency Services</h1>
				<p className="text-muted-foreground">
					Quick access to national emergency services and UiTM auxiliary police contacts.
				</p>
			</div>

			<Card className="border-destructive">
				<CardHeader>
					<CardTitle className="text-destructive">National Emergency Hotline</CardTitle>
					<CardDescription>For life-threatening emergencies in Malaysia</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-3">
					<Button asChild variant="destructive" size="lg" className="h-14 text-xl font-bold">
						<a href="tel:999">Call 999</a>
					</Button>
					<Button asChild variant="outline" size="lg" className="h-12 text-base font-semibold">
						<a href="tel:112">Call 112 (mobile)</a>
					</Button>
				</CardContent>
			</Card>

			<Separator />

			{nationalContacts.length > 0 && (
				<section className="space-y-4">
					<div>
						<h2 className="text-xl font-semibold">National Emergency Contacts</h2>
						<p className="text-sm text-muted-foreground">
							Police, Fire, Medical, and Civil Defence contacts.
						</p>
					</div>

					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{nationalContacts.map((contact) => (
							<Card key={contact.EMERGENCY_ID} className="flex flex-col">
								<CardHeader className="space-y-2">
									<div className="flex items-start justify-between gap-2">
										<CardTitle className="text-base leading-snug">{contact.NAME}</CardTitle>
										<Badge variant="outline">{contact.TYPE}</Badge>
									</div>
									<CardDescription>{contact.STATE}</CardDescription>
								</CardHeader>
								<CardContent className="flex-1 space-y-3">
									<div className="flex items-start gap-2 text-sm text-muted-foreground">
										<MapPin className="h-4 w-4 mt-0.5 shrink-0" />
										<span>{contact.ADDRESS}</span>
									</div>
									{contact.EMAIL && (
										<div className="flex items-center gap-2 text-sm text-muted-foreground">
											<Mail className="h-4 w-4" />
											<span>{contact.EMAIL}</span>
										</div>
									)}
									<div className="grid gap-2">
										{contact.HOTLINE && (
											<Button asChild variant="destructive" className="w-full">
												<a href={`tel:${contact.HOTLINE.replace(/\s/g, "")}`}>
													Emergency: {contact.HOTLINE}
												</a>
											</Button>
										)}
										<Button asChild variant="outline" className="w-full">
											<a href={`tel:${contact.PHONE.replace(/\s/g, "")}`}>
												<Phone className="mr-2 h-4 w-4" />
												{contact.PHONE}
											</a>
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</section>
			)}

			{nationalContacts.length > 0 && uitmContacts.length > 0 && <Separator />}

			{uitmContacts.length > 0 && (
				<section className="space-y-4">
					<div>
						<h2 className="text-xl font-semibold">UiTM Auxiliary Police</h2>
						<p className="text-sm text-muted-foreground">
							Campus security contacts for UiTM.
						</p>
					</div>

					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{uitmContacts.map((station) => (
							<Card key={station.EMERGENCY_ID} className="flex flex-col">
								<CardHeader>
									<CardTitle className="text-base">{station.NAME}</CardTitle>
									<CardDescription>
										{station.STATE} • 24 Hours
									</CardDescription>
								</CardHeader>
								<CardContent className="flex-1 space-y-3">
									<div className="flex items-start gap-2 text-sm text-muted-foreground">
										<MapPin className="h-4 w-4 mt-0.5 shrink-0" />
										<span>{station.ADDRESS}</span>
									</div>
									{station.EMAIL && (
										<div className="flex items-center gap-2 text-sm text-muted-foreground">
											<Mail className="h-4 w-4" />
											<span>{station.EMAIL}</span>
										</div>
									)}
									<div className="grid gap-2">
										{station.HOTLINE && (
											<Button asChild variant="destructive" className="w-full">
												<a href={`tel:${station.HOTLINE.replace(/\s/g, "")}`}>
													Emergency: {station.HOTLINE}
												</a>
											</Button>
										)}
										<Button asChild variant="outline" className="w-full">
											<a href={`tel:${station.PHONE.replace(/\s/g, "")}`}>
												Office: {station.PHONE}
											</a>
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</section>
			)}

			{contacts.length === 0 && (
				<Card>
					<CardContent className="pt-6 text-center text-muted-foreground">
						No emergency contacts available at the moment.
					</CardContent>
				</Card>
			)}
		</div>
	);
}

