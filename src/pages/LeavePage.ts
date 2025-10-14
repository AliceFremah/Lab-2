import { Page, Locator, expect } from '@playwright/test';

export interface LeaveRequest {
  leaveType: string;
  fromDate: string;
  toDate: string;
  comment?: string;
  partialDays?: 'All Days' | 'Start Day Only' | 'End Day Only' | 'Start and End Day';
}

export class LeavePage {
  readonly page: Page;
  readonly pageTitle: Locator;
  
  // Apply Leave
  readonly applyButton: Locator;
  readonly leaveTypeDropdown: Locator;
  readonly fromDateInput: Locator;
  readonly toDateInput: Locator;
  readonly partialDaysDropdown: Locator;
  readonly commentTextarea: Locator;
  readonly applyLeaveButton: Locator;
  readonly cancelButton: Locator;

  // Leave List
  readonly leaveListLink: Locator;
  readonly myLeaveLink: Locator;
  readonly leaveTable: Locator;
  readonly leaveRows: Locator;
  readonly statusColumn: Locator;

  // Leave Approvals (Manager)
  readonly pendingApprovalTab: Locator;
  readonly approveButtons: Locator;
  readonly rejectButtons: Locator;
  readonly commentModal: Locator;
  readonly confirmApproveButton: Locator;
  readonly confirmRejectButton: Locator;

  // Search filters
  readonly employeeNameFilter: Locator;
  readonly leaveTypeFilter: Locator;
  readonly leaveStatusFilter: Locator;
  readonly fromDateFilter: Locator;
  readonly toDateFilter: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;

  // Calendar
  readonly leaveCalendar: Locator;
  readonly calendarDates: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('.oxd-topbar-header-breadcrumb h6');
    
    // Apply Leave
    this.applyButton = page.locator('a').filter({ hasText: 'Apply' });
    this.leaveTypeDropdown = page.locator('.oxd-select-text-input').first();
    this.fromDateInput = page.locator('input[placeholder="yyyy-mm-dd"]').nth(0);
    this.toDateInput = page.locator('input[placeholder="yyyy-mm-dd"]').nth(1);
    this.partialDaysDropdown = page.locator('.oxd-select-text-input').nth(1);
    this.commentTextarea = page.locator('textarea[placeholder*="Type comment here"]');
    this.applyLeaveButton = page.locator('button[type="submit"]').filter({ hasText: 'Apply' });
    this.cancelButton = page.locator('button[type="button"]').filter({ hasText: 'Cancel' });

    // Leave List
    this.leaveListLink = page.locator('a').filter({ hasText: 'Leave List' });
    this.myLeaveLink = page.locator('a').filter({ hasText: 'My Leave' });
    this.leaveTable = page.locator('.oxd-table');
    this.leaveRows = page.locator('.oxd-table-body .oxd-table-row');
    this.statusColumn = page.locator('.oxd-table-cell').nth(5);

    // Leave Approvals
    this.pendingApprovalTab = page.locator('a').filter({ hasText: 'Pending Approval' });
    this.approveButtons = page.locator('button .oxd-icon.bi-check2');
    this.rejectButtons = page.locator('button .oxd-icon.bi-x');
    this.commentModal = page.locator('.oxd-dialog-container');
    this.confirmApproveButton = page.locator('button').filter({ hasText: 'Ok' });
    this.confirmRejectButton = page.locator('button').filter({ hasText: 'Ok' });

    // Search filters
    this.employeeNameFilter = page.locator('input[placeholder*="Type for hints"]');
    this.leaveTypeFilter = page.locator('.oxd-select-text-input').nth(0);
    this.leaveStatusFilter = page.locator('.oxd-select-text-input').nth(1);
    this.fromDateFilter = page.locator('input[placeholder="yyyy-mm-dd"]').nth(0);
    this.toDateFilter = page.locator('input[placeholder="yyyy-mm-dd"]').nth(1);
    this.searchButton = page.locator('button[type="submit"]').filter({ hasText: 'Search' });
    this.resetButton = page.locator('button[type="button"]').filter({ hasText: 'Reset' });

