// DebugTokenComponent.js
import React, { useEffect, useState } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';

const DebugTokenComponent = () => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [tokenData, setTokenData] = useState(null);
  
  useEffect(() => {
    const analyzeToken = async () => {
      if (!isAuthenticated || accounts.length === 0) {
        setTokenData({ message: "Not authenticated" });
        return;
      }
      
      try {
        const currentAccount = accounts[0];
        
        // Get silent token to force a refresh if needed
        const response = await instance.acquireTokenSilent({
          scopes: ["openid", "profile", "email", "User.Read"],
          account: currentAccount
        });
        
        // Extract and display token info
        const tokenInfo = {
          account: currentAccount,
          idTokenClaims: currentAccount.idTokenClaims,
          accessToken: response.accessToken ? "Present (not shown for security)" : "Not present",
          tokenType: response.tokenType,
          scopes: response.scopes,
          expiresOn: response.expiresOn
        };
        
        setTokenData(tokenInfo);
      } catch (error) {
        setTokenData({ error: error.message || "Failed to analyze token" });
        console.error("Token debug error:", error);
      }
    };
    
    analyzeToken();
  }, [isAuthenticated, accounts, instance]);
  
  if (!tokenData) {
    return <div>Loading token data...</div>;
  }
  
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f5f5f5', 
      borderRadius: '8px',
      margin: '20px 0'
    }}>
      <h3>Token Debug Information</h3>
      
      {tokenData.message && (
        <div style={{ color: 'blue' }}>{tokenData.message}</div>
      )}
      
      {tokenData.error && (
        <div style={{ color: 'red' }}>Error: {tokenData.error}</div>
      )}
      
      {tokenData.account && (
        <div>
          <h4>Account Info</h4>
          <pre style={{ backgroundColor: '#eee', padding: '10px', overflow: 'auto' }}>
            {JSON.stringify({
              homeAccountId: tokenData.account.homeAccountId,
              environment: tokenData.account.environment,
              tenantId: tokenData.account.tenantId,
              username: tokenData.account.username,
              localAccountId: tokenData.account.localAccountId,
              name: tokenData.account.name,
              idTokenClaims: tokenData.idTokenClaims
            }, null, 2)}
          </pre>
          
          <h4>Token Info</h4>
          <pre style={{ backgroundColor: '#eee', padding: '10px', overflow: 'auto' }}>
            {JSON.stringify({
              accessToken: tokenData.accessToken,
              tokenType: tokenData.tokenType,
              scopes: tokenData.scopes,
              expiresOn: tokenData.expiresOn
            }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default DebugTokenComponent;