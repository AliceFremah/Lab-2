import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { EmployeePage } from '../pages/EmployeePage';
import { LeavePage } from '../pages/LeavePage';
import { AdminPage } from '../pages/AdminPage';
import { TEST_USERS, UserCredentials } from '../config/test-config';

// Extend basic test by providing page object models and user fixtures
type TestFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  employeePage: EmployeePage;
  leavePage: LeavePage;
  adminPage: AdminPage;
  adminUser: UserCredentials;
  essUser: UserCredentials;
  managerUser: UserCredentials;
  authenticatedAdminPage: { page: any; dashboardPage: DashboardPage };
  authenticatedESSPage: { page: any; dashboardPage: DashboardPage };
  authenticatedManagerPage: { page: any; dashboardPage: DashboardPage };
};

export const test = base.extend<TestFixtures>({
  // Page Object Models
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },

  employeePage: async ({ page }, use) => {
    const employeePage = new EmployeePage(page);
    await use(employeePage);
  },

  leavePage: async ({ page }, use) => {
    const leavePage = new LeavePage(page);
    await use(leavePage);
  },

  adminPage: async ({ page }, use) => {
    const adminPage = new AdminPage(page);
    await use(adminPage);
  },

  // User Credentials
  adminUser: async ({}, use) => {
    await use(TEST_USERS.admin);
  },

  essUser: async ({}, use) => {
    await use(TEST_USERS.ess);
  },

  managerUser: async ({}, use) => {
    await use(TEST_USERS.manager);
  },

  // Pre-authenticated sessions
  authenticatedAdminPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await loginPage.navigateTo();
    await loginPage.login(TEST_USERS.admin);
    await dashboardPage.verifyDashboardLoaded();
    
    await use({ page, dashboardPage });
  },

  authenticatedESSPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await loginPage.navigateTo();
    await loginPage.login(TEST_USERS.ess);
    await dashboardPage.verifyDashboardLoaded();
    
    await use({ page, dashboardPage });
  },

  authenticatedManagerPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await loginPage.navigateTo();
    await loginPage.login(TEST_USERS.manager);
    await dashboardPage.verifyDashboardLoaded();
    
    await use({ page, dashboardPage });
  },
});

export { expect } from '@playwright/test';