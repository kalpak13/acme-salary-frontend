import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
	{
		path: 'dashboard',
		loadComponent: () =>
			import('./dashboard/dashboard.component').then((module) => module.DashboardComponent),
	},
	{
		path: 'employees',
		loadComponent: () =>
			import('./employees/employee-list.component').then((module) => module.EmployeeListComponent),
	},
];
