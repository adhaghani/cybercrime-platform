import { AnyReport, ReportAssignment, Student, Staff, Announcement, GeneratedReport } from "@/lib/types";
import { generateMockReports } from "./data_factory";
// Mock Users
export const MOCK_STUDENTS: Student[] = [
  {
    accountId: "user-1",
    email: "student@uitm.edu.my",
    name: "Ahmad Ali",
    contactNumber: "012-3456789",
    accountType: "STUDENT",
    program: "CS240",
    semester: 4,
    yearOfStudy: 2,
    passwordHash: "hashedpassword1",
    createdAt: "2023-01-15T10:00:00Z",
    updatedAt: "2023-06-20T12:00:00Z",
  },
];

export const MOCK_STAFF: Staff[] = [
  {
    accountId: "staff-1",
    email: "officer@uitm.edu.my",
    name: "Officer Abu",
    contactNumber: "013-9876543",
    role: "STAFF",
    accountType: "STAFF",
    department: "Security",
    position: "Patrol Officer",
    passwordHash: "hashedpassword1",
    createdAt: "2023-01-15T10:00:00Z",
    updatedAt: "2023-06-20T12:00:00Z",
  },
];

// Mock Reports
export const MOCK_REPORTS: AnyReport[] = [
  ...generateMockReports({ count: 105 }),
];

export const MOCK_ASSIGNMENTS: ReportAssignment[] = [
  {
    assignmentId: "assign-1",
    reportId: "rep-2",
    accountId: "staff-1",
    assignedAt: "2023-10-25T09:00:00Z",
    actionTaken: "Technician notified.",
  },
];

// Mock Announcements
export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    announcementId: "ann-1",
    title: "Campus Safety Week 2023",
    message: "Join us for Campus Safety Week from November 1-7. Various activities and workshops on personal safety, crime prevention, and emergency preparedness will be conducted. All students and staff are encouraged to participate.",
    audience: "ALL",
    type: "EVENT",
    status: "PUBLISHED",
    priority: "HIGH",

    startDate: "2023-11-01T00:00:00Z",
    endDate: "2023-11-07T23:59:59Z",
    createdAt: "2023-10-20T10:00:00Z",
    createdBy: "staff-1",
   
    updatedAt: "2023-10-20T10:00:00Z",
  },
  {
    announcementId: "ann-2",
    title: "Emergency Maintenance - Block C",
    message: "Emergency maintenance work will be carried out in Block C on October 30, 2023, from 9:00 AM to 5:00 PM. Water and electricity supply will be temporarily interrupted. Please plan accordingly.",
    audience: "ALL",
    type: "EMERGENCY",
    status: "PUBLISHED",
    priority: "HIGH",
 
    startDate: "2025-12-01T00:00:00Z",
    endDate: "2025-12-30T23:59:59Z",
    createdAt: "2023-10-27T14:30:00Z",
    createdBy: "staff-1",
    
    updatedAt: "2023-10-27T14:30:00Z",
  },
  {
    announcementId: "ann-3",
    title: "New Crime Reporting Portal",
    message: "We are pleased to announce the launch of our new online crime reporting portal. Students and staff can now submit reports 24/7 through this platform. Visit the Crime Terminal section to get started.",
    audience: "ALL",
    type: "GENERAL",
    status: "PUBLISHED",
    priority: "MEDIUM",
    
    startDate: "2025-12-01T00:00:00Z",
    endDate: "2025-12-30T23:59:59Z",
    createdAt: "2023-10-15T09:00:00Z",
    createdBy: "staff-1",
    
    updatedAt: "2023-10-15T09:00:00Z",
  },
  {
    announcementId: "ann-4",
    title: "Updated Emergency Contact Numbers",
    message: "Please note that the UiTM Auxiliary Police emergency contact numbers have been updated. The new hotline is 03-5544-2222. Please update your contact lists accordingly.",
    audience: "ALL",
    type: "GENERAL",
    status: "PUBLISHED",
    priority: "MEDIUM",
    
    startDate: "2023-10-10T00:00:00Z",
    endDate: "2023-11-30T23:59:59Z",
    createdAt: "2023-10-10T11:00:00Z",
    createdBy: "staff-1",
    
    updatedAt: "2023-10-10T11:00:00Z",
  },
  {
    announcementId: "ann-5",
    title: "Staff Training: Report Management",
    message: "Mandatory training session for all staff members on the new report management system. Session will be held on November 5, 2023, at 2:00 PM in Meeting Room A.",
    audience: "STAFF",
    type: "EVENT",
    status: "PUBLISHED",
    priority: "HIGH",
    
    startDate: "2023-10-25T00:00:00Z",
    endDate: "2023-11-05T23:59:59Z",
    createdAt: "2023-10-25T08:00:00Z",
    createdBy: "staff-1",
    
    updatedAt: "2023-10-25T08:00:00Z",
  },
  {
    announcementId: "ann-6",
    title: "Draft: Upcoming Security Policy Changes",
    message: "This is a draft announcement about upcoming changes to campus security policies. Will be published after review.",
    audience: "ALL",
    type: "GENERAL",
    status: "DRAFT",
    priority: "LOW",
    
    startDate: "2023-11-15T00:00:00Z",
    endDate: "2023-12-31T23:59:59Z",
    createdAt: "2023-10-26T15:00:00Z",
    createdBy: "staff-1",
    
    updatedAt: "2023-10-26T15:00:00Z",
  },
];

