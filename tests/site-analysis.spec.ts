import { test, expect } from '../src/fixtures/test-fixtures';

test.describe('Site Analysis', () => {
  
  test('Analyze OrangeHRM site structure @smoke', async ({ page }) => {
    // Navigate to the site
    await page.goto('https://opensource-demo.orangehrmlive.com/');
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot of the login page
    await page.screenshot({ path: 'screenshots/login-page-analysis.png', fullPage: true });
    
    // Check login form elements
    const usernameField = page.locator('input[name="username"]');
    const passwordField = page.locator('input[name="password"]');
    const loginButton = page.locator('button[type="submit"]');
    
    console.log('Username field visible:', await usernameField.isVisible());
    console.log('Password field visible:', await passwordField.isVisible());
    console.log('Login button visible:', await loginButton.isVisible());
    
    // Login with admin credentials
    await usernameField.fill('Admin');
    await passwordField.fill('admin123');
    await loginButton.click();
    
    // Wait for navigation
    await page.waitForTimeout(5000);
    
    // Take screenshot of post-login page
    await page.screenshot({ path: 'screenshots/post-login-analysis.png', fullPage: true });
    
    // Check current URL
    console.log('Current URL after login:', page.url());
    
    // Look for dashboard elements
    const pageContent = await page.textContent('body');
    console.log('Page contains "Dashboard":', pageContent?.includes('Dashboard'));
    console.log('Page contains "Welcome":', pageContent?.includes('Welcome'));
    
    // Check for various selectors
    const possibleSelectors = [
      '.oxd-dashboard-widget',
      '.dashboard-widget',
      '[class*="dashboard"]',
      '[class*="widget"]',
      '.card',
      '.tile',
      '.module'
    ];
    
    for (const selector of possibleSelectors) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        console.log(`Found ${count} elements with selector: ${selector}`);
      }
    }
    
    // Get page title
    const title = await page.title();
    console.log('Page title:', title);
    
    // Get all h1, h2, h3 text
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
    console.log('Page headings:', headings);
  });
});