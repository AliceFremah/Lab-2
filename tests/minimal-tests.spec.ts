import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { DashboardPage } from '../src/pages/DashboardPage';
import { TEST_USERS } from '../src/config/test-config';

test.describe('Essential OrangeHRM Tests', () => {
  
  test('Admin Login and Dashboard Access @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Login with Admin credentials
    await loginPage.navigateTo();
    await loginPage.login(TEST_USERS.admin);
    
    // Verify successful login and dashboard access
    await expect(page).toHaveURL(/.*dashboard.*/);
    await expect(dashboardPage.pageTitle).toContainText('Dashboard');
    
    // Take screenshot for documentation
    await page.screenshot({ path: 'screenshots/admin-dashboard.png' });
    
    console.log('✅ Admin login successful');
  });

  test('Navigation to Admin Module @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Login first
    await loginPage.navigateTo();
    await loginPage.login(TEST_USERS.admin);
    
    // Navigate to Admin module
    await dashboardPage.navigateToAdmin();
    await expect(page).toHaveURL(/.*admin.*/);
    await expect(page.locator('.oxd-topbar-header-breadcrumb')).toContainText('Admin');
    
    console.log('✅ Admin module access successful');
  });

  test('Navigation to PIM Module @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Login first
    await loginPage.navigateTo();
    await loginPage.login(TEST_USERS.admin);
    
    // Navigate to PIM module
    await dashboardPage.navigateToPIM();
    await expect(page).toHaveURL(/.*pim.*/);
    await expect(page.locator('.oxd-topbar-header-breadcrumb')).toContainText('PIM');
    
    console.log('✅ PIM module access successful');
  });

  test('Navigation to Leave Module @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Login first
    await loginPage.navigateTo();
    await loginPage.login(TEST_USERS.admin);
    
    // Navigate to Leave module
    await dashboardPage.navigateToLeave();
    await expect(page).toHaveURL(/.*leave.*/);
    await expect(page.locator('.oxd-topbar-header-breadcrumb')).toContainText('Leave');
    
    console.log('✅ Leave module access successful');
  });

  test('Logout Functionality @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Login first
    await loginPage.navigateTo();
    await loginPage.login(TEST_USERS.admin);
    
    // Logout
    await dashboardPage.logout();
    
    // Verify back to login page
    await expect(page).toHaveURL(/.*login.*/);
    await expect(page.locator('[placeholder="Username"]')).toBeVisible();
    
    console.log('✅ Logout successful');
  });



});