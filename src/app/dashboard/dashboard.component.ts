import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { DashboardAnalytics } from '../models/dashboard-analytics.model';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe, DecimalPipe, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly employeeService = inject(EmployeeService);

  protected readonly analytics = signal<DashboardAnalytics | null>(null);
  protected readonly loading = signal(true);
  protected readonly loadError = signal(false);

  protected readonly departmentAverages = computed(() =>
    this.toSalaryEntries(this.analytics()?.averageSalaryByDepartment),
  );
  protected readonly countryAverages = computed(() =>
    this.toSalaryEntries(this.analytics()?.averageSalaryByCountry),
  );
  protected readonly maxDepartmentAverage = computed(() =>
    Math.max(0, ...this.departmentAverages().map(({ average }) => average)),
  );
  protected readonly maxCountryAverage = computed(() =>
    Math.max(0, ...this.countryAverages().map(({ average }) => average)),
  );

  ngOnInit(): void {
    this.loadAnalytics();
  }

  protected retry(): void {
    this.loadAnalytics();
  }

  protected barWidth(average: number, maximum: number): number {
    return maximum > 0 ? Math.max(4, (average / maximum) * 100) : 0;
  }

  private loadAnalytics(): void {
    this.loading.set(true);
    this.loadError.set(false);

    this.employeeService
      .getDashboardAnalytics()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (analytics) => this.analytics.set(analytics),
        error: () => this.loadError.set(true),
      });
  }

  private toSalaryEntries(averages: Record<string, number> | undefined): SalaryEntry[] {
    return Object.entries(averages ?? {})
      .map(([name, average]) => ({ name, average }))
      .sort((first, second) => second.average - first.average);
  }
}

interface SalaryEntry {
  name: string;
  average: number;
}