    // Calendar
    this.leaveCalendar = page.locator('.oxd-calendar');
    this.calendarDates = page.locator('.oxd-calendar-date');
  }

  async navigateToApplyLeave() {
    await this.page.goto('/web/index.php/leave/applyLeave');
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToMyLeave() {
    await this.page.goto('/web/index.php/leave/viewMyLeaveList');
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToLeaveList() {
    await this.page.goto('/web/index.php/leave/viewLeaveList');
    await this.page.waitForLoadState('networkidle');
  }

  async applyLeave(leaveRequest: LeaveRequest) {
    // Select leave type
    await this.leaveTypeDropdown.click();
    await this.page.locator('.oxd-select-option').filter({ hasText: leaveRequest.leaveType }).click();

    // Set from date
    await this.fromDateInput.fill(leaveRequest.fromDate);

    // Set to date
    await this.toDateInput.fill(leaveRequest.toDate);

    // Set partial days if specified
    if (leaveRequest.partialDays) {
      await this.partialDaysDropdown.click();
      await this.page.locator('.oxd-select-option').filter({ hasText: leaveRequest.partialDays }).click();
    }

    // Add comment if provided
    if (leaveRequest.comment) {
      await this.commentTextarea.fill(leaveRequest.comment);
    }

    // Submit the application
    await this.applyLeaveButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getLeaveRequestCount(): Promise<number> {
    try {
      await this.leaveRows.first().waitFor({ timeout: 5000 });
      return await this.leaveRows.count();
    } catch {
      return 0;
    }
  }

  async getLeaveStatus(rowIndex: number = 0): Promise<string> {
    const statusCell = this.leaveRows.nth(rowIndex).locator('.oxd-table-cell').nth(5);
    return await statusCell.textContent() || '';
  }

  async approveFirstLeaveRequest() {
    await this.approveButtons.first().click();
    
    // Handle confirmation modal if it appears
    try {
      await this.confirmApproveButton.waitFor({ timeout: 3000 });
      await this.confirmApproveButton.click();
    } catch {
      // No modal appeared, continue
    }
    
    await this.page.waitForLoadState('networkidle');
  }

  async rejectFirstLeaveRequest(comment?: string) {
    await this.rejectButtons.first().click();
    
    // Handle confirmation modal if it appears
    try {
      await this.confirmRejectButton.waitFor({ timeout: 3000 });
      
      if (comment) {
        const commentField = this.page.locator('textarea');
        if (await commentField.isVisible()) {
          await commentField.fill(comment);
        }
      }
      
      await this.confirmRejectButton.click();
    } catch {
      // No modal appeared, continue
    }
    
    await this.page.waitForLoadState('networkidle');
  }

  async searchLeaveByEmployee(employeeName: string) {
    await this.employeeNameFilter.fill(employeeName);
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async filterByLeaveType(leaveType: string) {
    await this.leaveTypeFilter.click();
    await this.page.locator('.oxd-select-option').filter({ hasText: leaveType }).click();
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async filterByStatus(status: string) {
    await this.leaveStatusFilter.click();
    await this.page.locator('.oxd-select-option').filter({ hasText: status }).click();
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async filterByDateRange(fromDate: string, toDate: string) {
    await this.fromDateFilter.fill(fromDate);
    await this.toDateFilter.fill(toDate);
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async resetFilters() {
    await this.resetButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyApplyLeavePage() {
    await expect(this.pageTitle).toContainText('Apply Leave');
    await expect(this.leaveTypeDropdown).toBeVisible();
    await expect(this.fromDateInput).toBeVisible();
    await expect(this.toDateInput).toBeVisible();
  }

  async verifyMyLeavePage() {
    await expect(this.pageTitle).toContainText('My Leave');
    await expect(this.leaveTable).toBeVisible();
  }

  async verifyLeaveListPage() {
    await expect(this.pageTitle).toContainText('Leave List');
    await expect(this.leaveTable).toBeVisible();
  }

  async verifyLeaveCalendarDisplayed(): Promise<boolean> {
    try {
      await this.leaveCalendar.waitFor({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async verifyLeaveRequestExists(fromDate: string, toDate: string): Promise<boolean> {
    const count = await this.getLeaveRequestCount();
    
    if (count === 0) {
      return false;
    }

    // Check if any row contains the date range
    for (let i = 0; i < count; i++) {
      const row = this.leaveRows.nth(i);
      const rowText = await row.textContent();
      
      if (rowText?.includes(fromDate) || rowText?.includes(toDate)) {
        return true;
      }
    }
    
    return false;
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({ 
      path: `screenshots/leave-${name}.png`,
      fullPage: true 
    });
  }
}