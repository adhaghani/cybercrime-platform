import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from '../ui/statusBadge';
import FacilitySeverityBadge from '../ui/facilitySeverityBadge';
import CrimeCategoryBadge from '../ui/crimeCategoryBadge';
import {  MapPin, Calendar } from "lucide-react";
import { Facility, Crime } from '@/lib/types'
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from 'next/link';


const ReportCard = ({ report }: { report: Facility | Crime }) => {
  console.log("Report in ReportCard:", report);
    if(report.TYPE === "FACILITY"){
        
        report = report as Facility;
        return (
        <Card key={report.REPORT_ID} className="hover:bg-accent/50 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-xl">{report.TITLE}</CardTitle>
                  <CardDescription className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {report.LOCATION}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(report.SUBMITTED_AT), "MMM d, yyyy")}
                    </span>
                  </CardDescription>
                </div>
                <div className="flex flex-col gap-2">
                  <StatusBadge status={report.STATUS} />
                  <FacilitySeverityBadge severityLevel={report.SEVERITY_LEVEL} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {report.DESCRIPTION}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Type: {report.FACILITY_TYPE}
                </span>
                <div className="flex justify-between items-center gap-2">
                
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/facility/reports/${report.REPORT_ID}`}>
                    View Details
                  </Link>
                </Button>

                </div>
              </div>
            </CardContent>
          </Card>)
    }
    else if(report.TYPE === "CRIME"){

        report = report as Crime;
        return (            <Card key={report.REPORT_ID} className="hover:bg-accent/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{report.TITLE}</CardTitle>
                    <CardDescription className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {report.LOCATION}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(report.SUBMITTED_AT), "MMM d, yyyy")}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-2">
                    <StatusBadge status={report.STATUS} />
                    <CrimeCategoryBadge category={report.CRIME_CATEGORY} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {report.DESCRIPTION}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Category: {report.CRIME_CATEGORY}
                  </span>
                  <div className="flex justify-between items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/crime/reports/${report.REPORT_ID}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>)
    }

  return (
    <div>ReportCard</div>
  )
}

export default ReportCard