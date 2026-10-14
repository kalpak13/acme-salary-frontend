export interface DashboardAnalytics {
  totalPayroll: number;
  headcount: number;
  averageSalaryByDepartment: Record<string, number>;
  averageSalaryByCountry: Record<string, number>;
}