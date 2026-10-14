Prompt 1: Foundation & Services

@workspace Please read #frontend-instructions.md carefully. We are going to build this Angular frontend step-by-step. Let's start with Step 1 and Step 2. Please generate the TypeScript interfaces (Employee, DashboardAnalytics), the EmployeeService class, and show me how to update app.config.ts and app.routes.ts. Stop here and wait for my confirmation.

Prompt 2: Application Layout

Perfect. Now execute Step 3. Provide the TypeScript, HTML, and CSS/SCSS to update app.component.ts so it acts as our main layout wrapper with a toolbar and a sidebar menu using Angular Material.

Prompt 3: Dashboard View

Great. Now let's do Step 4. Generate the DashboardComponent (TypeScript, HTML, SCSS). Ensure it uses Angular Material cards to cleanly present the analytics data fetched from the service.

Prompt 4: Data Table & Pagination

Finally, generate Step 5. Provide the code for EmployeeListComponent. It is crucial that the MatTable connects properly to the MatPaginator and triggers server-side data fetching when the page changes or when the department/country filters are updated.


Prompt 1: Service and Dialog Generation

@workspace Please read #add-update-instructions.md. Let's start with Step 1 and Step 2. Update the EmployeeService to include the POST/PUT methods, and then generate the EmployeeFormDialogComponent (TypeScript, HTML, SCSS) using Reactive Forms. Stop and wait for my confirmation.


Prompt 2: Updating the Table UI

Perfect. Now execute Step 3 and Step 4. Update the EmployeeListComponent template to include the "Add Employee" button and the new "actions" column in the table. Then, update the component class to handle opening the dialog and saving the data via the service.