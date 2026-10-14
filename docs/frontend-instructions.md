# Context
You are an expert Angular developer. I am building the frontend for an HR Salary Management application. The UI must cleanly display, filter, and analyze data for 10,000 employees. 

Please generate the necessary Angular code using modern best practices (Standalone Components, Signals for state management, and the `inject()` function for dependency injection). We are using Angular Material for the UI components.

# 1. Models & Services
Create an `Employee` interface matching the backend schema (id, firstName, lastName, jobTitle, department, country, salary, currency).
Create a `DashboardAnalytics` interface (totalPayroll, headcount, averageSalaryByDepartment, averageSalaryByCountry).

Create an `EmployeeService` (`@Injectable({ providedIn: 'root' })`) using `HttpClient` to interact with the backend APIs:
- `getEmployees(page, size, department, country)` (must handle pagination parameters)
- `getDashboardAnalytics()`

# 2. Configuration & Routing
Update `app.config.ts` to provide the `HttpClient` using `provideHttpClient()` and ensure router configuration is provided via `provideRouter()`.
Update `app.routes.ts` to include routes for:
- `''` (Redirects to `/dashboard` with pathMatch: 'full')
- `'/dashboard'` (Loads `DashboardComponent`)
- `'/employees'` (Loads `EmployeeListComponent`)

# 3. Application Layout
Update `app.component.ts` to be a standalone component featuring an Angular Material `MatToolbar` with a title "ACME Salary Management" and a `MatSidenav` for navigation links: "Dashboard" and "Employee Directory". Include `<router-outlet>` for the routed content.

# 4. Dashboard Component
Create a standalone `DashboardComponent`.
- Fetch data from `EmployeeService.getDashboardAnalytics()` on init.
- Use Material Cards (`MatCard`) to display high-level metrics (Total Headcount, Total Payroll).
- Use simple HTML/CSS flexbox layouts or Material lists to show the average salary breakdown by Department and Country.

# 5. Employee Directory Component
Create a standalone `EmployeeListComponent`.
- Implement a Material Table (`MatTable`) to display the employee records.
- The table must support server-side pagination using `MatPaginator` (hooking into the `page` event to trigger backend calls).
- Add Material Select dropdowns (`MatSelect`) or Text Inputs (`MatInput`) above the table to filter by `Department` and `Country`. Whenever a filter changes, reset the paginator to page 0 and trigger a new API call.