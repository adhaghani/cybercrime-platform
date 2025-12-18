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

    if(report.type === "FACILITY"){
        
        report = report as Facility;
        return (
        <Card key={report.reportId} className="hover:bg-accent/50 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-xl">{report.title}</CardTitle>
                  <CardDescription className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {report.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(report.submittedAt), "MMM d, yyyy")}
                    </span>
                  </CardDescription>
                </div>
                <div className="flex flex-col gap-2">
                  <StatusBadge status={report.status} />
                  <FacilitySeverityBadge severityLevel={report.severityLevel} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {report.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Type: {report.facilityType}
                </span>
                <div className="flex justify-between items-center gap-2">
                
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/facility/reports/${report.reportId}`}>
                    View Details
                  </Link>
                </Button>

                </div>
              </div>
            </CardContent>
          </Card>)
    }
    else if(report.type === "CRIME"){

        report = report as Crime;
        return (            <Card key={report.reportId} className="hover:bg-accent/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{report.title}</CardTitle>
                    <CardDescription className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {report.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(report.submittedAt), "MMM d, yyyy")}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-2">
                    <StatusBadge status={report.status} />
                    <CrimeCategoryBadge category={report.crimeCategory} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {report.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Category: {report.crimeCategory}
                  </span>
                  <div className="flex justify-between items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/crime/reports/${report.reportId}`}>
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