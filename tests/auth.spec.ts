import { test, expect } from '../src/fixtures/test-fixtures';
import { COMMON_TEST_DATA } from '../src/data/test-data-generator';

test.describe('Authentication Tests', () => {
  
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigateTo();
  });

  test('Valid Admin login @smoke @regression', async ({ 
    loginPage, 
    dashboardPage, 
    adminUser 
  }) => {
    // Verify login page elements
    await loginPage.verifyLoginPageElements();
    
    // Perform login
    await loginPage.login(adminUser);
    
    // Verify successful login to dashboard
    await dashboardPage.verifyDashboardLoaded();
    await dashboardPage.verifyDashboardWidgets();
    
    // Verify Admin has access to Admin tab
    const hasAdminAccess = await dashboardPage.verifyAdminTabVisible();
    expect(hasAdminAccess).toBeTruthy();
    
    // Take screenshot for documentation
    await dashboardPage.takeScreenshot('admin-dashboard');
  });

  test('Valid ESS login @smoke @regression', async ({ 
    loginPage, 
    dashboardPage, 
    essUser 
  }) => {
    // Perform login
    await loginPage.login(essUser);
    
    // Verify successful login to dashboard
    await dashboardPage.verifyDashboardLoaded();
    await dashboardPage.verifyDashboardWidgets();
    
    // Verify ESS does NOT have access to Admin tab
    const hasAdminAccess = await dashboardPage.verifyAdminTabVisible();
    expect(hasAdminAccess).toBeFalsy();
    
    // Take screenshot for documentation
    await dashboardPage.takeScreenshot('ess-dashboard');
  });

  test('Valid Manager login @smoke @regression', async ({ 
    loginPage, 
    dashboardPage, 
    managerUser 
  }) => {
    // Perform login
    await loginPage.login(managerUser);
    
    // Verify successful login to dashboard
    await dashboardPage.verifyDashboardLoaded();
    await dashboardPage.verifyDashboardWidgets();
    
    // Verify Manager has access to Leave tab
    const hasLeaveAccess = await dashboardPage.verifyLeaveTabVisible();
    expect(hasLeaveAccess).toBeTruthy();
    
    // Take screenshot for documentation
    await dashboardPage.takeScreenshot('manager-dashboard');
  });

  COMMON_TEST_DATA.invalidCredentials.forEach((credentials, index) => {
    test(`Login with invalid credentials - Case ${index + 1} @regression`, async ({ 
      loginPage 
    }) => {
      // Attempt login with invalid credentials
      await loginPage.loginWithInvalidCredentials(
        credentials.username, 
        credentials.password
      );
      
      // Verify error message is displayed
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toContain('Invalid credentials');
      
      // Take screenshot for documentation
      await loginPage.takeScreenshot(`invalid-login-case-${index + 1}`);
    });
  });

  test('Password reset flow @regression', async ({ loginPage, page }) => {
    // Click on forgot password link
    await loginPage.clickForgotPassword();
    
    // Verify navigation to reset password page
    await expect(page).toHaveURL(/.*forgotPassword.*/);
    
    // Verify reset password page elements
    const resetTitle = page.locator('h6.oxd-text--h6');
    await expect(resetTitle).toContainText('Reset Password');
    
    const usernameField = page.locator('input[name="username"]');
    await expect(usernameField).toBeVisible();
    
    const resetButton = page.locator('button[type="submit"]');
    await expect(resetButton).toBeVisible();
    
    // Fill username and submit (won't actually send email in demo)
    await usernameField.fill('Admin');
    await resetButton.click();
    
    // Take screenshot for documentation
    await page.screenshot({ 
      path: 'screenshots/password-reset-flow.png',
      fullPage: true 
    });
  });

  test('Logout functionality @smoke @regression', async ({ 
    loginPage, 
    dashboardPage, 
    adminUser 
  }) => {
    // Login first
    await loginPage.login(adminUser);
    await dashboardPage.verifyDashboardLoaded();
    
    // Perform logout
    await dashboardPage.logout();
    
    // Verify redirect back to login page
    await loginPage.verifyLoginPageElements();
    
    // Take screenshot for documentation
    await loginPage.takeScreenshot('after-logout');
  });

  test('Session timeout handling @regression', async ({ 
    loginPage, 
    dashboardPage, 
    adminUser,
    page 
  }) => {
    // Login first
    await loginPage.login(adminUser);
    await dashboardPage.verifyDashboardLoaded();
    
    // Simulate session expiry by clearing storage
    await page.context().clearCookies();
    await page.evaluate(() => {
      (globalThis as any).localStorage.clear();
      (globalThis as any).sessionStorage.clear();
    });
    
    // Try to navigate to a protected page
    await page.goto('/web/index.php/admin/viewAdminModule');
    
    // Should be redirected to login page
    await expect(page).toHaveURL(/.*login.*/);
    await loginPage.verifyLoginPageElements();
  });

  test('Browser back button after logout @regression', async ({ 
    loginPage, 
    dashboardPage, 
    adminUser,
    page 
  }) => {
    // Login and navigate to dashboard
    await loginPage.login(adminUser);
    await dashboardPage.verifyDashboardLoaded();
    
    // Logout
    await dashboardPage.logout();
    
    // Try to go back using browser navigation
    await page.goBack();
    
    // Should remain on login page or be redirected to login
    await expect(page).toHaveURL(/.*login.*/);
  });

  test('Multiple failed login attempts @regression', async ({ 
    loginPage 
  }) => {
    // Attempt multiple failed logins
    for (let i = 0; i < 3; i++) {
      await loginPage.loginWithInvalidCredentials('Admin', 'wrongpassword');
      
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toContain('Invalid credentials');
      
      // Small delay between attempts
      await loginPage.page.waitForTimeout(1000);
    }
    
    // Verify system still accepts valid credentials after failed attempts
    await loginPage.login({ username: 'Admin', password: 'admin123', role: 'Admin' });
    
    // Should successfully login
    const dashboardPage = new (await import('../src/pages/DashboardPage')).DashboardPage(loginPage.page);
    await dashboardPage.verifyDashboardLoaded();
  });

  test('Case sensitivity in login @regression', async ({ 
    loginPage 
  }) => {
    // Test case sensitive username
    await loginPage.loginWithInvalidCredentials('admin', 'admin123'); // lowercase
    
    let errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Invalid credentials');
    
    // Test case sensitive password  
    await loginPage.loginWithInvalidCredentials('Admin', 'ADMIN123'); // uppercase
    
    errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Invalid credentials');
  });

  test('SQL injection prevention @regression', async ({ 
    loginPage 
  }) => {
    const sqlInjectionAttempts = [
      "'; DROP TABLE users; --",
      "admin' OR '1'='1",
      "admin'; DELETE FROM users WHERE '1'='1",
      "' UNION SELECT * FROM users --"
    ];
    
    for (const attempt of sqlInjectionAttempts) {
      await loginPage.loginWithInvalidCredentials(attempt, 'admin123');
      
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toContain('Invalid credentials');
    }
  });
});