import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { DashboardPage } from '../src/pages/DashboardPage';
import { TEST_USERS } from '../src/config/test-config';

test.describe('Essential Authentication Tests', () => {
  
  test('Valid Admin login @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.navigateTo();
    await loginPage.login(TEST_USERS.admin);
    
    // Verify successful login
    await expect(page).toHaveURL(/.*dashboard.*/);
    await expect(dashboardPage.pageTitle).toContainText('Dashboard');
    
    console.log('✅ Admin login successful');
  });

  test('Invalid login attempt @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigateTo();
    await loginPage.loginWithInvalidCredentials('invalid_user', 'wrong_password');
    
    // Verify error message
    await expect(loginPage.errorMessage).toBeVisible();
    
    console.log('✅ Invalid login properly rejected');
  });

  test('Logout functionality @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Login first
    await loginPage.navigateTo();
    await loginPage.login(TEST_USERS.admin);
    
    // Logout
    await dashboardPage.logout();
    
    // Verify back to login page
    await expect(page).toHaveURL(/.*login.*/);
    
    console.log('✅ Logout successful');
  });

});