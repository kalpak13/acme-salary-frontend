import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-form-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './employee-form-dialog.component.html',
  styleUrl: './employee-form-dialog.component.scss',
})
export class EmployeeFormDialogComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<EmployeeFormDialogComponent, Partial<Employee>>);

  protected readonly employee = inject<Employee | null>(MAT_DIALOG_DATA, { optional: true });
  protected readonly isEditMode = this.employee !== null;

  protected readonly form = this.formBuilder.nonNullable.group({
    firstName: [this.employee?.firstName ?? '', Validators.required],
    lastName: [this.employee?.lastName ?? '', Validators.required],
    jobTitle: [this.employee?.jobTitle ?? '', Validators.required],
    department: [this.employee?.department ?? '', Validators.required],
    country: [this.employee?.country ?? '', Validators.required],
    salary: [this.employee?.salary ?? 0, [Validators.required, Validators.min(0.01)]],
    currency: [this.employee?.currency ?? 'USD', Validators.required],
  });

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const employee: Partial<Employee> = this.form.getRawValue();
    if (this.employee?.id !== undefined) {
      employee.id = this.employee.id;
    }
    this.dialogRef.close(employee);
  }
}