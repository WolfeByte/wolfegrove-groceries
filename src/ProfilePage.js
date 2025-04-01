// ProfilePage.js
import React, { useState, useEffect } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    displayName: '',
    email: '',
    firstName: '',
    lastName: '',
    country: 'US',
    city: '',
    postalCode: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (isAuthenticated && accounts.length > 0) {
        try {
          // Get basic account info from MSAL
          const currentAccount = accounts[0];
          setUserInfo(prevUserInfo => ({
            ...prevUserInfo,
            displayName: currentAccount.name || 'WolfeGrove Customer',
            email: currentAccount.username || '',
            firstName: currentAccount.given_name || '',
            lastName: currentAccount.family_name || ''
          }));

          // You could also fetch additional user data from Microsoft Graph API
          // This would require additional scopes and token acquisition
          /*
          const response = await instance.acquireTokenSilent({
            scopes: ["User.Read"],
            account: currentAccount
          });
          
          const graphResponse = await fetch("https://graph.microsoft.com/v1.0/me", {
            headers: {
              Authorization: `Bearer ${response.accessToken}`
            }
          });
          
          const data = await graphResponse.json();
          console.log(data);
          */
          
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

  const handleSaveProfile = () => {
    // Here you would typically send the updated profile to your backend
    alert("Profile saved successfully!");
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      // Implement account deletion logic here
      instance.logout();
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
        <p>WolfeGrove Loyalty Card offers exclusive benefits, early access to new products, and personalized experiences.</p>
        
        {/* Loyalty Card */}
        <div style={{ 
          backgroundColor: '#107c10', 
          color: 'white', 
          padding: '1.5rem', 
          borderRadius: '8px',
          marginTop: '1rem',
          maxWidth: '300px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <div style={{ position: 'relative', width: '24px', height: '24px' }}>
              <div style={{
                width: '16px',
                height: '16px',
                backgroundColor: '#ffb900',
                transform: 'rotate(45deg)',
                position: 'absolute',
                top: '4px',
                left: '0'
              }}></div>
              <div style={{
                width: '16px',
                height: '16px',
                backgroundColor: '#107c10',
                transform: 'rotate(45deg)',
                position: 'absolute',
                top: '4px',
                left: '8px',
                opacity: '0.9'
              }}></div>
            </div>
            <span style={{ fontWeight: '600' }}>WolfeGrove Loyalty Card</span>
          </div>
          
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Name:</strong> {userInfo.displayName}
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>ID:</strong> {Math.floor(100000 + Math.random() * 900000)}
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Tier:</strong> Premium
          </div>
          <div>
            <strong>Since:</strong> {formatDate()}
          </div>
        </div>
      </div>
      
      {/* Edit Profile Section */}
      <h2 style={{ color: '#107c10', marginBottom: '1rem' }}>Edit your profile</h2>
      <div style={{ 
        backgroundColor: '#f9f9f9', 
        padding: '1.5rem', 
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
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
            style={{
              backgroundColor: '#107c10',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>✓</span> Edit your profile
          </button>
          
          <button 
            style={{
              backgroundColor: '#107c10',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>⟳</span> Delete your account
          </button>
          
          <button 
            onClick={handleDeleteAccount}
            style={{
              backgroundColor: '#107c10',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>✕</span> Delete your account
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
            value={userInfo.email}
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
    </div>
  );
};

export default ProfilePage;