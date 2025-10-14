import { chromium, FullConfig } from '@playwright/test';
import { TEST_USERS } from '../src/config/test-config';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting Global Setup...');
  
  // Create a browser instance for setup tasks
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to the application and verify it's accessible
    await page.goto('https://opensource-demo.orangehrmlive.com/');
    await page.waitForLoadState('networkidle');
    
    // Verify the login page is loaded
    const loginTitle = await page.locator('h5.oxd-text--h5').textContent();
    if (!loginTitle?.includes('Login')) {
      throw new Error('Application is not accessible or login page not found');
    }

    console.log('✅ Application accessibility verified');
    console.log('✅ Test users configuration loaded');
    console.log(`✅ Global setup completed successfully`);
    
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
}

export default globalSetup;