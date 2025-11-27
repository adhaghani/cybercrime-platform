import { AnyReport, ReportAssignment, Student, Staff } from "@/lib/types";

// Mock Users
export const MOCK_STUDENTS: Student[] = [
  {
    id: "user-1",
    email: "student@uitm.edu.my",
    name: "Ahmad Ali",
    contactNumber: "012-3456789",
    role: "STUDENT",
    studentId: "2023123456",
    program: "CS240",
    semester: 4,
    yearOfStudy: 2,
  },
];

export const MOCK_STAFF: Staff[] = [
  {
    id: "staff-1",
    email: "officer@uitm.edu.my",
    name: "Officer Abu",
    contactNumber: "013-9876543",
    role: "STAFF",
    staffId: "S12345",
    department: "Security",
    position: "Patrol Officer",
  },
];

// Mock Reports
export const MOCK_REPORTS: AnyReport[] = [
  {
    id: "rep-1",
    type: "CRIME",
    title: "Laptop Theft at Library",
    description: "My laptop was stolen while I went to the restroom.",
    location: "PTAR Library, Level 3",
    status: "PENDING",
    submittedBy: "user-1",
    submittedAt: "2023-10-25T10:30:00Z",
    updatedAt: "2023-10-25T10:30:00Z",
    crimeCategory: "THEFT",
    suspectDescription: "Unknown",
  },
  {
    id: "rep-2",
    type: "FACILITY",
    title: "Broken Street Light",
    description: "Street light near College Mawar is not working.",
    location: "College Mawar, Block A",
    status: "IN_PROGRESS",
    submittedBy: "user-1",
    submittedAt: "2023-10-24T20:15:00Z",
    updatedAt: "2023-10-25T09:00:00Z",
    facilityType: "ELECTRICAL",
    severityLevel: "MEDIUM",
  },
];

export const MOCK_ASSIGNMENTS: ReportAssignment[] = [
  {
    id: "assign-1",
    reportId: "rep-2",
    assignedTo: "staff-1",
    assignedAt: "2023-10-25T09:00:00Z",
    status: "IN_PROGRESS",
    actionTaken: "Technician notified.",
  },
];
