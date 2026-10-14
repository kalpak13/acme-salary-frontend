import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EmployeeService } from './employee.service';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(EmployeeService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  it('requests a paginated employee page with optional filters', () => {
    let response: unknown;
    service.getEmployees(2, 25, ' Engineering ', 'Canada').subscribe((result) => (response = result));

    const request = httpTestingController.expectOne('http://localhost:8080/api/employees?page=2&size=25&department=Engineering&country=Canada');
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('page')).toBe('2');
    expect(request.request.params.get('size')).toBe('25');
    expect(request.request.params.get('department')).toBe('Engineering');
    expect(request.request.params.get('country')).toBe('Canada');

    const page = {
      content: [],
      totalElements: 0,
      totalPages: 0,
      size: 25,
      number: 2,
      first: false,
      last: true,
    };
    request.flush(page);

    expect(response).toEqual(page);
  });

  it('omits blank filters from the employee page request', () => {
    service.getEmployees(0, 10, ' ', '').subscribe();

    const request = httpTestingController.expectOne('http://localhost:8080/api/employees?page=0&size=10');
    expect(request.request.params.has('department')).toBe(false);
    expect(request.request.params.has('country')).toBe(false);
    request.flush({ content: [], totalElements: 0, totalPages: 0, size: 10, number: 0, first: true, last: true });
  });

  it('fetches and maps dashboard analytics to the frontend model', () => {
    let result: unknown;
    service.getDashboardAnalytics().subscribe((analytics) => (result = analytics));

    const request = httpTestingController.expectOne('http://localhost:8080/api/analytics/dashboard');
    expect(request.request.method).toBe('GET');
    request.flush({
      totalPayroll: 250000,
      headcount: 2,
      averageSalariesByDepartment: { Engineering: 125000 },
      averageSalariesByCountry: { Canada: 125000 },
    });

    expect(result).toEqual({
      totalPayroll: 250000,
      headcount: 2,
      averageSalaryByDepartment: { Engineering: 125000 },
      averageSalaryByCountry: { Canada: 125000 },
    });
  });

  it('posts an employee to the collection endpoint', () => {
    const employee = { firstName: 'Avery', lastName: 'Morgan', salary: 125000 };
    service.addEmployee(employee).subscribe();

    const request = httpTestingController.expectOne('http://localhost:8080/api/employees');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(employee);
    request.flush({ id: 5, ...employee, jobTitle: 'Engineer', department: 'Engineering', country: 'Canada', currency: 'CAD' });
  });

  it('puts employee updates to the employee-specific endpoint', () => {
    const updates = { salary: 130000, currency: 'CAD' };
    service.updateEmployee(5, updates).subscribe();

    const request = httpTestingController.expectOne('http://localhost:8080/api/employees/5');
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(updates);
    request.flush({
      id: 5,
      firstName: 'Avery',
      lastName: 'Morgan',
      jobTitle: 'Engineer',
      department: 'Engineering',
      country: 'Canada',
      ...updates,
    });
  });
});