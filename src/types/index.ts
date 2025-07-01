export interface Project {
  id: string;
  name: string;
  color: string;
  description?: string;
  createdAt: Date;
}

export interface TimeEntry {
  id: string;
  projectId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in milliseconds
  date: string; // YYYY-MM-DD format
}

export interface ActiveTimer {
  projectId: string;
  startTime: Date;
}

export interface DailyReport {
  date: string;
  totalHours: number;
  projects: {
    projectId: string;
    projectName: string;
    hours: number;
    color: string;
  }[];
}