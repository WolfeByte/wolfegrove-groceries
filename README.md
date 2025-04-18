# WolfeGrove Groceries

A React application that you can deploy as an Azure Static Web App for quickly demonstrating Entra External ID authentication, user flows, with user profile management capabilities.

### Home Page
![WolfeGrove Groceries Homepage](https://github.com/user-attachments/assets/69ea36ef-940f-46c1-9177-4e6108695ce6)

### Profile Page
![WolfeGrove Groceries Profile Page](https://github.com/user-attachments/assets/b1b27018-70e9-47d8-9ee8-0afe773829e2)

## Application Overview

WolfeGrove Groceries is a demo grocery e-commerce platform that showcases:

- React based application
- Authentication with Entra External ID
- User profile management
- Integration with Microsoft Graph API

### Key Features

- **User Authentication**: Sign-up, Sign in/out with Entra External ID
- **User Profile Management**: View and edit profile information
- **Profile Editing**: Update user details like name, city, country, etc.
- **Account Management**: Request account deletion (using Microsoft Graph API)
- **Loyalty Programme**: Display a virtual loyalty card for members

### Technologies Used

- MSAL (Microsoft Authentication Library) for authentication
- Microsoft Graph API for user management
- Azure Static Web Apps for hosting

## Installation

```powershell
# Clone the repository
git clone https://github.com/yourusername/wolfegrove-groceries.git
cd wolfegrove-groceries

# Install dependencies
npm install

# Start the development server
npm start
```
In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

#### `npm run build`

Builds the app for production to the `build` folder.

## Authentication Configuration

### Prerequisites

1. Access to an Entra External ID tenant
2. An app registration in the Entra External ID tenant

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```
REACT_APP_CLIENT_ID=your-client-id (The "Application (client) ID" of the App Registration in Entra)
REACT_APP_AUTHORITY=your-tenant-url (e.g. https://domain.ciamlogin.com/a317c4e7-52ab-4f8e-91fc-7b9389f8c1d2)
REACT_APP_REDIRECT_URI=https://yourapp.staticwebapps.net
```
Alternatively, the app will use the default values in `App.js` if these variables are not defined.

### Setting up the App in the Entra External ID tenant

1. Create an app registration in Entra External ID
2. Configure the following:
   - Redirect URIs: Add both local and production URLs:
     - `https://localhost:3000`
     - `https://yourapp.azurestaticapps.net`
   - API permissions:
     - Microsoft Graph: User.ReadWrite (delegated)
   - Authentication: Enable access tokens and ID tokens

### Required Permissions for Feature Functionality

- **Basic profile viewing**: User.Read
- **Profile editing**: User.ReadWrite
- **Account deletion request**: User.ReadWriteAll

## Azure Deployment

### Deploying to Azure Static Web Apps

Azure Static Web Apps provides an easy way to deploy and host React applications with built-in CI/CD via GitHub Actions.

#### Prerequisites

1. An Azure subscription
2. A GitHub repository with your code
3. Azure CLI installed (optional, for creating resources via command line)

#### Setup Steps

1. **Create a Static Web App resource in Azure**
   
   Using Azure Portal:
   - Go to the Azure Portal
   - Click "Create a resource"
   - Search for "Static Web App" and select it
   - Click "Create"
   - Fill in the required details:
     - Resource Group: Create new or select existing
     - Name: "wolfegrove-static" (or your preferred name)
     - Region: Select the closest region to your users
     - SKU: Free or Standard based on your needs

2. **Connect to GitHub**

   Either during creation or afterwards:
   - Source: GitHub
   - Organisation: Your GitHub organisation or username
   - Repository: Your repository name
   - Branch: main (or your default branch)
   
   This will create a GitHub Actions workflow file in your repository and add a deployment token secret automatically.

3. **Configure build settings**
   - App location: `/`
   - API location: Leave empty (unless you're adding an API)
   - Output location: `build`

### Alternative: Manual Deployment to Azure Static Web App

You can also create and deploy the app manually to an Azure Static Web App:

```powershell
# Login to Azure
az login
   
# Create resource group if needed
az group create --name YourResourceGroup --location australiaeast
   
# Create static web app (basic workflow)
az staticwebapp create --name "wolfegrove-static" --resource-group YourResourceGroup --location "australiaeast" --sku Fre

# Build the app
npm run build

# Deploy to Azure
az staticwebapp deploy --source-location .\build --app-location .\build --api-location "" --name "wolfegrove-static" --resource-group YourResourceGroup
```

## Customising the Application

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
  ```
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
