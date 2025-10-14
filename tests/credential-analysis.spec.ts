import { test } from '../src/fixtures/test-fixtures';

test.describe('User Credential Analysis', () => {
  
  test('Check available user credentials', async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/');
    await page.waitForLoadState('networkidle');
    
    // Look for any credential hints on the login page
    const pageContent = await page.textContent('body');
    console.log('Looking for credential hints...');
    
    // Check if there are any demo credentials shown
    if (pageContent?.includes('Username') || pageContent?.includes('admin') || pageContent?.includes('Admin')) {
      console.log('Found potential credential information');
    }
    
    // Try common demo credentials
    const commonCredentials = [
      { username: 'Admin', password: 'admin123' },
      { username: 'admin', password: 'admin123' },
      { username: 'user', password: 'user123' },
      { username: 'demo', password: 'demo123' },
      { username: 'test', password: 'test123' }
    ];
    
    for (const cred of commonCredentials) {
      console.log(`Testing credentials: ${cred.username}/${cred.password}`);
      
      // Fill login form
      await page.fill('input[name="username"]', cred.username);
      await page.fill('input[name="password"]', cred.password);
      await page.click('button[type="submit"]');
      
      // Wait a bit for response
      await page.waitForTimeout(3000);
      
      const currentUrl = page.url();
      console.log(`Current URL: ${currentUrl}`);
      
      if (currentUrl.includes('dashboard')) {
        console.log(`✅ SUCCESS: ${cred.username}/${cred.password} works!`);
        
        // Take a screenshot of successful login
        await page.screenshot({ 
          path: `screenshots/successful-login-${cred.username}.png`,
          fullPage: true 
        });
        
        // Check what's available on dashboard
        const dashboardContent = await page.textContent('body');
        console.log('Available menu items:');
        
        // Look for navigation menu items
        const menuItems = await page.locator('.oxd-main-menu-item-wrapper').allTextContents();
        console.log('Menu items:', menuItems);
        
        // Logout before testing next credential
        const userDropdown = page.locator('.oxd-userdropdown-tab');
        if (await userDropdown.isVisible()) {
          await userDropdown.click();
          const logoutOption = page.locator('a[href*="logout"]');
          if (await logoutOption.isVisible()) {
            await logoutOption.click();
            await page.waitForURL('**/auth/login**');
          }
        }
      } else {
        // Check for error message
        const errorElement = page.locator('.oxd-alert-content-text');
        if (await errorElement.isVisible()) {
          const errorText = await errorElement.textContent();
          console.log(`❌ FAILED: ${cred.username}/${cred.password} - Error: ${errorText}`);
        } else {
          console.log(`❌ FAILED: ${cred.username}/${cred.password} - No specific error found`);
        }
      }
      
      // Navigate back to login page for next attempt
      await page.goto('https://opensource-demo.orangehrmlive.com/');
      await page.waitForLoadState('networkidle');
    }
  });
});