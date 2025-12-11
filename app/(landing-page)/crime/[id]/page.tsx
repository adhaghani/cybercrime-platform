import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin, Calendar, Clock, AlertTriangle, Shield } from "lucide-react";
import { MOCK_REPORTS } from "@/lib/api/mock-data";
import { CrimeReport, ReportStatus, CrimeCategory } from "@/lib/types";
import { format } from "date-fns";

export default async function PublicCrimeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = MOCK_REPORTS.find((r) => r.id === id && r.type === "CRIME") as CrimeReport | undefined;

  if (!report) {
    notFound();
  }

  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case "PENDING": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "IN_PROGRESS": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "RESOLVED": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "REJECTED": return "bg-red-500/10 text-red-500 border-red-500/20";
    }
  };

  const getCategoryColor = (category: CrimeCategory) => {
    switch (category) {
      case "SOCIAL MEDIA BULLY": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "ONLINE THREAT": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "ONLINE DEFAMATION": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "HARASSMENT": return "bg-pink-500/10 text-pink-500 border-pink-500/20";
      case "OTHER": return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <Button variant="ghost" className="mb-6" asChild>
        <Link href="/crime">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Feed
        </Link>
      </Button>

      <div className="grid gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getCategoryColor(report.crimeCategory)}>
                {report.crimeCategory}
              </Badge>
              <Badge variant="outline" className={getStatusColor(report.status)}>
                {report.status.replace("_", " ")}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{report.title}</h1>
          </div>
          <div className="text-sm text-muted-foreground flex flex-col items-end">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Reported on {format(new Date(report.submittedAt), "PPP")}
            </span>
            <span className="flex items-center gap-1 mt-1">
              <Clock className="h-4 w-4" />
              {format(new Date(report.submittedAt), "p")}
            </span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Incident Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-1">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {report.description}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <h3 className="font-semibold mb-1 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      Location
                    </h3>
                    <p className="text-muted-foreground">{report.location}</p>
                  </div>
                  {report.crimeCategory && (
                    <div>
                      <h3 className="font-semibold mb-1 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        Category
                      </h3>
                      <p className="text-muted-foreground">{report.crimeCategory}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative pl-4 border-l-2 border-muted space-y-6">
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-primary" />
                    <p className="text-sm font-medium">Report Submitted</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(report.submittedAt), "MMM d, yyyy - h:mm a")}
                    </p>
                  </div>
                  
                  {report.updatedAt !== report.submittedAt && (
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-muted-foreground" />
                      <p className="text-sm font-medium">Last Updated</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(report.updatedAt), "MMM d, yyyy - h:mm a")}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground text-center">
                  If you have information regarding this incident, please contact campus security or report it anonymously.
                </p>
                <Button className="w-full mt-4" asChild>
                  <Link href="/contact">Contact Security</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
