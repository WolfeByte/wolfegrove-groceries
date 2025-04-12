# WolfeGrove Groceries

A React application for WolfeGrove Groceries with Azure Entra External ID authentication.

## Local Development

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

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

This project is configured for deployment to Azure Web App via GitHub Actions.

### Prerequisites

1. An Azure subscription
2. An Azure Web App named "wolfegrove" created in the Azure portal
3. A GitHub secret named `AZURE_WEBAPP_PUBLISH_PROFILE` containing the publish profile from your Azure Web App

### Deployment Process

1. Push changes to the `master` branch
2. GitHub Actions workflow will automatically:
   - Build the React application
   - Deploy the build to Azure Web App

### Manual Deployment

You can also deploy manually using Azure CLI:

```bash
# Build the app
npm run build

# Create the ZIP file (PowerShell)
Compress-Archive -Path .\build\* -DestinationPath .\build.zip -Force

# Alternative using Windows command prompt
cd build
tar -acf ..\build.zip *
cd ..

# Deploy to Azure
az webapp deployment source config-zip --resource-group WolfeGroveRG --name wolfegrove --src ./build.zip
```

## Authentication

This app uses Azure Entra External ID for authentication. The configuration is defined in `src/App.js` and uses the following environment variables:

- REACT_APP_CLIENT_ID
- REACT_APP_AUTHORITY
- REACT_APP_REDIRECT_URI

For local development, these variables will fall back to the hardcoded values if not defined.
