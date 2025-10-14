import { Page, Locator, expect } from '@playwright/test';

export interface EmployeeData {
  firstName: string;
  middleName?: string;
  lastName: string;
  employeeId?: string;
  photoPath?: string;
  jobTitle?: string;
  department?: string;
  location?: string;
  username?: string;
  password?: string;
}

export class EmployeePage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly addButton: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;
  readonly employeeTable: Locator;
  readonly employeeRows: Locator;
  readonly deleteButtons: Locator;
  readonly editButtons: Locator;

  // Add Employee Form
  readonly firstNameInput: Locator;
  readonly middleNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly photoUpload: Locator;
  readonly createLoginToggle: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;

  // Employee Details Form
  readonly jobTitleDropdown: Locator;
  readonly departmentDropdown: Locator;
  readonly locationDropdown: Locator;
  readonly saveJobButton: Locator;

  // Search filters
  readonly employeeNameInput: Locator;
  readonly employeeIdSearchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('.oxd-topbar-header-breadcrumb h6');
    this.addButton = page.locator('button').filter({ hasText: 'Add' });
    this.searchInput = page.locator('input[placeholder*="Type for hints"]');
    this.searchButton = page.locator('button[type="submit"]').filter({ hasText: 'Search' });
    this.resetButton = page.locator('button[type="button"]').filter({ hasText: 'Reset' });
    this.employeeTable = page.locator('.oxd-table');
    this.employeeRows = page.locator('.oxd-table-body .oxd-table-row');
    this.deleteButtons = page.locator('button .oxd-icon.bi-trash');
    this.editButtons = page.locator('button .oxd-icon.bi-pencil-fill');

    // Add Employee Form
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.middleNameInput = page.locator('input[name="middleName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.employeeIdInput = page.locator('input[class*="oxd-input"][data-v-1f99f73c]').nth(1);
    this.photoUpload = page.locator('input[type="file"]');
    this.createLoginToggle = page.locator('.oxd-switch-input');
    this.usernameInput = page.locator('input[autocomplete="off"]').nth(0);
    this.passwordInput = page.locator('input[type="password"]').nth(0);
    this.confirmPasswordInput = page.locator('input[type="password"]').nth(1);
    this.saveButton = page.locator('button[type="submit"]').filter({ hasText: 'Save' });
    this.cancelButton = page.locator('button[type="button"]').filter({ hasText: 'Cancel' });

    // Job Details
    this.jobTitleDropdown = page.locator('.oxd-select-text-input').nth(0);
    this.departmentDropdown = page.locator('.oxd-select-text-input').nth(1);
    this.locationDropdown = page.locator('.oxd-select-text-input').nth(2);
    this.saveJobButton = page.locator('button[type="submit"]').filter({ hasText: 'Save' });

    // Search filters
    this.employeeNameInput = page.locator('input[placeholder*="Type for hints"]').nth(0);
    this.employeeIdSearchInput = page.locator('input[placeholder*="Type for hints"]').nth(1);
  }

  async navigateTo() {
    await this.page.goto('/web/index.php/pim/viewEmployeeList');
    await this.page.waitForLoadState('networkidle');
  }

  async clickAddEmployee() {
    await this.addButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async fillEmployeeBasicInfo(employeeData: EmployeeData) {
    await this.firstNameInput.fill(employeeData.firstName);
    if (employeeData.middleName) {
      await this.middleNameInput.fill(employeeData.middleName);
    }
    await this.lastNameInput.fill(employeeData.lastName);
    
    if (employeeData.employeeId) {
      await this.employeeIdInput.clear();
      await this.employeeIdInput.fill(employeeData.employeeId);
    }
  }

  async uploadEmployeePhoto(photoPath: string) {
    await this.photoUpload.setInputFiles(photoPath);
  }

  async enableCreateLogin() {
    await this.createLoginToggle.click();
  }

  async fillLoginCredentials(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
  }

  async saveEmployee() {
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
    
    // Wait for success message or redirect
    await this.page.waitForTimeout(2000);
  }

  async searchEmployeeByName(name: string) {
    await this.employeeNameInput.fill(name);
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async searchEmployeeById(employeeId: string) {
    await this.employeeIdSearchInput.fill(employeeId);
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getEmployeeCount(): Promise<number> {
    try {
      await this.employeeRows.first().waitFor({ timeout: 5000 });
      return await this.employeeRows.count();
    } catch {
      return 0;
    }
  }

  async editFirstEmployee() {
    await this.editButtons.first().click();
    await this.page.waitForLoadState('networkidle');
  }

  async deleteFirstEmployee() {
    await this.deleteButtons.first().click();
    
    // Confirm deletion
    const confirmButton = this.page.locator('button').filter({ hasText: 'Yes, Delete' });
    if (await confirmButton.isVisible()) {
      await confirmButton.click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  async selectJobTitle(jobTitle: string) {
    await this.jobTitleDropdown.click();
    await this.page.locator('.oxd-select-option').filter({ hasText: jobTitle }).click();
  }

  async selectDepartment(department: string) {
    await this.departmentDropdown.click();
    await this.page.locator('.oxd-select-option').filter({ hasText: department }).click();
  }

  async selectLocation(location: string) {
    await this.locationDropdown.click();
    await this.page.locator('.oxd-select-option').filter({ hasText: location }).click();
  }

  async saveJobDetails() {
    await this.saveJobButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyEmployeeListPage() {
    await expect(this.pageTitle).toContainText('Employee Information');
    await expect(this.addButton).toBeVisible();
    await expect(this.searchButton).toBeVisible();
  }

  async verifyAddEmployeePage() {
    await expect(this.pageTitle).toContainText('Add Employee');
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.saveButton).toBeVisible();
  }

  async verifyEmployeeExists(name: string): Promise<boolean> {
    await this.searchEmployeeByName(name);
    const count = await this.getEmployeeCount();
    return count > 0;
  }

  async resetSearch() {
    await this.resetButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({ 
      path: `screenshots/employee-${name}.png`,
      fullPage: true 
    });
  }
}