# OrangeHRM Playwright E2E Testing Framework

A comprehensive end-to-end testing framework for OrangeHRM using Playwright with TypeScript.

## 🎯 Project Overview

This framework provides automated testing for OrangeHRM's core HR workflows including:
- **Authentication** (Admin, ESS, Manager roles)
- **Employee Management** (CRUD operations)
- **Leave Management** (Apply, Approve, Reject workflows)
- **User Role Access Control**
- **Cross-browser compatibility**
- **Visual UI validation**

## 🚀 Features

- **Page Object Model (POM)** architecture
- **Multi-role user support** (Admin, ESS, Manager)
- **Test data generation** with Faker.js
- **Cross-browser testing** (Chromium, Firefox, WebKit)
- **Allure reporting** with rich test documentation
- **CI/CD integration** with GitHub Actions
- **Visual regression testing** capabilities
- **Parallel test execution**
- **Test tagging** for selective execution

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd orangehrm-playwright-e2e
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Playwright browsers:**
   ```bash
   npx playwright install
   ```

## 🏗️ Project Structure

```
├── .github/
│   └── workflows/
│       └── playwright.yml          # CI/CD configuration
├── src/
│   ├── config/
│   │   └── test-config.ts          # Test configuration & user credentials
│   ├── data/
│   │   └── test-data-generator.ts  # Faker-based test data generation
│   ├── fixtures/
│   │   └── test-fixtures.ts        # Test fixtures & page objects
│   └── pages/
│       ├── LoginPage.ts            # Login page object model
│       ├── DashboardPage.ts        # Dashboard page object model
│       ├── EmployeePage.ts         # Employee management POM
│       ├── LeavePage.ts            # Leave management POM
│       └── AdminPage.ts            # Admin functionality POM
├── tests/
│   ├── auth.spec.ts                # Authentication test suite
│   ├── employee.spec.ts            # Employee management tests
│   ├── leave.spec.ts               # Leave management tests
│   ├── access-control.spec.ts      # Role-based access control
│   └── e2e-scenarios.spec.ts       # End-to-end business workflows
├── utils/
│   ├── global-setup.ts             # Global test setup
│   └── global-teardown.ts          # Global test cleanup
├── playwright.config.ts            # Playwright configuration
└── package.json                    # Dependencies & scripts
```

## 🧪 Test Execution

### Run All Tests
```bash
npm test
```

### Run by Tags
```bash
# Smoke tests only
npm run test:smoke

# Employee management tests
npm run test:employee

# Leave management tests
npm run test:leave

# Full regression suite
npm run test:regression
```

### Run in Headed Mode
```bash
npm run test:headed
```

### Debug Tests
```bash
npm run test:debug
```

### Generate & View Reports
```bash
# Generate Allure report
npm run allure:generate

# Serve Allure report
npm run allure:serve

# View Playwright HTML report
npm run test:report
```

## 🎭 Test Categories & Tags

### @smoke
Basic functionality tests for quick feedback:
- Valid login for all user roles
- Dashboard accessibility
- Core navigation

### @employee
Employee management workflows:
- Add/Edit/Delete employees
- Employee search functionality
- Job details management
- Photo upload capabilities

### @leave
Leave management processes:
- Leave application (ESS)
- Leave approval/rejection (Manager)
- Leave history and status tracking
- Multi-role leave workflows

### @regression
Complete test suite including all functionality and edge cases.

## 👥 User Roles & Test Data

The framework supports three main user roles:

### Admin User
- **Username:** Admin
- **Password:** admin123
- **Capabilities:** Full system access, employee management, user administration

### ESS (Employee Self Service)
- **Username:** user01
- **Password:** user01Pass
- **Capabilities:** Personal information, leave applications, limited access

### Manager
- **Username:** manager01
- **Password:** manager01Pass
- **Capabilities:** Team management, leave approvals, reports access

## 🔄 End-to-End Scenarios

### Scenario A: Employee Lifecycle
1. Admin creates new employee with login credentials
2. ESS user logs in and applies for leave
3. Manager approves the leave request
4. ESS verifies approved leave status

### Scenario B: Multi-Role Access Validation
1. Verify Admin has full system access
2. Verify ESS restricted access (no Admin functions)
3. Verify Manager has leave approval access

