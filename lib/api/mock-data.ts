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
  {
    id: "rep-3",
    type: "FACILITY",
    title: "Leaking Pipe in Restroom",
    description: "Water is continuously leaking from the ceiling pipe in the Level 2 male restroom.",
    location: "Faculty of Computer Science, Level 2",
    status: "PENDING",
    submittedBy: "user-1",
    submittedAt: "2023-10-26T08:00:00Z",
    updatedAt: "2023-10-26T08:00:00Z",
    facilityType: "PLUMBING",
    severityLevel: "HIGH",
  },
  {
    id: "rep-4",
    type: "FACILITY",
    title: "Broken Chair in Classroom",
    description: "Multiple chairs are broken and unusable in the lecture hall.",
    location: "Block D, Room 305",
    status: "RESOLVED",
    submittedBy: "user-2",
    submittedAt: "2023-10-20T14:30:00Z",
    updatedAt: "2023-10-23T10:00:00Z",
    facilityType: "FURNITURE",
    severityLevel: "LOW",
  },
  {
    id: "rep-5",
    type: "FACILITY",
    title: "Cracked Pavement Near Main Gate",
    description: "Large crack on the pavement poses a safety hazard to pedestrians.",
    location: "Main Gate Entrance",
    status: "PENDING",
    submittedBy: "user-2",
    submittedAt: "2023-10-27T11:15:00Z",
    updatedAt: "2023-10-27T11:15:00Z",
    facilityType: "INFRASTRUCTURE",
    severityLevel: "CRITICAL",
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
