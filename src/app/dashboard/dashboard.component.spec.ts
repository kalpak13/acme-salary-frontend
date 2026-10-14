import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { DashboardAnalytics } from '../models/dashboard-analytics.model';
import { EmployeeService } from '../services/employee.service';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;
  let getDashboardAnalytics: ReturnType<typeof vi.fn>;

  const analytics: DashboardAnalytics = {
    totalPayroll: 1250000,
    headcount: 10000,
    averageSalaryByDepartment: { Engineering: 120000, Sales: 90000 },
    averageSalaryByCountry: { Canada: 115000, India: 85000 },
  };

  beforeEach(async () => {
    getDashboardAnalytics = vi.fn().mockReturnValue(of(analytics));

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        {
          provide: EmployeeService,
          useValue: { getDashboardAnalytics },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
  });

  it('loads analytics from the mocked service on initialization', () => {
    expect(getDashboardAnalytics).toHaveBeenCalledTimes(1);
  });

  it('renders total payroll and total headcount', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('.payroll-card .metric-value')?.textContent).toContain('$1,250,000');
    expect(element.querySelector('.headcount-card .metric-value')?.textContent).toContain('10,000');
  });
});