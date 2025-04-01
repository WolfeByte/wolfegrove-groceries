// App.js with routing support
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider, useIsAuthenticated, useMsal } from '@azure/msal-react';
import ProfilePage from './ProfilePage';

// MSAL configuration with WolfeGrove Entra External ID details
const msalConfig = {
  auth: {
    clientId: '20415ce1-ff99-4cf8-aed5-fcd68d564c68',
    authority: 'https://thewolfecustomers.ciamlogin.com/59412b59-edbf-45a5-a879-2e18220a9d7f',
    redirectUri: 'wolfegrove.azurewebsites.net',
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

// Initialize MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// Sample product data - using Woodgrove demo images directly
const products = [
  { id: 1, name: 'Dark purple grapes', weight: '1.5 kg', price: '$11.25', image: 'https://woodgrovedemo.com/images/Products/grapes.jpg' },
  { id: 2, name: 'Organic sweet tomato', weight: '1 kg', price: '$2.75', image: 'https://woodgrovedemo.com/images/Products/tomatoes.jpg' },
  { id: 3, name: 'French bread', weight: '400 g', price: '$13.0', image: 'https://woodgrovedemo.com/images/Products/bread.jpg' },
  { id: 4, name: 'Organic eggs', weight: '12 count', price: '$34.0', image: 'https://woodgrovedemo.com/images/Products/eggs.jpg' },
  { id: 5, name: 'Sweet corn', weight: '1 count', price: '$5.25', image: 'https://woodgrovedemo.com/images/Products/corn.jpg' },
  { id: 6, name: 'Watermelon', weight: '1 count', price: '$12.5', image: 'https://woodgrovedemo.com/images/Products/watermelon.jpg' },
  { id: 7, name: 'Organic sugar', weight: '2 pack', price: '$7.0', image: 'https://woodgrovedemo.com/images/Products/sugar.png' },
  { id: 8, name: 'Oranges', weight: '1 kg', price: '$4.0', image: 'https://woodgrovedemo.com/images/Products/oranges.png' },
];

// Login button component that shows profile link when logged in
const LoginButton = () => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();

  const handleLogin = () => {
    instance.loginRedirect({
      scopes: ['User.Read'], // Add required scopes for your application
    });
  };

  const handleLogout = () => {
    instance.logoutRedirect();
  };

  const goToProfile = () => {
    navigate('/profile');
  };

  if (isAuthenticated && accounts.length > 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span 
          onClick={goToProfile}
          style={{ 
            color: 'black', 
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}
        >
          Hello, {accounts[0].name?.split(' ')[0] || 'User'}
        </span>
        <button 
          style={{
            backgroundColor: 'var(--color-dark)',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            padding: '5px 25px',
            cursor: 'pointer'
          }}
          onClick={handleLogout}
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button 
      style={{
        backgroundColor: 'var(--color-dark)',
        color: 'white',
        border: 'none',
        borderRadius: '20px',
        padding: '5px 25px',
        cursor: 'pointer'
      }}
      onClick={handleLogin}
    >
      Sign in
    </button>
  );
};

// Header component
const Header = () => {
  return (
    <div style={{ 
      backgroundColor: 'var(--color-dark)', 
      padding: '10px 0',
      position: 'relative'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 20px'
      }}>
        <div style={{
          backgroundColor: '#e2f0d9',
          borderRadius: '30px',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          width: '85%',
          justifyContent: 'space-between'
        }}>
          <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ position: 'relative', width: '30px', height: '30px' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: '#ffb900',
                  transform: 'rotate(45deg)',
                  position: 'absolute',
                  top: '5px',
                  left: '0'
                }}></div>
                <div style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: 'var(--color-dark)',
                  transform: 'rotate(45deg)',
                  position: 'absolute',
                  top: '5px',
                  left: '10px',
                  opacity: '0.9'
                }}></div>
              </div>
              <span style={{ fontWeight: '600', color: '#333', fontSize: '16px' }}>WolfeGrove Groceries</span>
            </div>
          </a>
          
          <LoginButton />
        </div>
      </div>
    </div>
  );
};

