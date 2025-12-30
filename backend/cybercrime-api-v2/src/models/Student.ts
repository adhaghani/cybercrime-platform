import { Account, AccountData } from './Account';

export interface StudentData extends AccountData {
  STUDENT_ID?: string;
  PROGRAM: string;
  SEMESTER: number;
  YEAR_OF_STUDY: number;
}

export class Student extends Account {
  constructor(data: StudentData) {
    super(data);
  }

  protected validate(): void {
    super.validate();
    
    if (!this.getProgram()) {
      throw new Error('Student program is required');
    }
    if (!this.getSemester() || this.getSemester() < 1) {
      throw new Error('Valid semester is required');
    }
    if (!this.getYearOfStudy() || this.getYearOfStudy() < 1) {
      throw new Error('Valid year of study is required');
    }
  }

  // Student-specific getters
  getStudentId(): string | undefined {
    return this.get<string>('STUDENT_ID');
  }

  getProgram(): string {
    return this.get<string>('PROGRAM');
  }

  getSemester(): number {
    return this.get<number>('SEMESTER');
  }

  getYearOfStudy(): number {
    return this.get<number>('YEAR_OF_STUDY');
  }

  // Student-specific setters
  setStudentId(id: string): void {
    this.set('STUDENT_ID', id);
  }

  setProgram(program: string): void {
    this.set('PROGRAM', program);
  }

  setSemester(semester: number): void {
    if (semester < 1) {
      throw new Error('Semester must be at least 1');
    }
    this.set('SEMESTER', semester);
  }

  setYearOfStudy(year: number): void {
    if (year < 1) {
      throw new Error('Year of study must be at least 1');
    }
    this.set('YEAR_OF_STUDY', year);
  }
}
