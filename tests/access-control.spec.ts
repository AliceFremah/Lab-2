import { test, expect } from '../src/fixtures/test-fixtures';

test.describe('User Role Access Control Tests', () => {
  
  test('Admin access verification @smoke @regression', async ({ 
    authenticatedAdminPage,
    dashboardPage,
    adminPage 
  }) => {
    // Verify Admin has access to Admin module
    const hasAdminAccess = await dashboardPage.verifyAdminTabVisible();
    expect(hasAdminAccess).toBeTruthy();
    
    // Navigate to Admin page and verify functionality
    await dashboardPage.navigateToAdmin();
    await adminPage.verifyAdminPage();
    
    // Verify specific admin functions
    await adminPage.navigateToUsers();
    await adminPage.verifyUsersPage();
    
    await adminPage.takeScreenshot('admin-access-verified');
  });

  test('ESS access restrictions @smoke @regression', async ({ 
    authenticatedESSPage,
    dashboardPage 
  }) => {
    // Verify ESS does NOT have access to Admin module
    const hasAdminAccess = await dashboardPage.verifyAdminTabVisible();
    expect(hasAdminAccess).toBeFalsy();
    
    // Verify ESS can access their own information
    await dashboardPage.navigateToMyInfo();
    await expect(dashboardPage.page.locator('h6')).toContainText('Personal Details');
    
    await dashboardPage.takeScreenshot('ess-access-verified');
  });

  test('Manager leave approval access @smoke @regression', async ({ 
    authenticatedManagerPage,
    dashboardPage,
    leavePage 
  }) => {
    // Verify Manager has access to Leave module
    const hasLeaveAccess = await dashboardPage.verifyLeaveTabVisible();
    expect(hasLeaveAccess).toBeTruthy();
    
    // Navigate to Leave approvals
    await dashboardPage.navigateToLeave();
    await leavePage.navigateToLeaveList();
    await leavePage.verifyLeaveListPage();
    
    await leavePage.takeScreenshot('manager-leave-access-verified');
  });

  test('Direct URL access prevention @regression', async ({ 
    page,
    loginPage,
    essUser 
  }) => {
    // Login as ESS user
    await loginPage.navigateTo();
    await loginPage.login(essUser);
    
    // Try to directly access Admin module URL
    await page.goto('/web/index.php/admin/viewAdminModule');
    
    // Should be redirected or show access denied
    const currentUrl = page.url();
    const pageContent = await page.textContent('body');
    
    // Check if access is properly restricted
    const hasAdminContent = pageContent?.toLowerCase().includes('admin');
    const isRedirected = !currentUrl.includes('admin');
    
    // Either should be redirected or not have admin content
    expect(hasAdminContent || isRedirected).toBeTruthy();
    
    await page.screenshot({ path: 'screenshots/url-access-prevention.png' });
  });
});