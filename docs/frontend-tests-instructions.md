# Context
You are an expert Angular developer. I need a meaningful set of unit tests for the core functionality of my Salary Management application. The tests must be fast, deterministic, and easy to understand using Jasmine and standard Angular testing utilities.

# 1. EmployeeService Tests
Update or create `employee.service.spec.ts`.
- Use `provideHttpClientTesting()` and `HttpTestingController` to mock all backend API calls.
- Write tests to verify `getEmployees`, `getDashboardAnalytics`, `addEmployee`, and `updateEmployee` format the HTTP requests correctly (specifically checking query parameters for pagination and filtering).

# 2. DashboardComponent Tests
Update or create `dashboard.component.spec.ts`.
- Mock the `EmployeeService` so no real HTTP calls are made.
- Return a static mock `DashboardAnalytics` object.
- Verify that the component renders the "Total payroll" and "Total headcount" values correctly in the HTML template.

# 3. EmployeeListComponent Tests
Update or create `employee-list.component.spec.ts`.
- Mock the `EmployeeService` to return a static paginated list of employees.
- Provide a mock for `MatDialog` (`MatDialogTestingModule`) so the UI tests do not crash.
- Verify that the table populates with the mock data.
- Verify that changing the department or country filter triggers a new call to the mocked `EmployeeService`.