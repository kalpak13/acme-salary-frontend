import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DashboardAnalytics } from '../models/dashboard-analytics.model';
import { Employee } from '../models/employee.model';
import { PageResponse } from '../models/page-response.model';
import { environment } from '../../environments/environment';
interface BackendDashboardAnalytics {
  totalPayroll: number;
  headcount: number;
  averageSalariesByDepartment: Record<string, number>;
  averageSalariesByCountry: Record<string, number>;
}

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/api';

  getEmployees(
    page: number,
    size: number,
    department?: string,
    country?: string,
  ): Observable<PageResponse<Employee>> {
    let params = new HttpParams().set('page', page).set('size', size);

    if (department?.trim()) {
      params = params.set('department', department.trim());
    }
    if (country?.trim()) {
      params = params.set('country', country.trim());
    }

    return this.http.get<PageResponse<Employee>>(`${this.apiUrl}/employees`, { params });
  }

  addEmployee(employee: Partial<Employee>): Observable<Employee> {
    return this.http.post<Employee>(`${this.apiUrl}/employees`, employee);
  }

  updateEmployee(id: number, employee: Partial<Employee>): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/employees/${id}`, employee);
  }

  getDashboardAnalytics(): Observable<DashboardAnalytics> {
    return this.http
      .get<BackendDashboardAnalytics>(`${this.apiUrl}/analytics/dashboard`)
      .pipe(
        map((response) => ({
          totalPayroll: response.totalPayroll,
          headcount: response.headcount,
          averageSalaryByDepartment: response.averageSalariesByDepartment,
          averageSalaryByCountry: response.averageSalariesByCountry,
        })),
      );
  }
}