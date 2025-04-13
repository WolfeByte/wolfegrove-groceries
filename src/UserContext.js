// UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';

// Create the context
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const { accounts } = useMsal(); // Removed 'instance' as it's not being used
  const isAuthenticated = useIsAuthenticated();
  const [userInfo, setUserInfo] = useState({
    displayName: '',
    email: '',
    firstName: '',
    lastName: '',
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    const getUserInfo = async () => {
      if (isAuthenticated && accounts.length > 0) {
        const currentAccount = accounts[0];
        const idTokenClaims = currentAccount.idTokenClaims || {};
        
        const firstName = idTokenClaims.given_name || '';
        const lastName = idTokenClaims.family_name || '';
        const fullName = (firstName || lastName) ? 
                         `${firstName} ${lastName}`.trim() : 
                         idTokenClaims.email || 'WolfeGrove Customer';
        
        setUserInfo({
          displayName: fullName,
          email: idTokenClaims.email || currentAccount.username || '',
          firstName: firstName,
          lastName: lastName,
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        setUserInfo({
          displayName: '',
          email: '',
          firstName: '',
          lastName: '',
          isAuthenticated: false,
          isLoading: false
        });
      }
    };

    getUserInfo();
  }, [isAuthenticated, accounts]);

  return (
    <UserContext.Provider value={userInfo}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);