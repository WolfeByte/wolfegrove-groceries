// ProfilePage.js
import React, { useState, useEffect } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import DebugTokenComponent from './DebugTokenComponent';
import EnhancedLoyaltyCard from './EnhancedLoyaltyCard';
import GraphService from './GraphService';


const ProfilePage = () => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  const userContext = useUser();
  
  const [userInfo, setUserInfo] = useState({
    displayName: '',
    email: '',
    firstName: '',
    lastName: '',
    country: '',
    city: '',
    postalCode: ''
  });
  const [loading, setLoading] = useState(true);
  const [updateStatus, setUpdateStatus] = useState({ type: '', message: '' });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (isAuthenticated && accounts.length > 0) {
        try {
          // Get basic account info from MSAL
          const currentAccount = accounts[0];
          const idTokenClaims = currentAccount.idTokenClaims || {};
          
          // Create a proper display name from the claims
          const firstName = idTokenClaims.given_name || '';
          const lastName = idTokenClaims.family_name || '';
          const fullName = (firstName || lastName) ? 
                          `${firstName} ${lastName}`.trim() : 
                          idTokenClaims.email || 'WolfeGrove Customer';
          
          setUserInfo(prevUserInfo => ({
            ...prevUserInfo,
            displayName: fullName,
            email: idTokenClaims.email || currentAccount.username || '',
            firstName: firstName,
            lastName: lastName
          }));
          
          // Try to get additional user data from Graph API if we have the right permissions
          try {
            // Use GraphService to acquire token
            const tokenResponse = await GraphService.acquireToken(
              instance,
              currentAccount,
              ["User.Read"],
              true // silent acquisition
            );
            
            // Use GraphService to get user details
            const userData = await GraphService.getUserDetails(tokenResponse.accessToken);
            
            // Update with more complete user data if available
            setUserInfo(prevUserInfo => ({
              ...prevUserInfo,
              displayName: userData.displayName || prevUserInfo.displayName,
              firstName: userData.givenName || prevUserInfo.firstName,
              lastName: userData.surname || prevUserInfo.lastName,
              country: userData.country || prevUserInfo.country,
              city: userData.city || prevUserInfo.city,
              postalCode: userData.postalCode || prevUserInfo.postalCode
            }));
            
          } catch (graphError) {
            console.log("Could not fetch additional user details from Graph API:", graphError);
            // This is expected if the app doesn't have User.Read permission
          }
          
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        // Redirect to home if not authenticated
        navigate('/');
      }
      setLoading(false);
    };

    fetchUserDetails();
  }, [isAuthenticated, accounts, instance, navigate]);

  // Use data from userContext if available, otherwise use local state
  const displayData = userContext && !userContext.isLoading ? userContext : userInfo;

  const handleSaveProfile = async () => {
    setIsUpdating(true);
    setUpdateStatus({ type: '', message: '' });
    
    try {
      // Get token with User.ReadWrite permission using our service
      let tokenResponse;
      try {
        tokenResponse = await GraphService.acquireToken(
          instance, 
          accounts[0], 
          ['User.ReadWrite'], 
          true // Try silent first
        );
      } catch (silentError) {
        // If silent acquisition fails, try popup
        try {
          tokenResponse = await GraphService.acquireToken(
            instance, 
            accounts[0], 
            ['User.ReadWrite'], 
            false // Use popup
          );
        } catch (popupError) {
          throw new Error("Could not acquire necessary permissions. Please ensure your account has access to edit user information.");
        }
      }
      
      // Prepare user data for update
      const userUpdateData = {
        displayName: userInfo.displayName,
        givenName: userInfo.firstName,
        surname: userInfo.lastName,
        country: userInfo.country,
        city: userInfo.city,
        postalCode: userInfo.postalCode
      };
      
      // Use GraphService to update the profile
      await GraphService.updateUserProfile(tokenResponse.accessToken, userUpdateData);
      
      setUpdateStatus({ 
        type: 'success', 
        message: "Profile updated successfully!" 
      });
      
    } catch (error) {
      console.error("Profile update error:", error);
      setUpdateStatus({ 
        type: 'error', 
        message: error.message || "An error occurred while updating your profile."
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }
    
    setIsUpdating(true);
    
    try {
      // Get token with Directory.ReadWrite.All permission
      let tokenResponse;
      try {
        tokenResponse = await GraphService.acquireToken(
          instance, 
          accounts[0], 
          ['Directory.ReadWrite.All'], 
          true // Try silent first
        );
      } catch (silentError) {
        // If silent acquisition fails, try popup
        try {
          tokenResponse = await GraphService.acquireToken(
            instance, 
            accounts[0], 
            ['Directory.ReadWrite.All'], 
            false // Use popup
          );
        } catch (popupError) {
          throw new Error("Could not acquire necessary permissions. Please ensure your account has admin access to delete user accounts.");
        }
      }
      
      // Get user object ID
      const currentUserId = accounts[0].idTokenClaims.oid || accounts[0].localAccountId;
      
      if (!currentUserId) {
        throw new Error("Could not determine your user ID");
      }
      
      // Use GraphService to delete the account
      await GraphService.deleteUserAccount(tokenResponse.accessToken, currentUserId);
      
      // Successfully deleted the account, now log out
      instance.logoutRedirect();
      
    } catch (error) {
      console.error("Account deletion error:", error);
      setUpdateStatus({ 
        type: 'error', 
        message: error.message || "An error occurred while trying to delete your account."
      });
      setIsUpdating(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading profile information...</div>;
  }

  const formatDate = () => {
    const date = new Date();
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 20px' }}>
      <h1 style={{ color: '#107c10', marginBottom: '1.5rem' }}>Your WolfeGrove account</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <p>WolfeGrove Loyalty Card offers exclusive benefits, early access to new products, and personalised experiences.</p>
        
        {/* Enhanced Loyalty Card */}
        <EnhancedLoyaltyCard 
          userInfo={{
            displayName: displayData.displayName,
            id: Math.floor(100000 + Math.random() * 900000).toString(),
            tier: 'Premium',
            since: formatDate()
          }}
        />
      </div>
      
      {/* Edit Profile Section */}
      <h2 style={{ color: '#107c10', marginBottom: '1rem' }}>Edit your profile</h2>
      <div style={{ 
        backgroundColor: '#f9f9f9', 
        padding: '1.5rem', 
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        {updateStatus.message && (
          <div style={{
            padding: '10px 15px',
            borderRadius: '4px',
            marginBottom: '1rem',
            backgroundColor: updateStatus.type === 'success' ? '#e6f4ea' : '#fdeded',
            color: updateStatus.type === 'success' ? '#2e7d32' : '#d32f2f',
            border: `1px solid ${updateStatus.type === 'success' ? '#a8dab5' : '#f5c2c7'}`
          }}>
            {updateStatus.message}
          </div>
        )}
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>Display name</div>
          <input 
            type="text" 
            value={userInfo.displayName}
            onChange={(e) => setUserInfo({...userInfo, displayName: e.target.value})}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          
          <div>Given name</div>
          <input 
            type="text" 
            value={userInfo.firstName}
            onChange={(e) => setUserInfo({...userInfo, firstName: e.target.value})}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          
          <div>Surname</div>
          <input 
            type="text" 
            value={userInfo.lastName}
            onChange={(e) => setUserInfo({...userInfo, lastName: e.target.value})}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          
          <div>Country</div>
          <input 
            type="text" 
            value={userInfo.country}
            onChange={(e) => setUserInfo({...userInfo, country: e.target.value})}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          
          <div>City</div>
          <input 
            type="text" 
            value={userInfo.city}
            onChange={(e) => setUserInfo({...userInfo, city: e.target.value})}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          
          <div>Postal code</div>
          <input 
            type="text" 
            value={userInfo.postalCode}
            onChange={(e) => setUserInfo({...userInfo, postalCode: e.target.value})}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button 
            onClick={handleSaveProfile}
            disabled={isUpdating}
            style={{
              backgroundColor: '#107c10',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '0.5rem 1rem',
              cursor: isUpdating ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              opacity: isUpdating ? 0.7 : 1
            }}
          >
            <span>✓</span> {isUpdating ? 'Updating...' : 'Edit your profile'}
          </button>
          
          <button 
            onClick={handleDeleteAccount}
            disabled={isUpdating}
            style={{
              backgroundColor: '#d32f2f',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '0.5rem 1rem',
              cursor: isUpdating ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              opacity: isUpdating ? 0.7 : 1
            }}
          >
            <span>✕</span> {isUpdating ? 'Processing...' : 'Delete your account'}
          </button>
        </div>
      </div>
      
      {/* Sign-In Information */}
      <h2 style={{ color: '#107c10', marginBottom: '1rem' }}>Sign-in information</h2>
      <div style={{ 
        backgroundColor: '#f9f9f9', 
        padding: '1.5rem', 
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
          <div>Email</div>
          <input 
            type="email" 
            value={displayData.email}
            readOnly
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd', backgroundColor: '#f0f0f0' }}
          />
        </div>
        
        <button 
          style={{
            backgroundColor: '#107c10',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            marginTop: '1.5rem'
          }}
          onClick={() => alert("Email changes must be processed through your identity provider.")}
        >
          Edit
        </button>
      </div>
      
      {/* Account Activity Section */}
      <h2 style={{ color: '#107c10', marginBottom: '1rem' }}>Sign-in activity</h2>
      <div style={{ 
        backgroundColor: '#f9f9f9', 
        padding: '1.5rem', 
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <p>Your last sign-in date and time: {new Date().toLocaleString()}</p>
      </div>
      
      {/* Token Debug moved to the bottom */}
      <DebugTokenComponent />
    </div>
  );
};

export default ProfilePage;