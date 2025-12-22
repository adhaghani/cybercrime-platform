/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Data Processing Utilities for AI Token Optimization
 * Compresses data before sending to AI to reduce token usage
 */

import type {
  ReportStatus,
  ReportType,
  CrimeCategory,
  FacilityType,
  SeverityLevel,
  GeneratedReportCategory,
  GeneratedReportDataType,
} from './types';

// ============================================================================
// ENUM COMPRESSION MAPS
// ============================================================================

const REPORT_STATUS_MAP: Record<ReportStatus, string> = {
  PENDING: 'P',
  IN_PROGRESS: 'IP',
  RESOLVED: 'R',
  REJECTED: 'RJ',
};

const REPORT_TYPE_MAP: Record<ReportType, string> = {
  CRIME: 'C',
  FACILITY: 'F',
};

const CRIME_CATEGORY_MAP: Record<CrimeCategory, string> = {
  THEFT: 'T',
  ASSAULT: 'A',
  VANDALISM: 'V',
  HARASSMENT: 'H',
  OTHER: 'O',
};

const FACILITY_TYPE_MAP: Record<FacilityType, string> = {
  ELECTRICAL: 'E',
  PLUMBING: 'P',
  FURNITURE: 'F',
  INFRASTRUCTURE: 'I',
  OTHER: 'O',
};

const SEVERITY_LEVEL_MAP: Record<SeverityLevel, string> = {
  LOW: 'L',
  MEDIUM: 'M',
  HIGH: 'H',
  CRITICAL: 'C',
};

const REPORT_CATEGORY_MAP: Record<GeneratedReportCategory, string> = {
  CRIME: 'C',
  FACILITY: 'F',
  USER: 'U',
  'ALL REPORTS': 'A',
};

const DATA_TYPE_MAP: Record<GeneratedReportDataType, string> = {
  SUMMARY: 'S',
  DETAILED: 'D',
};

// Reverse maps for decompression
const REVERSE_STATUS_MAP = Object.fromEntries(
  Object.entries(REPORT_STATUS_MAP).map(([k, v]) => [v, k])
);
const REVERSE_TYPE_MAP = Object.fromEntries(
  Object.entries(REPORT_TYPE_MAP).map(([k, v]) => [v, k])
);

// ============================================================================
// KEY SHORTENING MAPS
// ============================================================================

const REPORT_KEY_MAP: Record<string, string> = {
  reportId: 'id',
  title: 'ttl',
  description: 'desc',
  location: 'loc',
  status: 'st',
  type: 'typ',
  submittedAt: 'sub',
  updatedAt: 'upd',
  submittedBy: 'by',
  attachmentPath: 'att',
  // Crime specific
  crimeCategory: 'cat',
  suspectDescription: 'susp',
  victimInvolved: 'vict',
  injuryLevel: 'inj',
  weaponInvolved: 'wpn',
  evidenceDetails: 'evid',
  // Facility specific
  facilityType: 'ftyp',
  severityLevel: 'sev',
  affectedEquipment: 'eq',
};

// ============================================================================
// CORE PROCESSING FUNCTIONS
// ============================================================================

/**
 * Compress enum values to single characters
 */
export function compressEnum(value: string, type: 'status' | 'type' | 'crime' | 'facility' | 'severity' | 'category' | 'dataType'): string {
  switch (type) {
    case 'status':
      return REPORT_STATUS_MAP[value as ReportStatus] || value;
    case 'type':
      return REPORT_TYPE_MAP[value as ReportType] || value;
    case 'crime':
      return CRIME_CATEGORY_MAP[value as CrimeCategory] || value;
    case 'facility':
      return FACILITY_TYPE_MAP[value as FacilityType] || value;
    case 'severity':
      return SEVERITY_LEVEL_MAP[value as SeverityLevel] || value;
    case 'category':
      return REPORT_CATEGORY_MAP[value as GeneratedReportCategory] || value;
    case 'dataType':
      return DATA_TYPE_MAP[value as GeneratedReportDataType] || value;
    default:
      return value;
  }
}

