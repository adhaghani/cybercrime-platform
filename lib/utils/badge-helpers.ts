/**
 * Badge Helper Utilities
 * Centralized functions for generating badge color classes across the application
 */

/**
 * Generate initials from a full name
 * @param name - Full name string
 * @returns Uppercase initials (max 2 characters)
 * @example getInitials("John Doe") => "JD"
 */
export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Get color classes for department badges
 * @param department - Department name
 * @returns Tailwind color classes
 */
export const getDepartmentColor = (department: string): string => {
  const colors: Record<string, string> = {
    "System Administration": "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
    "Campus Security": "bg-red-500/10 text-red-500 hover:bg-red-500/20",
    "IT Services": "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
    "Computer Science": "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
    "Information Technology": "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
    "Facilities Management": "bg-green-500/10 text-green-500 hover:bg-green-500/20",
    "Student Affairs": "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
    "Library Services": "bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20",
    "Software Engineering": "bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20",
    "Academic Affairs": "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
  };
  return colors[department] || "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
};

/**
 * Get color classes for priority badges
 * @param priority - Priority level (HIGH, MEDIUM, LOW)
 * @returns Tailwind color classes
 */
export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case "HIGH":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    case "MEDIUM":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "LOW":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/20";
  }
};

/**
 * Get color classes for announcement type badges
 * @param type - Announcement type (EMERGENCY, EVENT, GENERAL)
 * @returns Tailwind color classes
 */
export const getAnnouncementTypeColor = (type: string): string => {
  switch (type) {
    case "EMERGENCY":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    case "EVENT":
      return "bg-purple-500/10 text-purple-500 border-purple-500/20";
    case "GENERAL":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/20";
  }
};

/**
 * Get color classes for report type badges (CRIME, FACILITY)
 * @param type - Report type
 * @returns Tailwind color classes
 */
export const getReportTypeColor = (type: string): string => {
  return type === "CRIME"
    ? "bg-red-500/10 text-red-500 border-red-500/20"
    : "bg-orange-500/10 text-orange-500 border-orange-500/20";
};

/**
 * Get color classes for generated report data type badges (DETAILED, SUMMARY)
 * @param type - Report data type
 * @returns Tailwind color classes
 */
export const getGeneratedReportTypeColor = (type: string): string => {
  return type === "DETAILED"
    ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
    : "bg-green-500/10 text-green-500 border-green-500/20";
};

/**
 * Get color classes for report category badges
 * @param category - Report category (CRIME, FACILITY, USER, ALL REPORTS)
 * @returns Tailwind color classes
 */
export const getCategoryColor = (category: string): string => {
  switch (category) {
    case "CRIME":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    case "FACILITY":
      return "bg-orange-500/10 text-orange-500 border-orange-500/20";
    case "USER":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case "ALL REPORTS":
      return "bg-purple-500/10 text-purple-500 border-purple-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/20";
  }
};

/**
 * Get color classes for student year badges
 * @param year - Year level (1-4)
 * @returns Tailwind color classes
 */
export const getYearBadgeColor = (year: number): string => {
  switch (year) {
    case 1:
      return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
    case 2:
      return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
    case 3:
      return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
    case 4:
      return "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
  }
};

/**
 * Get color classes for user role badges
 * @param role - User role (STUDENT, STAFF, ADMIN)
 * @returns Tailwind color classes
 */
export const getRoleBadgeColor = (role: string): string => {
  switch (role) {
    case "STUDENT":
      return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
    case "STAFF":
      return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
    case "ADMIN":
      return "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
  }
};

/**
 * Get color classes for announcement status badges
 * @param status - Announcement status (PUBLISHED, DRAFT, ARCHIVED)
 * @returns Tailwind color classes
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case "PUBLISHED":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    case "DRAFT":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "ARCHIVED":
      return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/20";
  }
};