// Mock Generated Reports
export const MOCK_GENERATED_REPORTS: GeneratedReport[] = [
  {
    generateId: "gen-rep-1",
    generatedBy: "staff-1",
    title: "Monthly Crime Report - October 2023",
    summary: "Comprehensive analysis of crime reports submitted during October 2023. This report includes statistics on crime categories, resolution rates, and location hotspots.",
    dateRangeStart: "2023-10-01T00:00:00Z",
    dateRangeEnd: "2023-10-31T23:59:59Z",
    reportCategory: "CRIME",
    reportDataType: "DETAILED",
    requestedAt: "2023-11-01T09:00:00Z",
    reportData: {
      totalReports: 15,
      pendingReports: 3,
      resolvedReports: 10,
      inProgressReports: 2,
      crimeReports: 15,
      facilityReports: 0,
      reportsByCategory: {
        THEFT: 8,
        ASSAULT: 2,
        VANDALISM: 3,
        HARASSMENT: 1,
        OTHER: 1,
      },
      reportsByStatus: {
        PENDING: 3,
        IN_PROGRESS: 2,
        RESOLVED: 10,
        REJECTED: 0,
      },
      reportsByMonth: [
        { month: "Oct 2023", count: 15 },
      ],
      topLocations: [
        { location: "PTAR Library", count: 5 },
        { location: "Cafeteria", count: 3 },
        { location: "Parking Lot A", count: 2 },
        { location: "Block C", count: 2 },
        { location: "Sports Complex", count: 3 },
      ],
      averageResolutionTime: 3.5,
    },
  },
  {
    generateId: "gen-rep-2",
    generatedBy: "staff-1",
    title: "Facility Issues Summary - Q3 2023",
    summary: "Quarterly summary of facility issues reported across campus. Highlights maintenance priorities and recurring problems.",
    dateRangeStart: "2023-07-01T00:00:00Z",
    dateRangeEnd: "2023-09-30T23:59:59Z",
    reportCategory: "FACILITY",
    reportDataType: "SUMMARY",
    requestedAt: "2023-10-05T14:30:00Z",
    reportData: {
      totalReports: 42,
      pendingReports: 5,
      resolvedReports: 35,
      inProgressReports: 2,
      crimeReports: 0,
      facilityReports: 42,
      reportsByCategory: {
        ELECTRICAL: 15,
        PLUMBING: 12,
        FURNITURE: 8,
        INFRASTRUCTURE: 5,
        OTHER: 2,
      },
      reportsByStatus: {
        PENDING: 5,
        IN_PROGRESS: 2,
        RESOLVED: 35,
        REJECTED: 0,
      },
      reportsByMonth: [
        { month: "Jul 2023", count: 12 },
        { month: "Aug 2023", count: 18 },
        { month: "Sep 2023", count: 12 },
      ],
      topLocations: [
        { location: "Block A", count: 10 },
        { location: "Block C", count: 8 },
        { location: "Library", count: 7 },
        { location: "Cafeteria", count: 6 },
        { location: "Hostel Block 1", count: 11 },
      ],
      averageResolutionTime: 2.1,
    },
  },
  {
    generateId: "gen-rep-3",
    generatedBy: "staff-1",
    title: "Campus User Statistics - 2023",
    summary: "Annual overview of user statistics across the campus including students and staff activity.",
    dateRangeStart: "2023-01-01T00:00:00Z",
    dateRangeEnd: "2023-12-31T23:59:59Z",
    reportCategory: "USER",
    reportDataType: "DETAILED",
    requestedAt: "2023-11-15T10:00:00Z",
    reportData: {
      totalReports: 156,
      pendingReports: 12,
      resolvedReports: 130,
      inProgressReports: 14,
      crimeReports: 48,
      facilityReports: 108,
      reportsByCategory: {
        THEFT: 20,
        ASSAULT: 8,
        VANDALISM: 12,
        HARASSMENT: 5,
        OTHER: 3,
        ELECTRICAL: 35,
        PLUMBING: 28,
        FURNITURE: 25,
        INFRASTRUCTURE: 15,
      },
      reportsByStatus: {
        PENDING: 12,
        IN_PROGRESS: 14,
        RESOLVED: 130,
        REJECTED: 0,
      },
      reportsByMonth: [
        { month: "Jan", count: 10 },
        { month: "Feb", count: 12 },
        { month: "Mar", count: 15 },
        { month: "Apr", count: 11 },
        { month: "May", count: 8 },
        { month: "Jun", count: 5 },
        { month: "Jul", count: 12 },
        { month: "Aug", count: 18 },
        { month: "Sep", count: 14 },
        { month: "Oct", count: 22 },
        { month: "Nov", count: 17 },
        { month: "Dec", count: 12 },
      ],
      topLocations: [
        { location: "PTAR Library", count: 25 },
        { location: "Block A", count: 20 },
        { location: "Cafeteria", count: 18 },
        { location: "Hostel Block 1", count: 15 },
        { location: "Parking Lot A", count: 12 },
      ],
      averageResolutionTime: 2.8,
    },
  },
  {
    generateId: "gen-rep-4",
    generatedBy: "staff-1",
    title: "Weekly Crime Report - Nov Week 4",
    summary: "Weekly summary of crime incidents for the last week of November 2023.",
    dateRangeStart: "2023-11-20T00:00:00Z",
    dateRangeEnd: "2023-11-26T23:59:59Z",
    reportCategory: "CRIME",
    reportDataType: "SUMMARY",
    requestedAt: "2023-11-27T08:00:00Z",
    reportData: null,
  },
];