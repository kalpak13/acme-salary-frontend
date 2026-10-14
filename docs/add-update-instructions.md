# Context
We are adding "Add Employee" and "Update Salary" functionality to the `EmployeeListComponent`. We will use Angular Material Dialogs (`MatDialog`) and Reactive Forms to handle the user input.

# 1. Update EmployeeService
Ensure `EmployeeService` has the following methods using `HttpClient`:
- `addEmployee(employee: Partial<Employee>): Observable<Employee>` (POST request)
- `updateEmployee(id: number, employee: Partial<Employee>): Observable<Employee>` (PUT request)

# 2. Create the Dialog Component
Create a new standalone component called `EmployeeFormDialogComponent`.
- Inject `MAT_DIALOG_DATA` to determine if we are in "Add" mode (no data) or "Edit" mode (existing employee data passed in).
- Use `FormBuilder` to create a `FormGroup` with required validators for: `firstName`, `lastName`, `jobTitle`, `department`, `country`, and `salary`.
- The template should use `MatFormField` and `MatInput` for the form controls.
- Include a "Cancel" button and a "Save" button in the `mat-dialog-actions` area.

# 3. Update the Employee Directory UI
Modify `EmployeeListComponent`:
- Import `MatDialog` and `MatIconModule`.
- Add an "Add Employee" `<button mat-raised-button color="primary">` above the table, next to the filters.
- Add an "actions" column to the end of the `MatTable` definition. Inside the cell, put an Edit `<button mat-icon-button>` using the `edit` mat-icon.

# 4. Wire the Logic
In `EmployeeListComponent`:
- Create an `openDialog(employee?: Employee)` method.
- When the dialog closes with data, check if an `id` exists. If yes, call `EmployeeService.updateEmployee`. If no, call `EmployeeService.addEmployee`.
- Upon a successful response from the service, refresh the table data by triggering the `loadEmployees()` method.