/**
 * Decompress enum values back to original
 */
export function decompressEnum(value: string, type: 'status' | 'type'): string {
  switch (type) {
    case 'status':
      return REVERSE_STATUS_MAP[value] || value;
    case 'type':
      return REVERSE_TYPE_MAP[value] || value;
    default:
      return value;
  }
}

/**
 * Shorten object keys based on map
 */
export function shortenKeys(obj: any, keyMap: Record<string, string>): any {
  if (!obj || typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => shortenKeys(item, keyMap));
  }
  
  const shortened: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const shortKey = keyMap[key] || key;
    shortened[shortKey] = typeof value === 'object' && value !== null
      ? shortenKeys(value, keyMap)
      : value;
  }
  
  return shortened;
}

/**
 * Expand shortened keys back to original
 */
export function expandKeys(obj: any, keyMap: Record<string, string>): any {
  if (!obj || typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => expandKeys(item, keyMap));
  }
  
  const expanded: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const longKey = keyMap[key] || key;
    expanded[longKey] = typeof value === 'object' && value !== null
      ? expandKeys(value, keyMap)
      : value;
  }
  
  return expanded;
}

/**
 * Strip unused or null fields from object
 */
export function stripUnusedFields(obj: any, essentialFields?: string[]): any {
  if (!obj || typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => stripUnusedFields(item, essentialFields));
  }
  
  const stripped: any = {};
  for (const [key, value] of Object.entries(obj)) {
    // Skip if value is null, undefined, or empty string
    if (value === null || value === undefined || value === '') continue;
    
    // Skip if not in essential fields (if provided)
    if (essentialFields && !essentialFields.includes(key)) continue;
    
    // Recursively process nested objects
    if (typeof value === 'object' && value !== null) {
      const processedValue = stripUnusedFields(value, essentialFields);
      // Only include if processed object is not empty
      if (Object.keys(processedValue).length > 0 || Array.isArray(processedValue)) {
        stripped[key] = processedValue;
      }
    } else {
      stripped[key] = value;
    }
  }
  
  return stripped;
}

/**
 * Truncate long text fields to save tokens
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Format date to compact string (YYYYMMDD)
 */
export function compactDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * Expand compact date back to ISO string
 */
export function expandDate(compactDate: string): string {
  const year = compactDate.substring(0, 4);
  const month = compactDate.substring(4, 6);
  const day = compactDate.substring(6, 8);
  return new Date(`${year}-${month}-${day}`).toISOString();
}

// ============================================================================
// REPORT-SPECIFIC PROCESSING
// ============================================================================

/**
 * Process a single report for AI consumption
 */
export function processReport(report: any, options?: {
  includeDescription?: boolean;
  maxDescriptionLength?: number;
}): any {
  const {
    includeDescription = false,
    maxDescriptionLength = 100,
  } = options || {};
  
  // Define essential fields based on options
  const essentialFields = [
    'title',
    'location',
    'status',
    'type',
    'submittedAt',
    ...(includeDescription ? ['description'] : []),
  ];
  
  // Add type-specific essential fields
  if (report.type === 'CRIME') {
    essentialFields.push('crimeCategory');
  } else if (report.type === 'FACILITY') {
    essentialFields.push('facilityType', 'severityLevel');
  }
  
  // Strip unused fields
  let processed = stripUnusedFields(report, essentialFields);
  
  // Compress enums
  if (processed.status) {
    processed.status = compressEnum(processed.status, 'status');
  }
  if (processed.type) {
    processed.type = compressEnum(processed.type, 'type');
  }
  if (processed.crimeCategory) {
    processed.crimeCategory = compressEnum(processed.crimeCategory, 'crime');
  }
  if (processed.facilityType) {
    processed.facilityType = compressEnum(processed.facilityType, 'facility');
  }
  if (processed.severityLevel) {
    processed.severityLevel = compressEnum(processed.severityLevel, 'severity');
  }
  
  // Truncate description if included
  if (processed.description) {
    processed.description = truncateText(processed.description, maxDescriptionLength);
  }
  
  // Compact dates
  if (processed.submittedAt) {
    processed.submittedAt = compactDate(processed.submittedAt);
  }
  
  // Shorten keys
  processed = shortenKeys(processed, REPORT_KEY_MAP);
  
  return processed;
}

