import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatPaginator } from '@angular/material/paginator';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { EmployeeService } from '../services/employee.service';
import { EmployeeListComponent } from './employee-list.component';

describe('EmployeeListComponent', () => {
  let fixture: ComponentFixture<EmployeeListComponent>;
  let employeeService: { getEmployees: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    employeeService = {
      getEmployees: vi.fn().mockReturnValue(
        of({
          content: [
            {
              id: 1,
              firstName: 'Avery',
              lastName: 'Morgan',
              jobTitle: 'Engineer',
              department: 'Engineering',
              country: 'Canada',
              salary: 125000,
              currency: 'CAD',
            },
          ],
          totalElements: 51,
          totalPages: 3,
          size: 25,
          number: 0,
          first: true,
          last: false,
        }),
      ),
    };

    await TestBed.configureTestingModule({
      imports: [EmployeeListComponent],
      providers: [{ provide: EmployeeService, useValue: employeeService }],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeListComponent);
    fixture.detectChanges();
  });

  it('loads the first server page and requests the selected page on paginator changes', () => {
    expect(employeeService.getEmployees).toHaveBeenNthCalledWith(1, 0, 25, undefined, undefined);

    const paginator = fixture.debugElement.query(By.directive(MatPaginator)).componentInstance as MatPaginator;
    paginator.page.emit({ pageIndex: 1, pageSize: 25, length: 51, previousPageIndex: 0 });

    expect(employeeService.getEmployees).toHaveBeenNthCalledWith(2, 1, 25, undefined, undefined);
  });

  it('resets to the first page and refetches after a filter changes', async () => {
    vi.useFakeTimers();

    const paginator = fixture.debugElement.query(By.directive(MatPaginator)).componentInstance as MatPaginator;
    paginator.page.emit({ pageIndex: 2, pageSize: 25, length: 51, previousPageIndex: 0 });
    fixture.detectChanges();

    const departmentInput = fixture.nativeElement.querySelector(
      'input[placeholder="e.g. Engineering"]',
    ) as HTMLInputElement;
    departmentInput.value = 'Engineering';
    departmentInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(paginator.pageIndex).toBe(0);

    await vi.advanceTimersByTimeAsync(250);

    expect(employeeService.getEmployees).toHaveBeenLastCalledWith(0, 25, 'Engineering', undefined);
    vi.useRealTimers();
  });
});