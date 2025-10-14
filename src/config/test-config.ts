export interface UserCredentials {
  username: string;
  password: string;
  role: 'Admin' | 'ESS' | 'Manager';
  fullName?: string;
}

export const TEST_USERS: { [key: string]: UserCredentials } = {
  admin: {
    username: 'Admin',
    password: 'admin123',
    role: 'Admin',
    fullName: 'OrangeHRM Admin'
  },
  // Note: In the demo environment, only Admin user is available
  // ESS and Manager users would be available in a full OrangeHRM installation
  ess: {
    username: 'Admin', // Using Admin for demo purposes
    password: 'admin123',
    role: 'ESS',
    fullName: 'ESS User (Demo)'
  },
  manager: {
    username: 'Admin', // Using Admin for demo purposes
    password: 'admin123',
    role: 'Manager',
    fullName: 'Manager User (Demo)'
  }
};

export const TEST_CONFIG = {
  baseURL: 'https://opensource-demo.orangehrmlive.com/',
  timeout: {
    default: 30000,
    navigation: 30000,
    assertion: 10000
  },
  screenshots: {
    mode: 'only-on-failure'
  },
  video: {
    mode: 'retain-on-failure'
  }
};