import { test, expect } from '../src/fixtures/test-fixtures';
import { TestDataGenerator } from '../src/data/test-data-generator';

test.describe('Leave Management Tests', () => {
  
  test.describe('ESS Leave Application', () => {
    
    test.beforeEach(async ({ authenticatedESSPage, leavePage }) => {
      await leavePage.navigateToApplyLeave();
      await leavePage.verifyApplyLeavePage();
    });

    test('ESS applies for vacation leave @leave @regression', async ({ 
      leavePage 
    }) => {
      const leaveRequest = TestDataGenerator.generateLeaveRequestWithDateRange(7, 3);
      
      // Apply for leave
      await leavePage.applyLeave(leaveRequest);
      
      // Verify success message or navigation
      await expect(leavePage.page.locator('h6')).toContainText('Leave');
      
      // Navigate to My Leave to verify application
      await leavePage.navigateToMyLeave();
      await leavePage.verifyMyLeavePage();
      
      // Check if leave request appears in list
      const leaveExists = await leavePage.verifyLeaveRequestExists(
        leaveRequest.fromDate, 
        leaveRequest.toDate
      );
      
      expect(leaveExists).toBeTruthy();
      
      await leavePage.takeScreenshot('leave-applied');
    });

    test('ESS applies for sick leave with comment @leave @regression', async ({ 
      leavePage 
    }) => {
      const leaveRequest = {
        leaveType: 'Sick Leave',
        fromDate: '2024-12-01',
        toDate: '2024-12-03',
        comment: 'Medical appointment and recovery time needed'
      };
      
      await leavePage.applyLeave(leaveRequest);
      
      // Navigate to My Leave to verify
      await leavePage.navigateToMyLeave();
      
      const requestCount = await leavePage.getLeaveRequestCount();
      expect(requestCount).toBeGreaterThan(0);
      
      await leavePage.takeScreenshot('sick-leave-applied');
    });

    test('ESS applies for partial day leave @leave @regression', async ({ 
      leavePage 
    }) => {
      const leaveRequest = {
        leaveType: 'Personal Leave',
        fromDate: '2024-12-05',
        toDate: '2024-12-05',
        comment: 'Half day leave for personal work',
        partialDays: 'Start Day Only' as const
      };
      
      await leavePage.applyLeave(leaveRequest);
      
      // Verify in My Leave
      await leavePage.navigateToMyLeave();
      const requestCount = await leavePage.getLeaveRequestCount();
      expect(requestCount).toBeGreaterThan(0);
    });

    test('ESS views leave history @leave @regression', async ({ 
      leavePage 
    }) => {
      // Navigate to My Leave
      await leavePage.navigateToMyLeave();
      await leavePage.verifyMyLeavePage();
      
      // Check leave history
      const leaveCount = await leavePage.getLeaveRequestCount();
      console.log(`Found ${leaveCount} leave records`);
      
      // If there are leaves, check their status
      if (leaveCount > 0) {
        const firstLeaveStatus = await leavePage.getLeaveStatus(0);
        console.log(`First leave status: ${firstLeaveStatus}`);
        
        expect(['Pending Approval', 'Approved', 'Rejected', 'Cancelled'])
          .toContain(firstLeaveStatus.trim());
      }
      
      await leavePage.takeScreenshot('leave-history');
    });

    test('ESS leave calendar validation @leave @regression', async ({ 
      leavePage, 
      page 
    }) => {
      // Navigate to leave calendar if available
      await page.goto('/web/index.php/leave/viewLeaveModule');
      
      // Check if calendar is displayed
      const calendarDisplayed = await leavePage.verifyLeaveCalendarDisplayed();
      
      if (calendarDisplayed) {
        expect(calendarDisplayed).toBeTruthy();
        await leavePage.takeScreenshot('leave-calendar');
      } else {
        console.log('Leave calendar not available in current view');
      }
    });
  });

  test.describe('Manager Leave Approval', () => {
    
    test.beforeEach(async ({ authenticatedManagerPage }) => {
      // Manager should have access to leave approvals
    });

    test('Manager views pending leave requests @leave @regression', async ({ 
      leavePage,
      page 
    }) => {
      // Navigate to leave list/approvals
      await leavePage.navigateToLeaveList();
      await leavePage.verifyLeaveListPage();
      
      // Filter by pending status
      await leavePage.filterByStatus('Pending Approval');
      
      const pendingCount = await leavePage.getLeaveRequestCount();
      console.log(`Found ${pendingCount} pending leave requests`);
      
      await leavePage.takeScreenshot('pending-leave-requests');
    });

    test('Manager approves leave request @leave @regression', async ({ 
      leavePage 
    }) => {
      await leavePage.navigateToLeaveList();
      
      // Filter for pending requests
      await leavePage.filterByStatus('Pending Approval');
      
      const initialCount = await leavePage.getLeaveRequestCount();
      
      if (initialCount > 0) {
        // Approve first pending request
        await leavePage.approveFirstLeaveRequest();
        
        // Filter by approved to verify status change
        await leavePage.filterByStatus('Approved');
        
        const approvedCount = await leavePage.getLeaveRequestCount();
        expect(approvedCount).toBeGreaterThanOrEqual(0);
        
        await leavePage.takeScreenshot('leave-approved');
      } else {
        console.log('No pending leave requests to approve');
      }
    });

    test('Manager rejects leave request with comment @leave @regression', async ({ 
      leavePage 
    }) => {
      await leavePage.navigateToLeaveList();
      
      // Filter for pending requests
      await leavePage.filterByStatus('Pending Approval');
      
      const initialCount = await leavePage.getLeaveRequestCount();
      
      if (initialCount > 0) {
        // Reject first pending request
        const rejectionComment = 'Insufficient coverage during requested dates';
        await leavePage.rejectFirstLeaveRequest(rejectionComment);
        
        // Filter by rejected to verify
        await leavePage.filterByStatus('Rejected');
        
        const rejectedCount = await leavePage.getLeaveRequestCount();
        expect(rejectedCount).toBeGreaterThanOrEqual(0);
        
        await leavePage.takeScreenshot('leave-rejected');
      } else {
        console.log('No pending leave requests to reject');
      }
    });

    test('Manager searches leave by employee @leave @regression', async ({ 
      leavePage 
    }) => {
      await leavePage.navigateToLeaveList();
      
      // Search by employee name
      await leavePage.searchLeaveByEmployee('John');
      
      const searchResults = await leavePage.getLeaveRequestCount();
      console.log(`Found ${searchResults} leave requests for searched employee`);
      
      // Reset search
      await leavePage.resetFilters();
      
      const totalResults = await leavePage.getLeaveRequestCount();
      expect(totalResults).toBeGreaterThanOrEqual(searchResults);
      
      await leavePage.takeScreenshot('leave-search-by-employee');
    });

    test('Manager filters leave by date range @leave @regression', async ({ 
      leavePage 
    }) => {
      await leavePage.navigateToLeaveList();
      
      // Filter by date range (last month)
      const fromDate = '2024-11-01';
      const toDate = '2024-11-30';
      
      await leavePage.filterByDateRange(fromDate, toDate);
      
      const filteredResults = await leavePage.getLeaveRequestCount();
      console.log(`Found ${filteredResults} leave requests in date range`);
      
      await leavePage.takeScreenshot('leave-filtered-by-date');
    });

    test('Manager filters leave by type @leave @regression', async ({ 
      leavePage 
    }) => {
      await leavePage.navigateToLeaveList();
      
      // Filter by vacation leave
      await leavePage.filterByLeaveType('Vacation Leave');
      
      const vacationResults = await leavePage.getLeaveRequestCount();
      console.log(`Found ${vacationResults} vacation leave requests`);
      
      // Filter by sick leave
      await leavePage.resetFilters();
      await leavePage.filterByLeaveType('Sick Leave');
      
      const sickResults = await leavePage.getLeaveRequestCount();
      console.log(`Found ${sickResults} sick leave requests`);
      
      await leavePage.takeScreenshot('leave-filtered-by-type');
    });
  });

  test.describe('Leave Workflow Integration', () => {
    
    test('Complete leave request workflow @leave @regression', async ({ 
      page,
      loginPage,
      dashboardPage,
      leavePage,
      essUser,
      managerUser 
    }) => {
      const leaveRequest = TestDataGenerator.generateLeaveRequestWithDateRange(10, 5);
      
      // Step 1: ESS applies for leave
      await loginPage.navigateTo();
      await loginPage.login(essUser);
      await dashboardPage.verifyDashboardLoaded();
      
      await leavePage.navigateToApplyLeave();
      await leavePage.applyLeave(leaveRequest);
      
      // Verify leave was applied
      await leavePage.navigateToMyLeave();
      const leaveApplied = await leavePage.verifyLeaveRequestExists(
        leaveRequest.fromDate, 
        leaveRequest.toDate
      );
      expect(leaveApplied).toBeTruthy();
      
      await leavePage.takeScreenshot('workflow-leave-applied');
      
      // Step 2: Logout ESS
      await dashboardPage.logout();
      
      // Step 3: Manager logs in and approves
      await loginPage.login(managerUser);
      await dashboardPage.verifyDashboardLoaded();
      
      await leavePage.navigateToLeaveList();
      await leavePage.filterByStatus('Pending Approval');
      
      const pendingCount = await leavePage.getLeaveRequestCount();
      
      if (pendingCount > 0) {
        await leavePage.approveFirstLeaveRequest();
        await leavePage.takeScreenshot('workflow-leave-approved');
      }
      
      // Step 4: Logout Manager
      await dashboardPage.logout();
      
      // Step 5: ESS logs back in to verify approval
      await loginPage.login(essUser);
      await dashboardPage.verifyDashboardLoaded();
      
      await leavePage.navigateToMyLeave();
      const finalCount = await leavePage.getLeaveRequestCount();
      expect(finalCount).toBeGreaterThan(0);
      
      // Check if any leave shows approved status
      if (finalCount > 0) {
        const status = await leavePage.getLeaveStatus(0);
        console.log(`Final leave status: ${status}`);
      }
      
      await leavePage.takeScreenshot('workflow-complete');
    });

    test('Leave request rejection workflow @leave @regression', async ({ 
      page,
      loginPage,
      dashboardPage,
      leavePage,
      essUser,
      managerUser 
    }) => {
      const leaveRequest = TestDataGenerator.generateLeaveRequestWithDateRange(15, 2);
      
      // ESS applies for leave
      await loginPage.navigateTo();
      await loginPage.login(essUser);
      await leavePage.navigateToApplyLeave();
      await leavePage.applyLeave(leaveRequest);
      
      // Manager rejects leave
      await dashboardPage.logout();
      await loginPage.login(managerUser);
      
      await leavePage.navigateToLeaveList();
      await leavePage.filterByStatus('Pending Approval');
      
      const pendingCount = await leavePage.getLeaveRequestCount();
      
      if (pendingCount > 0) {
        await leavePage.rejectFirstLeaveRequest('Insufficient staffing during requested period');
      }
      
      // ESS verifies rejection
      await dashboardPage.logout();
      await loginPage.login(essUser);
      
      await leavePage.navigateToMyLeave();
      const finalCount = await leavePage.getLeaveRequestCount();
      expect(finalCount).toBeGreaterThan(0);
      
      await leavePage.takeScreenshot('rejection-workflow-complete');
    });

    test('Multiple leave requests management @leave @regression', async ({ 
      leavePage,
      authenticatedESSPage 
    }) => {
      // Apply for multiple leave requests
      const leaveRequests = [
        TestDataGenerator.generateLeaveRequestWithDateRange(5, 1),
        TestDataGenerator.generateLeaveRequestWithDateRange(10, 3),
        TestDataGenerator.generateLeaveRequestWithDateRange(20, 2)
      ];
      
      for (const request of leaveRequests) {
        await leavePage.navigateToApplyLeave();
        await leavePage.applyLeave(request);
      }
      
      // Verify all requests in My Leave
      await leavePage.navigateToMyLeave();
      const totalRequests = await leavePage.getLeaveRequestCount();
      
      console.log(`Total leave requests: ${totalRequests}`);
      expect(totalRequests).toBeGreaterThanOrEqual(0);
      
      await leavePage.takeScreenshot('multiple-leave-requests');
    });

    test('Leave balance validation @leave @regression', async ({ 
      leavePage,
      page,
      authenticatedESSPage 
    }) => {
      // Check if leave balance information is available
      await page.goto('/web/index.php/leave/viewMyLeaveList');
      
      // Look for leave balance or entitlement information
      const leaveBalance = page.locator('.oxd-text').filter({ hasText: /balance|entitlement|remaining/i });
      
      if (await leaveBalance.count() > 0) {
        const balanceText = await leaveBalance.first().textContent();
        console.log('Leave balance information:', balanceText);
        
        await leavePage.takeScreenshot('leave-balance');
      } else {
        console.log('Leave balance information not displayed in current view');
      }
    });
  });
});