/**
 * Process report statistics for AI consumption
 */
export function processReportStats(stats: {
  totalReports: number;
  byStatus: {
    pending: number;
    inProgress: number;
    resolved: number;
    rejected: number;
  };
  reports: any[];
}, options?: {
  includeDescription?: boolean;
  maxDescriptionLength?: number;
}): any {
  // Process individual reports
  const processedReports = stats.reports.map(report => 
    processReport(report, options)
  );
  
  // Create compressed stats object
  const compressed = {
    tot: stats.totalReports,
    bySt: {
      P: stats.byStatus.pending,
      IP: stats.byStatus.inProgress,
      R: stats.byStatus.resolved,
      RJ: stats.byStatus.rejected,
    },
    rpts: processedReports,
  };
  
  return compressed;
}

/**
 * Calculate token savings estimate
 */
export function estimateTokenSavings(original: any, processed: any): {
  originalSize: number;
  processedSize: number;
  savedBytes: number;
  savedPercentage: number;
} {
  const originalStr = JSON.stringify(original);
  const processedStr = JSON.stringify(processed);
  
  const originalSize = originalStr.length;
  const processedSize = processedStr.length;
  const savedBytes = originalSize - processedSize;
  const savedPercentage = ((savedBytes / originalSize) * 100).toFixed(2);
  
  return {
    originalSize,
    processedSize,
    savedBytes,
    savedPercentage: parseFloat(savedPercentage),
  };
}

// ============================================================================
// MAIN EXPORT FUNCTIONS
// ============================================================================

/**
 * Main function to process report data for AI
 */
export function prepareDataForAI(reportData: {
  totalReports: number;
  byStatus: {
    pending: number;
    inProgress: number;
    resolved: number;
    rejected: number;
  };
  reports: any[];
}, options?: {
  includeDescription?: boolean;
  maxDescriptionLength?: number;
  logSavings?: boolean;
}): any {
  const processed = processReportStats(reportData, options);
  
  if (options?.logSavings) {
    const savings = estimateTokenSavings(reportData, processed);
    console.log('📊 Token Optimization Stats:');
    console.log(`   Original: ${savings.originalSize} bytes`);
    console.log(`   Processed: ${savings.processedSize} bytes`);
    console.log(`   Saved: ${savings.savedBytes} bytes (${savings.savedPercentage}%)`);
  }
  
  return processed;
}

/**
 * Generate optimized context for AI prompt
 */
export function generateOptimizedContext(params: {
  category: GeneratedReportCategory;
  dataType: GeneratedReportDataType;
  dateRangeStart: string;
  dateRangeEnd: string;
  reportData: any;
}): string {
  const {
    category,
    dataType,
    dateRangeStart,
    dateRangeEnd,
    reportData,
  } = params;
  
  // Compress category and data type
  const catCompressed = compressEnum(category, 'category');
  const typeCompressed = compressEnum(dataType, 'dataType');
  
  // Compact dates
  const startCompact = compactDate(dateRangeStart);
  const endCompact = compactDate(dateRangeEnd);
  
  // Process report data
  const processedData = prepareDataForAI(reportData, {
    includeDescription: dataType === 'DETAILED',
    maxDescriptionLength: dataType === 'SUMMARY' ? 50 : 150,
    logSavings: true,
  });
  
  // Build compact context
  const context = {
    cat: catCompressed,
    typ: typeCompressed,
    start: startCompact,
    end: endCompact,
    data: processedData,
  };
  
  return JSON.stringify(context);
}
