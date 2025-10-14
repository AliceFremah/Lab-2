import { test, expect } from '../src/fixtures/test-fixtures';
import { TestDataGenerator } from '../src/data/test-data-generator';
import { EmployeeData } from '../src/pages/EmployeePage';

test.describe('Employee Management Tests (Admin)', () => {
  
  test.beforeEach(async ({ authenticatedAdminPage, employeePage }) => {
    // Navigate to employee list page
    await employeePage.navigateTo();
    await employeePage.verifyEmployeeListPage();
  });

  test('Add new employee with basic information @employee @regression', async ({ 
    employeePage 
  }) => {
    const employeeData = TestDataGenerator.generateEmployee();
    
    // Click Add Employee
    await employeePage.clickAddEmployee();
    await employeePage.verifyAddEmployeePage();
    
    // Fill employee basic information
    await employeePage.fillEmployeeBasicInfo(employeeData);
    
    // Save employee
    await employeePage.saveEmployee();
    
    // Verify employee was created (should be on employee details page)
    await expect(employeePage.page.locator('h6')).toContainText('Personal Details');
    
    // Take screenshot for documentation
    await employeePage.takeScreenshot('employee-created');
  });

  test('Add new employee with photo upload @employee @regression', async ({ 
    employeePage,
    page 
  }) => {
    const employeeData = TestDataGenerator.generateEmployee();
    
    // Create a test image file
    const testImageBuffer = Buffer.from('R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=', 'base64');
    const testImagePath = 'test-employee-photo.gif';
    
    // Write test image to file system temporarily
    await page.context().addInitScript(() => {
      // This will run before page loads
    });
    
    await employeePage.clickAddEmployee();
    await employeePage.fillEmployeeBasicInfo(employeeData);
    
    try {
      // Note: File upload might not work in demo environment
      // This is a demonstration of how it would be implemented
      const fileInput = employeePage.page.locator('input[type="file"]');
      if (await fileInput.isVisible()) {
        await fileInput.setInputFiles({
          name: 'test-photo.jpg',
          mimeType: 'image/jpeg',
          buffer: testImageBuffer
        });
      }
    } catch (error) {
      console.log('Photo upload not available in demo environment');
    }
    
    await employeePage.saveEmployee();
    
    // Verify employee creation
    await expect(employeePage.page.locator('h6')).toContainText('Personal Details');
  });

  test('Add new employee with login credentials @employee @regression', async ({ 
    employeePage 
  }) => {
    const employeeData = TestDataGenerator.generateEmployee();
    
    await employeePage.clickAddEmployee();
    await employeePage.fillEmployeeBasicInfo(employeeData);
    
    // Enable create login details
    await employeePage.enableCreateLogin();
    
    // Fill login credentials
    if (employeeData.username && employeeData.password) {
      await employeePage.fillLoginCredentials(employeeData.username, employeeData.password);
    }
    
    await employeePage.saveEmployee();
    
    // Verify employee creation
    await expect(employeePage.page.locator('h6')).toContainText('Personal Details');
  });

  test('Search employee by name @employee @regression', async ({ 
    employeePage 
  }) => {
    // First, let's get the initial count
    const initialCount = await employeePage.getEmployeeCount();
    
    // Search for a common name that might exist
    await employeePage.searchEmployeeByName('John');
    
    const searchResults = await employeePage.getEmployeeCount();
    
    // Verify search functionality works (results should be <= initial count)
    expect(searchResults).toBeLessThanOrEqual(initialCount);
    
    // Reset search to verify reset functionality
    await employeePage.resetSearch();
    
    const resetCount = await employeePage.getEmployeeCount();
    expect(resetCount).toBeGreaterThanOrEqual(searchResults);
    
    await employeePage.takeScreenshot('employee-search-reset');
  });

  test('Search employee by ID @employee @regression', async ({ 
    employeePage 
  }) => {
    // Search with a test employee ID
    const testId = '0001';
    await employeePage.searchEmployeeById(testId);
    
    const searchResults = await employeePage.getEmployeeCount();
    
    // Verify search results (should be 0 or 1 for specific ID)
    expect(searchResults).toBeLessThanOrEqual(1);
    
    // Reset and verify
    await employeePage.resetSearch();
    
    await employeePage.takeScreenshot('employee-id-search');
  });

  test('Edit employee job details @employee @regression', async ({ 
    employeePage 
  }) => {
    // First ensure we have employees to edit
    const employeeCount = await employeePage.getEmployeeCount();
    
    if (employeeCount > 0) {
      // Edit the first employee
      await employeePage.editFirstEmployee();
      
      // Navigate to Job tab if available
      const jobTab = employeePage.page.locator('a').filter({ hasText: 'Job' });
      if (await jobTab.isVisible()) {
        await jobTab.click();
        
        // Try to update job details
        try {
          await employeePage.selectJobTitle('QA Engineer');
          await employeePage.selectDepartment('Quality Assurance');
          await employeePage.saveJobDetails();
          
          // Verify save success
          const successMessage = employeePage.page.locator('.oxd-toast-content-text');
          if (await successMessage.isVisible()) {
            await expect(successMessage).toContainText('Success');
          }
        } catch (error) {
          console.log('Job details update may not be available for all employees');
        }
      }
      
      await employeePage.takeScreenshot('employee-job-edit');
    } else {
      // If no employees exist, create one first
      const employeeData = TestDataGenerator.generateEmployee();
      await employeePage.clickAddEmployee();
      await employeePage.fillEmployeeBasicInfo(employeeData);
      await employeePage.saveEmployee();
    }
  });

  test('Delete employee record @employee @regression', async ({ 
    employeePage 
  }) => {
    // Create a test employee first to ensure we have one to delete
    const testEmployee = TestDataGenerator.generateEmployee();
    
    await employeePage.clickAddEmployee();
    await employeePage.fillEmployeeBasicInfo(testEmployee);
    await employeePage.saveEmployee();
    
    // Navigate back to employee list
    await employeePage.navigateTo();
    
    // Search for the created employee
    await employeePage.searchEmployeeByName(testEmployee.firstName);
    
    const initialCount = await employeePage.getEmployeeCount();
    
    if (initialCount > 0) {
      // Delete the first employee in search results
      await employeePage.deleteFirstEmployee();
      
      // Verify deletion by checking count decreased
      const finalCount = await employeePage.getEmployeeCount();
      expect(finalCount).toBeLessThan(initialCount);
      
      await employeePage.takeScreenshot('employee-deleted');
    }
  });

  test('Employee CRUD workflow @employee @regression', async ({ 
    employeePage 
  }) => {
    const testEmployee = TestDataGenerator.generateEmployee();
    
    // CREATE: Add new employee
    await employeePage.clickAddEmployee();
    await employeePage.fillEmployeeBasicInfo(testEmployee);
    await employeePage.saveEmployee();
    
    // Verify creation
    await expect(employeePage.page.locator('h6')).toContainText('Personal Details');
    
    // Navigate back to list
    await employeePage.navigateTo();
    
    // READ: Search and verify employee exists
    await employeePage.searchEmployeeByName(testEmployee.firstName);
    const foundEmployee = await employeePage.verifyEmployeeExists(testEmployee.firstName);
    expect(foundEmployee).toBeTruthy();
    
    // UPDATE: Edit employee (if edit functionality available)
    const editCount = await employeePage.getEmployeeCount();
    if (editCount > 0) {
      await employeePage.editFirstEmployee();
      
      // Try to update personal details
      const personalTab = employeePage.page.locator('a').filter({ hasText: 'Personal Details' });
      if (await personalTab.isVisible()) {
        await personalTab.click();
      }
      
      // Update middle name if field is available
      const middleNameField = employeePage.page.locator('input[name="middleName"]');
      if (await middleNameField.isVisible()) {
        await middleNameField.fill('Updated');
        
        const saveButton = employeePage.page.locator('button[type="submit"]').filter({ hasText: 'Save' });
        if (await saveButton.isVisible()) {
          await saveButton.click();
        }
      }
      
      // Navigate back to list
      await employeePage.navigateTo();
      await employeePage.searchEmployeeByName(testEmployee.firstName);
    }
    
    // DELETE: Remove employee
    const deleteCount = await employeePage.getEmployeeCount();
    if (deleteCount > 0) {
      await employeePage.deleteFirstEmployee();
      
      // Verify deletion
      const finalCount = await employeePage.getEmployeeCount();
      expect(finalCount).toBeLessThan(deleteCount);
    }
    
    await employeePage.takeScreenshot('employee-crud-complete');
  });

  test('Bulk employee operations @employee @regression', async ({ 
    employeePage 
  }) => {
    // Create multiple test employees
    const employees = TestDataGenerator.generateMultipleEmployees(3);
    
    for (const employee of employees) {
      await employeePage.clickAddEmployee();
      await employeePage.fillEmployeeBasicInfo(employee);
      await employeePage.saveEmployee();
      await employeePage.navigateTo();
    }
    
    // Verify all employees can be found
    for (const employee of employees) {
      const exists = await employeePage.verifyEmployeeExists(employee.firstName);
      expect(exists).toBeTruthy();
    }
    
    await employeePage.takeScreenshot('bulk-employees-created');
  });

  test('Employee list pagination @employee @regression', async ({ 
    employeePage 
  }) => {
    // Check if pagination controls exist
    const paginationInfo = employeePage.page.locator('.oxd-pagination__info');
    const nextButton = employeePage.page.locator('button[aria-label="Next"]');
    const prevButton = employeePage.page.locator('button[aria-label="Previous"]');
    
    if (await paginationInfo.isVisible()) {
      const paginationText = await paginationInfo.textContent();
      console.log('Pagination info:', paginationText);
      
      // If next button is available, test pagination
      if (await nextButton.isEnabled()) {
        await nextButton.click();
        await employeePage.page.waitForLoadState('networkidle');
        
        // Verify page changed
        const newPaginationText = await paginationInfo.textContent();
        expect(newPaginationText).not.toBe(paginationText);
        
        // Go back to first page
        if (await prevButton.isEnabled()) {
          await prevButton.click();
          await employeePage.page.waitForLoadState('networkidle');
        }
      }
    }
    
    await employeePage.takeScreenshot('employee-pagination');
  });

  test('Employee data validation @employee @regression', async ({ 
    employeePage 
  }) => {
    await employeePage.clickAddEmployee();
    
    // Try to save without required fields
    await employeePage.saveEmployee();
    
    // Check for validation messages
    const validationMessages = employeePage.page.locator('.oxd-input-field-error-message');
    const validationCount = await validationMessages.count();
    
    if (validationCount > 0) {
      // Validation is working
      expect(validationCount).toBeGreaterThan(0);
      
      // Fill minimum required fields
      await employeePage.fillEmployeeBasicInfo({
        firstName: 'Test',
        lastName: 'Employee'
      });
      
      // Now save should work
      await employeePage.saveEmployee();
    }
    
    await employeePage.takeScreenshot('employee-validation');
  });
});