### Scenario C: Leave Request Workflow
1. ESS applies for leave with specific dates
2. Manager reviews and approves leave
3. ESS confirms leave status changed to approved

### Scenario D: Employee CRUD Operations
1. Admin creates employee record
2. Updates job details and personal information
3. Deletes employee record
4. Verifies employee no longer searchable

### Scenario E: Visual UI Validation
1. Captures baseline screenshots of key pages
2. Validates responsive design across viewports
3. Checks color scheme and branding consistency
4. Measures page load performance

## 🔧 Configuration

### Environment Variables
Create a `.env` file for environment-specific configurations:
```env
BASE_URL=https://opensource-demo.orangehrmlive.com/
ADMIN_USERNAME=Admin
ADMIN_PASSWORD=admin123
ESS_USERNAME=user01
ESS_PASSWORD=user01Pass
MANAGER_USERNAME=manager01
MANAGER_PASSWORD=manager01Pass
```

### Playwright Configuration
Key settings in `playwright.config.ts`:
- **Base URL:** OrangeHRM demo instance
- **Browsers:** Chromium, Firefox, WebKit
- **Reporters:** HTML, Allure, JUnit
- **Timeouts:** Configurable action and navigation timeouts
- **Screenshots:** On failure
- **Videos:** Retain on failure
- **Traces:** On first retry

## 📊 CI/CD Integration

### GitHub Actions Workflow
- **Pull Requests:** Smoke tests for quick feedback
- **Main/Develop Push:** Full test suite execution
- **Nightly Schedule:** Regression testing
- **Parallel Execution:** Tests run across multiple browsers and shards
- **Artifact Upload:** Test reports, screenshots, and videos
- **GitHub Pages:** Automated Allure report deployment

### Pipeline Jobs
1. **Smoke Test Quick:** Fast feedback for PRs
2. **Test Matrix:** Parallel execution across browsers
3. **Publish Report:** Merge results and generate reports
4. **Performance Test:** Nightly performance validation

## 🐛 Debugging & Troubleshooting

### Common Issues

1. **Login Failures:**
   - Verify test user credentials in demo environment
   - Check for application updates that might affect selectors

2. **Timeout Errors:**
   - Increase timeout values in configuration
   - Check network stability and application responsiveness

3. **Element Not Found:**
   - Application UI changes may require selector updates
   - Use browser developer tools to inspect current DOM structure

### Debug Tips
- Use `--headed` mode to watch tests execute
- Add `await page.pause()` for interactive debugging
- Enable trace viewer for detailed execution analysis
- Check screenshots and videos in test results

## 📈 Reporting & Analytics

### Allure Reports
Rich test reporting with:
- Test execution trends
- Failure analysis and categorization
- Test duration metrics
- Environment information
- Screenshots and attachments

### Playwright HTML Reports
Built-in reporting featuring:
- Test results overview
- Trace viewer integration
- Screenshot galleries
- Video recordings
- Network activity logs

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/new-test-suite`
3. **Follow naming conventions:**
   - Test files: `*.spec.ts`
   - Page objects: `*Page.ts`
   - Use descriptive test names and proper tagging

4. **Add appropriate test tags:**
   ```typescript
   test('Should login successfully @smoke @auth', async ({ loginPage }) => {
     // Test implementation
   });
   ```

5. **Update documentation** for new features
6. **Submit pull request** with clear description

## 📝 Best Practices

### Test Design
- Use Page Object Model for maintainability
- Implement proper wait strategies
- Create reusable test data with Faker.js
- Follow AAA pattern (Arrange, Act, Assert)

### Code Organization
- Keep tests independent and atomic
- Use meaningful test descriptions
- Implement proper cleanup in test teardown
- Maintain consistent naming conventions

### Maintenance
- Regularly update selectors for UI changes
- Keep test data generators up to date
- Monitor test execution times
- Review and update browser compatibility

## 🔗 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Allure Framework](https://docs.qameta.io/allure/)
- [OrangeHRM Demo Site](https://opensource-demo.orangehrmlive.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Faker.js Documentation](https://fakerjs.dev/)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For questions and support:
- Create an issue in the GitHub repository
- Review existing documentation and examples
- Check the troubleshooting section above

---

**Happy Testing! 🎭**