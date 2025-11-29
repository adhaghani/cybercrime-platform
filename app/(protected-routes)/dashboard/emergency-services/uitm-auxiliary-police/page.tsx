"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Search, Mail, Clock } from "lucide-react";

// Mock data structure - User will fill this with accurate data
const policeStations = [
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
  {
    id: 3,
    campus: "UiTM Machang",
    state: "Kelantan",
    address: "Unit Polis Bantuan, UiTM Cawangan Kelantan, Kampus Machang, 18500 Machang, Kelantan",
    phone: "09-976 2000",
    hotline: "09-976 2222",
    email: "pb_kelantan@uitm.edu.my",
    operatingHours: "24 Hours",
  },
  {
    id: 4,
    campus: "UiTM Arau",
    state: "Perlis",
    address: "Unit Polis Bantuan, UiTM Cawangan Perlis, Kampus Arau, 02600 Arau, Perlis",
    phone: "04-988 2000",
    hotline: "04-988 2222",
    email: "pb_perlis@uitm.edu.my",
    operatingHours: "24 Hours",
  },
  {
    id: 5,
    campus: "UiTM Merbok",
    state: "Kedah",
    address: "Unit Polis Bantuan, UiTM Cawangan Kedah, Kampus Merbok, 08400 Merbok, Kedah",
    phone: "04-456 2000",
    hotline: "04-456 2222",
    email: "pb_kedah@uitm.edu.my",
    operatingHours: "24 Hours",
  },
  {
    id: 6,
    campus: "UiTM Permatang Pauh",
    state: "Pulau Pinang",
    address: "Unit Polis Bantuan, UiTM Cawangan Pulau Pinang, Kampus Permatang Pauh, 13500 Permatang Pauh, Pulau Pinang",
    phone: "04-382 2000",
    hotline: "04-382 2222",
    email: "pb_penang@uitm.edu.my",
    operatingHours: "24 Hours",
  },
  {
    id: 7,
    campus: "UiTM Seri Iskandar",
    state: "Perak",
    address: "Unit Polis Bantuan, UiTM Cawangan Perak, Kampus Seri Iskandar, 32610 Seri Iskandar, Perak",
    phone: "05-374 2000",
    hotline: "05-374 2222",
    email: "pb_perak@uitm.edu.my",
    operatingHours: "24 Hours",
  },
  {
    id: 8,
    campus: "UiTM Jengka",
    state: "Pahang",
    address: "Unit Polis Bantuan, UiTM Cawangan Pahang, Kampus Jengka, 26400 Bandar Tun Abdul Razak Jengka, Pahang",
    phone: "09-460 2000",
    hotline: "09-460 2222",
    email: "pb_pahang@uitm.edu.my",
    operatingHours: "24 Hours",
  },
  {
    id: 9,
    campus: "UiTM Kuala Pilah",
    state: "Negeri Sembilan",
    address: "Unit Polis Bantuan, UiTM Cawangan Negeri Sembilan, Kampus Kuala Pilah, 72000 Kuala Pilah, Negeri Sembilan",
    phone: "06-483 2000",
    hotline: "06-483 2222",
    email: "pb_n9@uitm.edu.my",
    operatingHours: "24 Hours",
  },
  {
    id: 10,
    campus: "UiTM Alor Gajah",
    state: "Melaka",
    address: "Unit Polis Bantuan, UiTM Cawangan Melaka, Kampus Alor Gajah, 78000 Alor Gajah, Melaka",
    phone: "06-558 2000",
    hotline: "06-558 2222",
    email: "pb_melaka@uitm.edu.my",
    operatingHours: "24 Hours",
  },
  {
    id: 11,
    campus: "UiTM Segamat",
    state: "Johor",
    address: "Unit Polis Bantuan, UiTM Cawangan Johor, Kampus Segamat, 85000 Segamat, Johor",
    phone: "07-935 2000",
    hotline: "07-935 2222",
    email: "pb_johor@uitm.edu.my",
    operatingHours: "24 Hours",
  },
  {
    id: 12,
    campus: "UiTM Dungun",
    state: "Terengganu",
    address: "Unit Polis Bantuan, UiTM Cawangan Terengganu, Kampus Dungun, 23000 Dungun, Terengganu",
    phone: "09-840 0000",
    hotline: "09-840 2222",
    email: "pb_terengganu@uitm.edu.my",
    operatingHours: "24 Hours",
  },
  {
    id: 13,
    campus: "UiTM Kota Samarahan",
    state: "Sarawak",
    address: "Unit Polis Bantuan, UiTM Cawangan Sarawak, Kampus Samarahan, 94300 Kota Samarahan, Sarawak",
    phone: "082-677 200",
    hotline: "082-677 222",
    email: "pb_sarawak@uitm.edu.my",
    operatingHours: "24 Hours",
  },
  {
    id: 14,
    campus: "UiTM Kota Kinabalu",
    state: "Sabah",
    address: "Unit Polis Bantuan, UiTM Cawangan Sabah, Kampus Kota Kinabalu, 88997 Kota Kinabalu, Sabah",
    phone: "088-325 000",
    hotline: "088-325 222",
    email: "pb_sabah@uitm.edu.my",
    operatingHours: "24 Hours",
  },
];

export default function UitmAuxiliaryPolicePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStations = policeStations.filter((station) =>
    station.campus.toLowerCase().includes(searchQuery.toLowerCase()) ||
    station.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">UiTM Auxiliary Police</h1>
        <p className="text-muted-foreground">
          Directory of UiTM Auxiliary Police (Polis Bantuan) units across all campuses in Malaysia.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by campus or state..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredStations.map((station) => (
          <Card key={station.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl">{station.campus}</CardTitle>
              <CardDescription>{station.state}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-2">
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="h-4 w-4 mt-1 shrink-0" />
                <span>{station.address}</span>
              </div>
              
              <div className="flex flex-wrap gap-3 items-center ">
                <div className="flex items-center gap-3 text-sm">
                   <Mail className="h-4 w-4 shrink-0" />
                   <span>{station.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                   <Clock className="h-4 w-4 shrink-0" />
                   <span>{station.operatingHours}</span>
                </div>

              </div>
            </CardContent>
            <CardFooter className="gap-2 flex-wrap">                
                <Button className="w-full" variant="destructive">
                        Emergency: {station.hotline}
                </Button>
                 {station.phone && (
                    <Button className="w-full" variant="outline">
                            Office: {station.phone}
                    </Button>
                 )}</CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredStations.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No results found for &quot;{searchQuery}&quot;
        </div>
      )}
    </div>
  );
}