// Hero section component
const HeroSection = () => {
  return (
    <section style={{ 
      backgroundColor: 'var(--color-dark)',
      color: 'white',
      padding: '30px 0 100px'
    }}>
      <div style={{ 
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        justifyContent: 'center'
      }}>
        <div style={{ 
          display: 'flex',
          alignItems: 'flex-start',
          gap: '40px'
        }}>
          <div style={{
            width: '150px',
            flexShrink: 0
          }}>
            <img
              src="https://woodgrovedemo.com/images/Shopping/Shopping_07.png" 
              alt="Customer shopping"
              style={{ 
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                border: '2px solid white',
                objectFit: 'cover',
                boxShadow: 'none',
                outline: 'none'
              }}
            />
          </div>
          <div style={{ 
            textAlign: 'left',
            maxWidth: '700px'
          }}>
            <h1 style={{ 
              fontSize: '2rem',
              fontWeight: '600',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              Welcome to WolfeGrove Groceries demo
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
};

// Statistics section component
const StatsSection = () => {
  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '-80px auto 0',
      padding: '0 20px',
      position: 'relative',
      zIndex: 10
    }}>
      <section style={{
        backgroundColor: '#e2f0d9',
        borderRadius: '10px',
        padding: '30px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
      }}>
        <div style={{ 
          flex: '1',
          minWidth: '300px',
          padding: '0 20px',
          textAlign: 'center',
          borderRight: '1px solid #cce4cc'
        }}>
          <div style={{ 
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: 'var(--color-dark)',
            marginBottom: '0.5rem' 
          }}>1350+</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem' }}>Stores</h3>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
            With more than 1,350 local stores and 80 distribution
          </p>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
            centers, it's easier than ever to shop online and buy locally.
          </p>
        </div>
        
        <div style={{ 
          flex: '1',
          minWidth: '300px',
          padding: '0 20px',
          textAlign: 'center',
          borderRight: '1px solid #cce4cc'
        }}>
          <div style={{ 
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: 'var(--color-dark)',
            marginBottom: '0.5rem' 
          }}>7500+</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem' }}>Products</h3>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
            We offer a variety of products, top-quality fresh and
          </p>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
            healthy foods. Friendly to your wallet and a dynamic shopping experience.
          </p>
        </div>
        
        <div style={{ 
          flex: '1',
          minWidth: '300px',
          padding: '0 20px',
          textAlign: 'center'
        }}>
          <div style={{ 
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: 'var(--color-dark)',
            marginBottom: '0.5rem' 
          }}>3200+</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem' }}>Employees</h3>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
            WolfeGrove is committed to build a diverse workforce
          </p>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
            that reflects our core values and the communities we serve.
          </p>
        </div>
      </section>
    </div>
  );
};

// Product section component
const ProductsSection = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <section style={{ padding: '40px 0' }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '600', 
          marginBottom: '1.5rem', 
          color: '#333' 
        }}>
          Get in the groove for shopping
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          marginTop: '20px'
        }}>
          {products.map(product => (
            <div key={product.id} style={{ 
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              margin: '10px',
              maxWidth: '260px'
            }}>
              <img 
                src={product.image} 
                alt={product.name}
                style={{
                  width: '100%',
                  height: '180px',
                  objectFit: 'cover',
                  outline: 'none',
                  boxShadow: 'none'
                }}
              />
              <div style={{ padding: '15px' }}>
                <div style={{ fontWeight: '600', marginBottom: '5px' }}>{product.name}</div>
                <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '10px' }}>{product.weight}</div>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '0 15px 15px' 
              }}>
                <div style={{ fontWeight: '600', color: 'var(--color-dark)' }}>{product.price}</div>
                <button style={{
                  backgroundColor: 'transparent',
                  color: 'var(--color-dark)',
                  border: '1px solid var(--color-dark)',
                  borderRadius: '20px',
                  padding: '5px 15px',
                  cursor: 'pointer'
                }}>
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// Footer component
const Footer = () => {
  return (
    <footer style={{
      marginTop: 'auto',
      padding: '20px 0',
      backgroundColor: '#f8f9fa',
      textAlign: 'center',
      color: '#6c757d'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        &copy; 2025 WolfeGrove Groceries. All rights reserved. Built for Entra External ID testing.
      </div>
    </footer>
  );
};

// Home page component
const HomePage = () => {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ProductsSection />
    </>
  );
};

// Protected route component
const ProtectedRoute = ({ element }) => {
  const isAuthenticated = useIsAuthenticated();
  
  return isAuthenticated ? element : <Navigate to="/" />;
};

// Main App component
const AppContent = () => {
  useEffect(() => {
    // Add CSS variables to document root
    document.documentElement.style.setProperty('--color-light', '#267A02');
    document.documentElement.style.setProperty('--color-very-light', 'rgb(5, 166, 2)');
    document.documentElement.style.setProperty('--color-dark', '#107c10');
    document.documentElement.style.setProperty('--color-very-dark', '#164601');
  }, []);

  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

// Wrap the app with providers
const App = () => {
  return (
    <MsalProvider instance={msalInstance}>
      <AppContent />
    </MsalProvider>
  );
};

export default App;