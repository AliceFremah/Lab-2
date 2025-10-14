import { Page, Locator, expect } from '@playwright/test';

export class AdminPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  
  // User Management
  readonly userManagementTab: Locator;
  readonly usersLink: Locator;
  readonly addUserButton: Locator;
  readonly userTable: Locator;
  readonly userRows: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;

  // Add User Form
  readonly userRoleDropdown: Locator;
  readonly employeeNameInput: Locator;
  readonly statusDropdown: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly saveUserButton: Locator;
  readonly cancelButton: Locator;

  // Job Management
  readonly jobTab: Locator;
  readonly jobTitlesLink: Locator;
  readonly addJobTitleButton: Locator;
  readonly jobTitleInput: Locator;
  readonly jobDescriptionTextarea: Locator;
  readonly saveJobTitleButton: Locator;

  // Organization
  readonly organizationTab: Locator;
  readonly locationsLink: Locator;
  readonly addLocationButton: Locator;
  readonly locationNameInput: Locator;
  readonly countryDropdown: Locator;
  readonly saveLocationButton: Locator;

  // System Users Search
  readonly usernameSearchInput: Locator;
  readonly userRoleSearchDropdown: Locator;
  readonly employeeNameSearchInput: Locator;
  readonly statusSearchDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('h6').first();
    
    // User Management
    this.userManagementTab = page.locator('span').filter({ hasText: 'User Management' });
    this.usersLink = page.locator('a').filter({ hasText: 'Users' });
    this.addUserButton = page.locator('button').filter({ hasText: 'Add' });
    this.userTable = page.locator('.oxd-table');
    this.userRows = page.locator('.oxd-table-body .oxd-table-row');
    this.searchButton = page.locator('button[type="submit"]').filter({ hasText: 'Search' });
    this.resetButton = page.locator('button[type="button"]').filter({ hasText: 'Reset' });

    // Add User Form
    this.userRoleDropdown = page.locator('.oxd-select-text-input').nth(0);
    this.employeeNameInput = page.locator('input[placeholder*="Type for hints"]');
    this.statusDropdown = page.locator('.oxd-select-text-input').nth(1);
    this.usernameInput = page.locator('input[autocomplete="off"]').nth(0);
    this.passwordInput = page.locator('input[type="password"]').nth(0);
    this.confirmPasswordInput = page.locator('input[type="password"]').nth(1);
    this.saveUserButton = page.locator('button[type="submit"]').filter({ hasText: 'Save' });
    this.cancelButton = page.locator('button[type="button"]').filter({ hasText: 'Cancel' });

    // Job Management
    this.jobTab = page.locator('span').filter({ hasText: 'Job' });
    this.jobTitlesLink = page.locator('a').filter({ hasText: 'Job Titles' });
    this.addJobTitleButton = page.locator('button').filter({ hasText: 'Add' });
    this.jobTitleInput = page.locator('input[class*="oxd-input"]').nth(1);
    this.jobDescriptionTextarea = page.locator('textarea');
    this.saveJobTitleButton = page.locator('button[type="submit"]').filter({ hasText: 'Save' });

    // Organization
    this.organizationTab = page.locator('span').filter({ hasText: 'Organization' });
    this.locationsLink = page.locator('a').filter({ hasText: 'Locations' });
    this.addLocationButton = page.locator('button').filter({ hasText: 'Add' });
    this.locationNameInput = page.locator('input[class*="oxd-input"]').nth(1);
    this.countryDropdown = page.locator('.oxd-select-text-input');
    this.saveLocationButton = page.locator('button[type="submit"]').filter({ hasText: 'Save' });

    // Search filters
    this.usernameSearchInput = page.locator('input[class*="oxd-input"]').nth(1);
    this.userRoleSearchDropdown = page.locator('.oxd-select-text-input').nth(0);
    this.employeeNameSearchInput = page.locator('input[placeholder*="Type for hints"]');
    this.statusSearchDropdown = page.locator('.oxd-select-text-input').nth(1);
  }

  async navigateToAdmin() {
    await this.page.goto('/web/index.php/admin/viewAdminModule');
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToUsers() {
    await this.userManagementTab.click();
    await this.usersLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToJobTitles() {
    await this.jobTab.click();
    await this.jobTitlesLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToLocations() {
    await this.organizationTab.click();
    await this.locationsLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickAddUser() {
    await this.addUserButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async createUser(userRole: string, employeeName: string, status: string, username: string, password: string) {
    // Select user role
    await this.userRoleDropdown.click();
    await this.page.locator('.oxd-select-option').filter({ hasText: userRole }).click();

    // Enter employee name
    await this.employeeNameInput.fill(employeeName);
    // Wait for autocomplete and select first option
    await this.page.waitForTimeout(2000);
    const firstOption = this.page.locator('.oxd-autocomplete-option').first();
    if (await firstOption.isVisible()) {
      await firstOption.click();
    }

    // Select status
    await this.statusDropdown.click();
    await this.page.locator('.oxd-select-option').filter({ hasText: status }).click();

    // Enter credentials
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);

    // Save user
    await this.saveUserButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async searchUserByUsername(username: string) {
    await this.usernameSearchInput.fill(username);
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async searchUserByRole(role: string) {
    await this.userRoleSearchDropdown.click();
    await this.page.locator('.oxd-select-option').filter({ hasText: role }).click();
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async searchUserByStatus(status: string) {
    await this.statusSearchDropdown.click();
    await this.page.locator('.oxd-select-option').filter({ hasText: status }).click();
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getUserCount(): Promise<number> {
    try {
      await this.userRows.first().waitFor({ timeout: 5000 });
      return await this.userRows.count();
    } catch {
      return 0;
    }
  }

  async deleteFirstUser() {
    const deleteButton = this.page.locator('button .oxd-icon.bi-trash').first();
    await deleteButton.click();
    
    // Confirm deletion
    const confirmButton = this.page.locator('button').filter({ hasText: 'Yes, Delete' });
    if (await confirmButton.isVisible()) {
      await confirmButton.click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  async editFirstUser() {
    const editButton = this.page.locator('button .oxd-icon.bi-pencil-fill').first();
    await editButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async addJobTitle(jobTitle: string, description?: string) {
    await this.addJobTitleButton.click();
    await this.page.waitForLoadState('networkidle');
    
    await this.jobTitleInput.fill(jobTitle);
    
    if (description) {
      await this.jobDescriptionTextarea.fill(description);
    }
    
    await this.saveJobTitleButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async addLocation(locationName: string, country: string) {
    await this.addLocationButton.click();
    await this.page.waitForLoadState('networkidle');
    
    await this.locationNameInput.fill(locationName);
    
    await this.countryDropdown.click();
    await this.page.locator('.oxd-select-option').filter({ hasText: country }).click();
    
    await this.saveLocationButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async resetSearch() {
    await this.resetButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyAdminPage() {
    await expect(this.pageTitle).toContainText('Admin');
    await expect(this.userManagementTab).toBeVisible();
  }

  async verifyUsersPage() {
    await expect(this.pageTitle).toContainText('System Users');
    await expect(this.addUserButton).toBeVisible();
    await expect(this.userTable).toBeVisible();
  }

  async verifyAddUserPage() {
    await expect(this.pageTitle).toContainText('Add User');
    await expect(this.userRoleDropdown).toBeVisible();
    await expect(this.saveUserButton).toBeVisible();
  }

  async verifyUserExists(username: string): Promise<boolean> {
    await this.searchUserByUsername(username);
    const count = await this.getUserCount();
    return count > 0;
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({ 
      path: `screenshots/admin-${name}.png`,
      fullPage: true 
    });
  }
}