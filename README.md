## Customizing the Application

If you've cloned this repository and want to rebrand it from "WolfeGrove Groceries" to your own company name, follow these steps:

### 1. Update Application Name References

**In App.js:**
- Look for the `Header` component (around line 100-150) and change:
  ```javascript
  <span style={{ fontWeight: '600', color: '#333', fontSize: '16px' }}>WolfeGrove Groceries</span>
  ```
  to your company name

- Update the brand color variables if desired (in the `AppContent` component, around line 270-280):
  ```javascript
  document.documentElement.style.setProperty('--color-light', '#267A02');
  document.documentElement.style.setProperty('--color-very-light', 'rgb(5, 166, 2)');
  document.documentElement.style.setProperty('--color-dark', '#107c10');
  document.documentElement.style.setProperty('--color-very-dark', '#164601');
  ```

**In ProfilePage.js:**
- Change the main heading:
  ```javascript
  <h1 style={{ color: '#107c10', marginBottom: '1.5rem' }}>Your WolfeGrove account</h1>
  ```

- Update the fallback name in `fetchUserDetails` function:
  ```javascript
  idTokenClaims.email || 'WolfeGrove Customer';
  ```

**In EnhancedLoyaltyCard.js:**
- Update the loyalty card title:
  ```javascript
  WolfeGrove Loyalty Card
  ```

- Update the card footer:
  ```javascript
  Valid at all WolfeGrove locations
  ```

### 2. Update Authentication Configuration

**In App.js:**
- Update the MSAL configuration with your Entra External ID details (around line 10-15):
  ```javascript
  const msalConfig = {
    auth: {
      clientId: process.env.REACT_APP_CLIENT_ID || 'your-client-id',
      authority: process.env.REACT_APP_AUTHORITY || 'your-authority-url',
      redirectUri: process.env.REACT_APP_REDIRECT_URI || window.location.origin,
      postLogoutRedirectUri: window.location.origin,
    },
    cache: {
      cacheLocation: 'sessionStorage',
      storeAuthStateInCookie: false,
    },
  };
  ```

### 3. Update Images and Products

**In App.js:**
- Replace the sample product data (around line 20-30) with your own products
- Update image URLs to point to your own product images

### 4. Update Text Content

**In App.js:**
- Update the welcome message in `HeroSection` component
- Update the statistics in `StatsSection` component
- Update the product section heading in `ProductsSection` component

**In Footer.js:**
- Update the copyright information:
  ```javascript
  &copy; 2025 WolfeGrove Groceries. All rights reserved.
  ```# WolfeGrove Groceries

A React application for WolfeGrove Groceries demonstrating Azure Entra External ID authentication with user profile management capabilities.

## Application Overview

WolfeGrove Groceries is a demo grocery e-commerce platform that showcases:

- Authentication with Azure Entra External ID
- User profile management
- Integration with Microsoft Graph API
- Responsive UI design

### Key Features

- **User Authentication**: Sign in/out with Azure Entra External ID
- **User Profile Management**: View and edit profile information
- **Profile Editing**: Update user details like name, city, country, etc.
- **Account Management**: Request account deletion (using Microsoft Graph API)
- **Loyalty Program**: Display a virtual loyalty card for members
- **Product Browsing**: View sample grocery products

### Technologies Used

- React (Create React App)
- React Router for navigation
- MSAL (Microsoft Authentication Library) for authentication
- Microsoft Graph API for user management
- Azure Static Web Apps for hosting

## Local Development

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Prerequisites

1. Node.js (v14+)
2. npm 
3. PowerShell
4. Access to an Azure Entra External ID tenant
5. An app registration in Azure Entra External ID

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```
REACT_APP_CLIENT_ID=your-client-id
REACT_APP_AUTHORITY=your-authority-url
REACT_APP_REDIRECT_URI=http://localhost:3000
```

Alternatively, the app will use the default values in `App.js` if these variables are not defined.

### Installation

```powershell
# Clone the repository
git clone https://github.com/yourusername/wolfegrove-groceries.git
cd wolfegrove-groceries

# Install dependencies
npm install

# Start the development server
npm start
```

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

#### `npm test`

Launches the test runner in the interactive watch mode.

#### `npm run build`

Builds the app for production to the `build` folder.

