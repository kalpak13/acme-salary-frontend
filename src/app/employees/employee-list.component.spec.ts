import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { By } from '@angular/platform-browser';
import { of, Subject } from 'rxjs';
import { vi } from 'vitest';
import { Employee } from '../models/employee.model';
import { EmployeeService } from '../services/employee.service';
import { EmployeeFormDialogComponent } from './employee-form-dialog/employee-form-dialog.component';
import { EmployeeListComponent } from './employee-list.component';

describe('EmployeeListComponent', () => {
  let fixture: ComponentFixture<EmployeeListComponent>;
  let employeeService: {
    getEmployees: ReturnType<typeof vi.fn>;
    addEmployee: ReturnType<typeof vi.fn>;
    updateEmployee: ReturnType<typeof vi.fn>;
  };
  let dialogResult: Subject<Partial<Employee> | undefined>;
  let dialog: { open: ReturnType<typeof vi.fn> };

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
      addEmployee: vi.fn().mockImplementation((employee: Partial<Employee>) => of(employee)),
      updateEmployee: vi.fn().mockImplementation((_id: number, employee: Partial<Employee>) => of(employee)),
    };
    dialogResult = new Subject<Partial<Employee> | undefined>();
    dialog = {
      open: vi.fn().mockReturnValue({ afterClosed: () => dialogResult.asObservable() }),
    };

    await TestBed.configureTestingModule({
      imports: [EmployeeListComponent],
      providers: [{ provide: EmployeeService, useValue: employeeService }],
    })
      .overrideComponent(EmployeeListComponent, {
        add: { providers: [{ provide: MatDialog, useValue: dialog }] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(EmployeeListComponent);
    fixture.detectChanges();
  });

  it('loads the first server page and requests the selected page on paginator changes', () => {
    expect(employeeService.getEmployees).toHaveBeenNthCalledWith(1, 0, 25, undefined, undefined);
    expect(fixture.nativeElement.textContent).toContain('Avery Morgan');
    expect(fixture.nativeElement.textContent).toContain('Engineering');

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

  it('refetches from page zero when the country filter changes', async () => {
    vi.useFakeTimers();

    const paginator = fixture.debugElement.query(By.directive(MatPaginator)).componentInstance as MatPaginator;
    paginator.page.emit({ pageIndex: 2, pageSize: 25, length: 51, previousPageIndex: 0 });
    fixture.detectChanges();

    const countryInput = fixture.nativeElement.querySelector(
      'input[placeholder="e.g. Canada"]',
    ) as HTMLInputElement;
    countryInput.value = 'Canada';
    countryInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(paginator.pageIndex).toBe(0);

    await vi.advanceTimersByTimeAsync(250);

    expect(employeeService.getEmployees).toHaveBeenLastCalledWith(0, 25, undefined, 'Canada');
    vi.useRealTimers();
  });

  it('opens add mode and posts the dialog result before reloading the list', () => {
    fixture.nativeElement.querySelector('.add-button').click();

    expect(dialog.open).toHaveBeenCalledWith(
      EmployeeFormDialogComponent,
      expect.objectContaining({ data: null }),
    );

    dialogResult.next({ firstName: 'Jordan', lastName: 'Lee', salary: 90000 });

    expect(employeeService.addEmployee).toHaveBeenCalledWith({
      firstName: 'Jordan',
      lastName: 'Lee',
      salary: 90000,
    });
    expect(employeeService.getEmployees).toHaveBeenCalledTimes(2);
  });

  it('opens edit mode and puts the dialog result when it contains an id', () => {
    const employee: Employee = {
      id: 1,
      firstName: 'Avery',
      lastName: 'Morgan',
      jobTitle: 'Engineer',
      department: 'Engineering',
      country: 'Canada',
      salary: 125000,
      currency: 'CAD',
    };
    fixture.detectChanges();
    fixture.nativeElement.querySelector('button[aria-label="Edit Avery Morgan"]').click();

    expect(dialog.open).toHaveBeenCalledWith(
      EmployeeFormDialogComponent,
      expect.objectContaining({ data: employee }),
    );

    dialogResult.next(employee);

    expect(employeeService.updateEmployee).toHaveBeenCalledWith(employee.id, employee);
    expect(employeeService.addEmployee).not.toHaveBeenCalled();
    expect(employeeService.getEmployees).toHaveBeenCalledTimes(2);
  });
});