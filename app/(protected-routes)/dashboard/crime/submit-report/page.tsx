"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";
import { CrimeCategory } from "@/lib/types";

export default function SubmitCrimeReportPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    crimeCategory: "" as CrimeCategory | "",
    suspectDescription: "",
    victimInvolved: "",
    weaponInvolved: "",
    injuryLevel: "",
    evidenceDetails: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.crimeCategory) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("Crime report submitted successfully!");
    router.push("/dashboard/crime/my-reports");
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/crime">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Submit Crime Report</h1>
          <p className="text-muted-foreground">
            Report a crime incident that occurred on campus.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Details</CardTitle>
          <CardDescription>
            Provide detailed information about the crime incident. For emergencies, call 999.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Brief description of the incident"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="crimeCategory">Crime Category *</Label>
              <Select
                value={formData.crimeCategory}
                onValueChange={(value) => setFormData({ ...formData, crimeCategory: value as CrimeCategory })}
                required
              >
                <SelectTrigger id="crimeCategory">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="THEFT">Theft</SelectItem>
                  <SelectItem value="ASSAULT">Assault</SelectItem>
                  <SelectItem value="VANDALISM">Vandalism</SelectItem>
                  <SelectItem value="HARASSMENT">Harassment</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="Where did the incident occur?"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Detailed description of what happened..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="suspectDescription">Suspect Description (Optional)</Label>
                <Textarea
                  id="suspectDescription"
                  placeholder="Physical appearance, clothing, etc."
                  value={formData.suspectDescription}
                  onChange={(e) => setFormData({ ...formData, suspectDescription: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="victimInvolved">Victim Information (Optional)</Label>
                <Textarea
                  id="victimInvolved"
                  placeholder="Who was affected by this incident?"
                  value={formData.victimInvolved}
                  onChange={(e) => setFormData({ ...formData, victimInvolved: e.target.value })}
                  rows={3}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="weaponInvolved">Weapon Involved (Optional)</Label>
                <Input
                  id="weaponInvolved"
                  placeholder="Description of any weapons used"
                  value={formData.weaponInvolved}
                  onChange={(e) => setFormData({ ...formData, weaponInvolved: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="injuryLevel">Injury Level (Optional)</Label>
                <Select
                  value={formData.injuryLevel}
                  onValueChange={(value) => setFormData({ ...formData, injuryLevel: value })}
                >
                  <SelectTrigger id="injuryLevel">
                    <SelectValue placeholder="Select injury level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">None</SelectItem>
                    <SelectItem value="MINOR">Minor</SelectItem>
                    <SelectItem value="MODERATE">Moderate</SelectItem>
                    <SelectItem value="SEVERE">Severe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="evidenceDetails">Evidence Details (Optional)</Label>
              <Textarea
                id="evidenceDetails"
                placeholder="Description of any evidence (photos, videos, witnesses, etc.)"
                value={formData.evidenceDetails}
                onChange={(e) => setFormData({ ...formData, evidenceDetails: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="attachment">Attachment (Optional)</Label>
              <div className="flex items-center gap-2">
                <Input id="attachment" type="file" accept="image/*,video/*" />
                <Upload className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">
                Upload photos or videos as evidence (max 10MB)
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/crime">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
