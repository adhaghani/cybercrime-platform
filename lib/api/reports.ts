import { AnyReport, Report } from "@/lib/types";
import { MOCK_REPORTS } from "./mock-data";

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const reportsApi = {
  getAll: async (): Promise<AnyReport[]> => {
    await delay(500);
    return [...MOCK_REPORTS];
  },

  getById: async (id: string): Promise<AnyReport | undefined> => {
    await delay(300);
    return MOCK_REPORTS.find((r) => r.id === id);
  },

  create: async (data: Omit<AnyReport, "id" | "submittedAt" | "updatedAt" | "status">): Promise<AnyReport> => {
    await delay(800);
    const newReport: AnyReport = {
      ...data,
      id: `rep-${Date.now()}`,
      status: "PENDING",
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as AnyReport; // Casting for simplicity in mock
    
    // In a real app, we would push to DB. Here we just return it.
    // MOCK_REPORTS.push(newReport); // Uncomment to persist in memory during session
    return newReport;
  },

  updateStatus: async (id: string, status: Report["status"]): Promise<Report | undefined> => {
    await delay(500);
    const report = MOCK_REPORTS.find((r) => r.id === id);
    if (report) {
      report.status = status;
      report.updatedAt = new Date().toISOString();
    }
    return report;
  }
};
