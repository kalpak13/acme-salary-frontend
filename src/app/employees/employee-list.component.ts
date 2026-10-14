import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { debounceTime, merge, of, Subject, switchMap, tap, catchError } from 'rxjs';
import { Employee } from '../models/employee.model';
import { PageResponse } from '../models/page-response.model';
import { EmployeeService } from '../services/employee.service';

interface EmployeePageRequest {
  page: number;
  size: number;
  department: string;
  country: string;
}

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CurrencyPipe,
    DecimalPipe,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatTableModule,
    ReactiveFormsModule,
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
})
export class EmployeeListComponent implements OnInit {
  private readonly employeeService = inject(EmployeeService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly pageRequests = new Subject<EmployeePageRequest>();

  protected readonly departmentControl = new FormControl('', { nonNullable: true });
  protected readonly countryControl = new FormControl('', { nonNullable: true });
  protected readonly employees = signal<Employee[]>([]);
  protected readonly totalElements = signal(0);
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(25);
  protected readonly loading = signal(false);
  protected readonly loadError = signal(false);
  protected readonly displayedColumns = ['id', 'employee', 'jobTitle', 'department', 'country', 'salary'];
  protected readonly pageSizeOptions = [10, 25, 50, 100];

  ngOnInit(): void {
    this.pageRequests
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.loadError.set(false);
        }),
        switchMap((request) =>
          this.employeeService
            .getEmployees(
              request.page,
              request.size,
              request.department || undefined,
              request.country || undefined,
            )
            .pipe(catchError(() => of(null))),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((response) => this.onEmployeesLoaded(response));

    merge(this.departmentControl.valueChanges, this.countryControl.valueChanges)
      .pipe(
        tap(() => this.pageIndex.set(0)),
        debounceTime(250),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.requestPage(0, this.pageSize()));

    this.requestPage(0, this.pageSize());
  }

  protected onPage(event: PageEvent): void {
    this.requestPage(event.pageIndex, event.pageSize);
  }

  protected clearFilters(): void {
    this.departmentControl.setValue('');
    this.countryControl.setValue('');
  }

  protected retry(): void {
    this.requestPage(this.pageIndex(), this.pageSize());
  }

  private requestPage(page: number, size: number): void {
    this.pageIndex.set(page);
    this.pageSize.set(size);
    this.pageRequests.next({
      page,
      size,
      department: this.departmentControl.value.trim(),
      country: this.countryControl.value.trim(),
    });
  }

  private onEmployeesLoaded(response: PageResponse<Employee> | null): void {
    this.loading.set(false);

    if (response === null) {
      this.employees.set([]);
      this.totalElements.set(0);
      this.loadError.set(true);
      return;
    }

    this.employees.set(response.content);
    this.totalElements.set(response.totalElements);
  }
}