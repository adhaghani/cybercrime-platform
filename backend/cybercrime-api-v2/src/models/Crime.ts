import { Report, ReportData } from './Report';
import { CrimeCategory, SeverityLevel } from '../types/enums';

export interface CrimeData extends ReportData {
  CRIME_CATEGORY: CrimeCategory;
  SUSPECT_DESCRIPTION?: string;
  VICTIM_INVOLVED?: string;
  INJURY_LEVEL?: SeverityLevel;
  WEAPON_INVOLVED?: string;
  EVIDENCE_DETAILS?: string;
}

export class Crime extends Report {
  constructor(data: CrimeData) {
    super(data);
  }

  protected validate(): void {
    super.validate();
    if (!this.getCrimeCategory()) {
      throw new Error('Crime category is required');
    }
  }

  // Crime-specific getters
  getCrimeCategory(): CrimeCategory {
    return this.get<CrimeCategory>('CRIME_CATEGORY');
  }

  getSuspectDescription(): string | undefined {
    return this.get<string>('SUSPECT_DESCRIPTION');
  }

  getVictimInvolved(): string | undefined {
    return this.get<string>('VICTIM_INVOLVED');
  }

  getInjuryLevel(): SeverityLevel | undefined {
    return this.get<SeverityLevel>('INJURY_LEVEL');
  }

  getWeaponInvolved(): string | undefined {
    return this.get<string>('WEAPON_INVOLVED');
  }

  getEvidenceDetails(): string | undefined {
    return this.get<string>('EVIDENCE_DETAILS');
  }

  // Crime-specific setters
  setCrimeCategory(category: CrimeCategory): void {
    this.set('CRIME_CATEGORY', category);
  }

  setSuspectDescription(description: string): void {
    this.set('SUSPECT_DESCRIPTION', description);
  }

  setVictimInvolved(victim: string): void {
    this.set('VICTIM_INVOLVED', victim);
  }

  setInjuryLevel(level: SeverityLevel): void {
    this.set('INJURY_LEVEL', level);
  }

  setWeaponInvolved(weapon: string): void {
    this.set('WEAPON_INVOLVED', weapon);
  }

  setEvidenceDetails(details: string): void {
    this.set('EVIDENCE_DETAILS', details);
  }
}
