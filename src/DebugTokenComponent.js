// DebugTokenComponent.js
import React, { useEffect, useState } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';

const DebugTokenComponent = () => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [tokenData, setTokenData] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
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
      backgroundColor: '#e2f0d9', 
      borderRadius: '8px',
      margin: '20px 0',
      overflow: 'hidden',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      transition: 'box-shadow 0.2s'
    }}>
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ 
          padding: '15px 20px', 
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: isExpanded ? '1px solid #cce4cc' : 'none'
        }}
      >
        <h3 style={{ 
          margin: 0, 
          color: 'var(--color-dark)',
          fontWeight: '600',
          fontSize: '1.1rem'
        }}>
          Token Debug Information
        </h3>
        <span style={{
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease',
          fontSize: '0.8rem'
        }}>▼</span>
      </div>
      
      {isExpanded && (
        <div style={{ padding: '20px' }}>
          {tokenData.message && (
            <div style={{ color: 'blue' }}>{tokenData.message}</div>
          )}
          
          {tokenData.error && (
            <div style={{ color: 'red' }}>Error: {tokenData.error}</div>
          )}
          
          {tokenData.account && (
            <div>
              <h4 style={{ color: 'var(--color-dark)', marginTop: 0 }}>Account Info</h4>
              <pre style={{ 
                backgroundColor: '#f5f5f5', 
                padding: '15px', 
                overflow: 'auto',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}>
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
              
              <h4 style={{ color: 'var(--color-dark)' }}>Token Info</h4>
              <pre style={{ 
                backgroundColor: '#f5f5f5', 
                padding: '15px', 
                overflow: 'auto',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}>
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
      )}
    </div>
  );
};

export default DebugTokenComponent;