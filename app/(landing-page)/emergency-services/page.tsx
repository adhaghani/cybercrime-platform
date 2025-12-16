import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, MapPin, Phone } from "lucide-react";

const nationalContacts = [
	{
		id: 1,
		name: "Ibu Pejabat Polis Kontinjen (IPK) Selangor",
		type: "Police",
		state: "Selangor",
		address: "Persiaran Masjid, Seksyen 9, 40000 Shah Alam, Selangor",
		phone: "03-5514 5222",
	},
	{
		id: 2,
		name: "Balai Bomba dan Penyelamat Shah Alam",
		type: "Fire",
		state: "Selangor",
		address: "Jalan Persiaran Perbandaran, Seksyen 14, 40000 Shah Alam, Selangor",
		phone: "03-5519 4444",
	},
	{
		id: 3,
		name: "Hospital Shah Alam",
		type: "Medical",
		state: "Selangor",
		address: "Jalan Persiaran Kayangan, Seksyen 7, 40000 Shah Alam, Selangor",
		phone: "03-5526 3000",
	},
	{
		id: 4,
		name: "Angkatan Pertahanan Awam (APM) Shah Alam",
		type: "Civil Defence",
		state: "Selangor",
		address: "Jalan Lompat Pagar 13/37, Seksyen 13, 40100 Shah Alam, Selangor",
		phone: "03-5510 6323",
	},
];

const uitmAuxPolice = [
	{
		id: 1,
		campus: "UiTM Shah Alam (Main Campus)",
		state: "Selangor",
		address: "Bangunan Keselamatan, UiTM Shah Alam, 40450 Shah Alam, Selangor",
		phone: "03-5544 2000",
		hotline: "03-5544 2222",
		email: "pb_uitm@uitm.edu.my",
		operatingHours: "24 Hours",
	},
	{
		id: 2,
		campus: "UiTM Puncak Alam",
		state: "Selangor",
		address: "Pejabat Polis Bantuan, UiTM Cawangan Selangor, Kampus Puncak Alam",
		phone: "03-3258 4000",
		hotline: "03-3258 4111",
		email: "pb_puncakalam@uitm.edu.my",
		operatingHours: "24 Hours",
	},
];

export default function PublicEmergencyServicesPage() {
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

			<section className="space-y-4">
				<div>
					<h2 className="text-xl font-semibold">National Emergency Contacts</h2>
					<p className="text-sm text-muted-foreground">
						Police, Fire, Medical, and Civil Defence contacts (sample directory).
					</p>
				</div>

				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{nationalContacts.map((contact) => (
						<Card key={contact.id} className="flex flex-col">
							<CardHeader className="space-y-2">
								<div className="flex items-start justify-between gap-2">
									<CardTitle className="text-base leading-snug">{contact.name}</CardTitle>
									<Badge variant="outline">{contact.type}</Badge>
								</div>
								<CardDescription>{contact.state}</CardDescription>
							</CardHeader>
							<CardContent className="flex-1 space-y-3">
								<div className="flex items-start gap-2 text-sm text-muted-foreground">
									<MapPin className="h-4 w-4 mt-0.5 shrink-0" />
									<span>{contact.address}</span>
								</div>
								<Button asChild variant="outline" className="w-full">
									<a href={`tel:${contact.phone.replace(/\s/g, "")}`}>
										<Phone className="mr-2 h-4 w-4" />
										{contact.phone}
									</a>
								</Button>
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			<Separator />

			<section className="space-y-4">
				<div>
					<h2 className="text-xl font-semibold">UiTM Auxiliary Police</h2>
					<p className="text-sm text-muted-foreground">
						Campus security contacts for UiTM.
					</p>
				</div>

				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{uitmAuxPolice.map((station) => (
						<Card key={station.id} className="flex flex-col">
							<CardHeader>
								<CardTitle className="text-base">{station.campus}</CardTitle>
								<CardDescription>
									{station.state} • {station.operatingHours}
								</CardDescription>
							</CardHeader>
							<CardContent className="flex-1 space-y-3">
								<div className="flex items-start gap-2 text-sm text-muted-foreground">
									<MapPin className="h-4 w-4 mt-0.5 shrink-0" />
									<span>{station.address}</span>
								</div>
								<div className="flex items-center gap-2 text-sm text-muted-foreground">
									<Mail className="h-4 w-4" />
									<span>{station.email}</span>
								</div>
								<div className="grid gap-2">
									<Button asChild variant="destructive" className="w-full">
										<a href={`tel:${station.hotline.replace(/\s/g, "")}`}>Emergency: {station.hotline}</a>
									</Button>
									<Button asChild variant="outline" className="w-full">
										<a href={`tel:${station.phone.replace(/\s/g, "")}`}>Office: {station.phone}</a>
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</section>
		</div>
	);
}

