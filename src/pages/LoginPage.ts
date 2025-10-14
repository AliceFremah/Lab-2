import { Page, Locator, expect } from '@playwright/test';
import { UserCredentials } from '../config/test-config';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly loginTitle: Locator;
  readonly errorMessage: Locator;
  readonly forgotPasswordLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.loginTitle = page.locator('h5.oxd-text--h5');
    this.errorMessage = page.locator('.oxd-alert-content-text');
    this.forgotPasswordLink = page.locator('.orangehrm-login-forgot-header');
  }

  async navigateTo() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async login(credentials: UserCredentials) {
    await this.usernameInput.fill(credentials.username);
    await this.passwordInput.fill(credentials.password);
    await this.loginButton.click();
    
    // Wait for navigation to complete
    await this.page.waitForLoadState('networkidle');
    
    // Wait for either dashboard or error message
    await Promise.race([
      this.page.waitForURL('**/dashboard/**'),
      this.errorMessage.waitFor({ timeout: 5000 }).catch(() => {})
    ]);
  }

  async loginWithInvalidCredentials(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    
    // Wait for error message to appear
    await this.errorMessage.waitFor();
  }

  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyLoginPageElements() {
    await expect(this.loginTitle).toContainText('Login');
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({ 
      path: `screenshots/login-${name}.png`,
      fullPage: true 
    });
  }
}