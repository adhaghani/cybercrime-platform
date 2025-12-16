import { AnyReport, ReportStatus, CrimeCategory, FacilityType, SeverityLevel } from "../types";

type ReportFactoryOptions = {
  count: number;
  startIndex?: number;
  /** 0-11 (JS Date month). If omitted, month is randomized. */
  month?: number;
};

export function generateMockReports(
  options: ReportFactoryOptions
): AnyReport[] {
  const { count, startIndex = 1, month } = options;
  const safeFixedMonth = typeof month === "number" ? ((month % 12) + 12) % 12 : undefined;

  return Array.from({ length: count }, (_, i) => {
    const index = startIndex + i;
    const isCrime = index % 4 === 0;

    const monthForThisReport =
      typeof safeFixedMonth === "number" ? safeFixedMonth : Math.floor(Math.random() * 12);

    const statuses: ReportStatus[] = ["PENDING", "IN_PROGRESS", "RESOLVED"];
    const crimeCategories: CrimeCategory[] = ["THEFT", "VANDALISM", "HARASSMENT"];
    const facilityTypes: FacilityType[] = ["ELECTRICAL", "PLUMBING", "FURNITURE", "INFRASTRUCTURE"];
    const severityLevels: SeverityLevel[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

    const base = {
      reportId: `rep-${index}`,
      title: isCrime
        ? `Suspicious Activity Report ${index}`
        : `Facility Issue ${index}`,
      description: isCrime
        ? "Suspicious individual observed within campus premises."
        : "Reported facility malfunction requiring maintenance.",
      location: isCrime
        ? `Campus Zone ${(index % 10) + 1}`
        : `Building ${(index % 12) + 1}, Level ${(index % 5) + 1}`,
      status: statuses[index % 3] as ReportStatus,
      submittedBy: `user-${(index % 5) + 1}`,
      submittedAt: new Date(
        2025,
        monthForThisReport,
        (index % 28) + 1,
        9,
        0,
        0
      ).toISOString(),
      updatedAt: new Date(
        2025,
        monthForThisReport,
        (index % 28) + 1,
        12,
        0,
        0
      ).toISOString(),
    };

    if (isCrime) {
      return {
        ...base,
        type: "CRIME" as const,
        crimeCategory: crimeCategories[index % 3],
        suspectDescription: "Unknown individual wearing dark clothing",
      };
    }

    return {
      ...base,
      type: "FACILITY" as const,
      facilityType: facilityTypes[index % 4],
      severityLevel: severityLevels[index % 4],
    };
  });
}