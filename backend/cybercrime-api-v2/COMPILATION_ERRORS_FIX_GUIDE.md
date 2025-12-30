# TypeScript Compilation Errors - Fix Guide

## Summary
71 errors found across 14 files after implementing all repositories, services, controllers, and routes.

## Error Categories

### 1. Repository Constructor Issues
**Problem**: Repositories extending BaseRepository/ReportRepository not calling parent constructor

**Affected Files**:
- CrimeRepository.ts
- FacilityRepository.ts  
- ReportRepository.ts
- TeamRepository.ts
- ReportAssignmentRepository.ts
- ResolutionRepository.ts

**Fix**: Add constructor to call super() with table name
```typescript
export class ReportRepository extends BaseRepository<Report> {
  constructor() {
    super('REPORT', 'REPORT_ID');
  }
}
```

### 2. Model Property Issues
**Problem**: Models missing required properties or have incorrect types

**Issues**:
- Crime model: WEAPON_INVOLVED, VICTIM_INVOLVED should be boolean not string
- Facility model: MAINTENANCE_REQUIRED should be boolean not string
- Report model: Missing CREATED_AT property
- Team model: TEAM_LEAD_EMAIL not in TeamData interface
- ReportAssignment model: Missing proper property getters

**Fix**: Update model interfaces and add proper getters

### 3. Middleware Import Issues
**Problem**: @middleware/auth and @middleware/authorize paths not resolving

**Affected Files**:
- report.routes.ts
- crime.routes.ts
- facility.routes.ts
- team.routes.ts

**Fix**: Use relative paths instead
```typescript
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
```

### 4. Report Model Method Issues
**Problem**: Report model missing methods used in services

**Missing Methods**:
- getReportId()
- getReportType()
- getIncidentDate()
- getAnonymous()
- getSubmitterId() (should be getSubmittedBy())

**Fix**: Add proper getter methods to Report model

### 5. Crime/Facility Repository create/update Methods
**Problem**: Child repositories not implementing parent abstract methods

**Fix**: Implement create() and update() methods that:
1. Handle report table operations
2. Handle child table operations
3. Return properly typed objects

### 6. Service Method Signature Issues
**Problem**: Method calls with incorrect parameters

**Issues**:
- reportRepo.search() called with 2 params, expects 1
- reportRepo.getStatistics() called with 1 param, expects 0
- facilityRepo.getTotalEstimatedCost() called with 1 param, expects 0

**Fix**: Update repository method signatures to match usage

### 7. Enum Missing Values
**Status**: ✅ FIXED
- Added UNDER_REVIEW and CLOSED to ReportStatus
- Added HVAC and STRUCTURAL to FacilityType

### 8. Oracle Binding Issues
**Problem**: this.oracledb not accessible in some repositories

**Affected**:
- TeamRepository
- ReportAssignmentRepository
- ResolutionRepository

**Fix**: Import oracledb directly
```typescript
import oracledb from 'oracledb';

// Then use:
id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
```

### 9. Protected Method Access Issues
**Problem**: Services trying to access protected get() method from BaseModel

**Affected**:
- TeamService trying to access team.get('TEAM_LEAD_NAME')

**Fix**: Add public getter methods or make fields public in model

### 10. Type Coercion Issues  
**Problem**: Boolean database values (0/1) being assigned to string properties

**Affected**:
- Crime: WEAPON_INVOLVED, VICTIM_INVOLVED
- Facility: MAINTENANCE_REQUIRED

**Fix**: Update model definitions to use boolean type

## Detailed Fix Plan

### Phase 1: Fix Model Definitions
1. Update Crime model - change string to boolean for WEAPON_INVOLVED, VICTIM_INVOLVED
2. Update Facility model - change string to boolean for MAINTENANCE_REQUIRED
3. Update Report model - add missing getters and CREATED_AT property
4. Update Team model - add TEAM_LEAD_EMAIL to interface
5. Update ReportAssignment model - add proper getters

### Phase 2: Fix Repositories
1. Add constructors to all repositories that extend BaseRepository
2. Fix oracledb access in Team, ReportAssignment, Resolution repositories
3. Implement create/update in Crime and Facility repositories
4. Fix findAll signature in Crime and Facility repositories
5. Update method signatures in ReportRepository

### Phase 3: Fix Services
1. Fix Report model method calls (getReportId, getSubmittedBy, etc.)
2. Update service logic to handle new model structure
3. Fix filter passing to repositories
4. Add proper type handling for boolean fields

### Phase 4: Fix Routes
1. Change @middleware imports to relative paths in all route files

## Quick Wins (Easy Fixes)

1. ✅ Add missing enum values (DONE)
2. Update middleware imports (4 files, same fix)
3. Add repository constructors (6 files, same pattern)
4. Import oracledb directly (3 files, same fix)

## Complex Fixes (Require More Work)

1. Refactor Report/Crime/Facility model hierarchy
2. Implement create/update in child repositories
3. Update service layer to handle new report structure
4. Fix type definitions for boolean fields

## Estimated Fix Time

- Quick wins: 30 minutes
- Model updates: 1 hour
- Repository fixes: 2 hours  
- Service fixes: 2 hours
- Testing: 1 hour

**Total**: ~6-7 hours

## Testing Strategy

1. Fix errors incrementally
2. Run `npm run build` after each phase
3. Test each module's endpoints
4. Verify database operations
5. Run integration tests

## Priority Order

1. **HIGH**: Constructor and import issues (prevents compilation)
2. **HIGH**: Model property type issues (data integrity)
3. **MEDIUM**: Method signature mismatches (functionality)
4. **LOW**: Protected method access (code quality)

## Files Requiring Changes

### Must Fix (Blocking)
- src/models/Crime.ts
- src/models/Facility.ts
- src/models/Report.ts
- src/models/Team.ts
- src/models/ReportAssignment.ts
- src/repositories/ReportRepository.ts
- src/repositories/CrimeRepository.ts
- src/repositories/FacilityRepository.ts
- src/repositories/TeamRepository.ts
- src/repositories/ReportAssignmentRepository.ts
- src/repositories/ResolutionRepository.ts

### Simple Fixes
- src/routes/report.routes.ts
- src/routes/crime.routes.ts
- src/routes/facility.routes.ts
- src/routes/team.routes.ts

### Needs Review
- src/services/ReportService.ts
- src/services/CrimeService.ts
- src/services/FacilityService.ts
- src/services/TeamService.ts

## Next Session Checklist

- [ ] Phase 1: Fix all model definitions
- [ ] Phase 2: Fix all repository constructors and methods
- [ ] Phase 3: Fix service layer
- [ ] Phase 4: Fix route imports
- [ ] Run successful build
- [ ] Create test script
- [ ] Verify all endpoints work

## Notes

The errors are systematic and follow patterns. Most can be fixed with search-and-replace operations. The main complexity is in the Report/Crime/Facility hierarchy which requires careful refactoring of the create/update methods.

Consider creating helper functions for:
- Converting Oracle NUMBER (0/1) to boolean
- Handling report creation with child tables
- Standardizing filter objects across repositories
