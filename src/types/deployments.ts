export interface Deployment {
  id: string;
  name: string;
  startDate: string;   // ISO string
  endDate: string | null; // ISO string, null = ongoing
  notes?: string;
  createdAt: number;
}

export interface DeploymentRange {
  start: Date;
  end: Date;
}
