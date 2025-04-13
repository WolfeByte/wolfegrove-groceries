// GraphService.js
// This utility helps with Microsoft Graph API operations

class GraphService {
    /**
     * Get user details from Microsoft Graph API
     * @param {string} accessToken - The access token for Graph API
     * @returns {Promise<Object>} - User profile data
     */
    static async getUserDetails(accessToken) {
      try {
        const response = await fetch('https://graph.microsoft.com/v1.0/me', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to fetch user details');
        }
        
        return await response.json();
      } catch (error) {
        console.error('GraphService - getUserDetails error:', error);
        throw error;
      }
    }
    
    /**
     * Update user profile in Microsoft Graph API
     * @param {string} accessToken - The access token for Graph API
     * @param {Object} userData - User data to update
     * @returns {Promise<Object>} - API response
     */
    static async updateUserProfile(accessToken, userData) {
      try {
        const response = await fetch('https://graph.microsoft.com/v1.0/me', {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to update user profile');
        }
        
        return { success: true, message: 'Profile updated successfully' };
      } catch (error) {
        console.error('GraphService - updateUserProfile error:', error);
        throw error;
      }
    }
    
    /**
     * Delete a user account via Microsoft Graph API
     * @param {string} accessToken - The access token for Graph API
     * @param {string} userId - The ID of the user to delete
     * @returns {Promise<Object>} - API response
     */
    static async deleteUserAccount(accessToken, userId) {
      try {
        const response = await fetch(`https://graph.microsoft.com/v1.0/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        if (!response.ok) {
          // For DELETE operations, the response might not contain JSON
          if (response.status === 204) {
            return { success: true, message: 'Account deleted successfully' };
          }
          
          try {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `Failed to delete account (${response.status})`);
          } catch (jsonError) {
            throw new Error(`Failed to delete account: HTTP ${response.status}`);
          }
        }
        
        return { success: true, message: 'Account deleted successfully' };
      } catch (error) {
        console.error('GraphService - deleteUserAccount error:', error);
        throw error;
      }
    }
    
    /**
     * Helper method to acquire tokens with specific scopes
     * @param {Object} msalInstance - The MSAL instance
     * @param {Object} account - The user account
     * @param {Array<string>} scopes - The requested scopes
     * @param {boolean} silent - Whether to attempt silent token acquisition
     * @returns {Promise<Object>} - The token response
     */
    static async acquireToken(msalInstance, account, scopes, silent = true) {
      try {
        let tokenResponse;
        
        if (silent) {
          tokenResponse = await msalInstance.acquireTokenSilent({
            scopes,
            account
          });
        } else {
          tokenResponse = await msalInstance.acquireTokenPopup({
            scopes,
            account
          });
        }
        
        return tokenResponse;
      } catch (error) {
        console.error('Token acquisition error:', error);
        throw error;
      }
    }
  }
  
  export default GraphService;