## Azure Deployment

### Deploying to Azure Static Web Apps

Azure Static Web Apps provides an easy way to deploy and host React applications with built-in CI/CD via GitHub Actions.

#### Prerequisites

1. An Azure subscription
2. A GitHub repository with your code
3. Azure CLI installed (optional, for creating resources via command line)

#### Setup Steps

1. **Create a Static Web App resource in Azure:**
   - Go to the Azure Portal
   - Click "Create a resource"
   - Search for "Static Web App" and select it
   - Click "Create"
   - Fill in the required details:
     - Subscription: Your Azure subscription
     - Resource Group: Create new or select existing
     - Name: "wolfegrove-static" (or your preferred name)
     - Region: Select the closest region to your users
     - SKU: Free or Standard based on your needs
     - Source: GitHub
     - Organization: Your GitHub organization or username
     - Repository: Your repository name
     - Branch: main (or your default branch)
   - Click "Review + create" and then "Create"

2. **Configure build settings:**
   - During setup, you'll be prompted for build configuration
   - Set the following values:
     - App location: `/`
     - API location: Leave empty (unless you're adding an API)
     - Output location: `build`

3. **The deployment workflow file will be automatically added to your repository**

#### GitHub Actions Workflow

The deployment process is handled by GitHub Actions. The workflow file should look similar to this:

```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v2
        with:
          submodules: true
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_ORANGE_STONE_027266400 }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          app_location: "/" 
          api_location: ""
          output_location: "build"
        env:
          REACT_APP_CLIENT_ID: ${{ secrets.REACT_APP_CLIENT_ID }}
          REACT_APP_AUTHORITY: ${{ secrets.REACT_APP_AUTHORITY }}
          REACT_APP_REDIRECT_URI: ${{ secrets.REACT_APP_REDIRECT_URI }}

  close_pull_request_job:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    name: Close Pull Request Job
    steps:
      - name: Close Pull Request
        id: closepullrequest
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: "close"
```

#### Setting up GitHub Secrets

When you create an Azure Static Web App and connect it to GitHub, it automatically creates a repository secret with a name like `AZURE_STATIC_WEB_APPS_API_TOKEN_ORANGE_STONE_027266400` (your specific name may differ). This secret contains the deployment token and is used by the GitHub Actions workflow.

For your application to work correctly, you also need to add the following secrets to your GitHub repository:

1. `REACT_APP_CLIENT_ID`: Your Entra External ID app registration client ID
2. `REACT_APP_AUTHORITY`: Your Entra External ID authority URL
3. `REACT_APP_REDIRECT_URI`: Your production redirect URI

To add these secrets:
- Go to your GitHub repository
- Click on "Settings" > "Secrets and variables" > "Actions"
- Click "New repository secret" and add each secret

### Alternative: Manual Deployment to Azure Web App

You can also deploy manually to an Azure Web App:

```powershell
# Build the app
npm run build

# Create the ZIP file
Compress-Archive -Path .\build\* -DestinationPath .\build.zip -Force

# Deploy to Azure
az webapp deployment source config-zip --resource-group WolfeGroveRG --name wolfegrove --src ./build.zip
```

## Authentication Configuration

### Azure Entra External ID Setup

1. Create an app registration in Entra External ID
2. Configure the following:
   - Redirect URIs: Add both local and production URLs
   - API permissions: 
     - Microsoft Graph: User.Read (delegated)
     - Microsoft Graph: User.ReadWrite (delegated)
   - Authentication: Enable access tokens and ID tokens
   - Expose an API: Configure if needed

### Required Permissions for Feature Functionality

- **Basic profile viewing**: User.Read
- **Profile editing**: User.ReadWrite
- **Account deletion request**: User.ReadWrite

## Troubleshooting

### Common Issues

1. **Authentication Errors**:
   - Verify your app registration settings in Entra External ID
   - Check that redirect URIs match exactly (including trailing slashes)
   - Ensure you've granted consent to required permissions

2. **Build Failures**:
   - Check for ESLint errors before deployment
   - Verify all dependencies are correctly installed

3. **API Permission Issues**:
   - For admin-level operations, ensure proper admin consent is granted
   - Check browser console for detailed API error messages

### Support

For issues, please open a GitHub issue in the repository.