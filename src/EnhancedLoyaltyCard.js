// EnhancedLoyaltyCard.js
import React from 'react';

const EnhancedLoyaltyCard = ({ userInfo }) => {
  const formatDate = () => {
    const date = new Date();
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  // Use the provided user info or defaults
  const displayName = userInfo?.displayName || 'unknown';
  const id = userInfo?.id || Math.floor(100000 + Math.random() * 900000);
  const tier = userInfo?.tier || 'Premium';
  const since = userInfo?.since || formatDate();

  return (
    <div style={{ 
      width: '340px',
      height: '200px',
      backgroundColor: '#107c10', 
      color: 'white',
      borderRadius: '12px',
      padding: '0',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
      margin: '20px 0',
      transition: 'transform 0.3s, box-shadow 0.3s',
      cursor: 'pointer',
      backgroundImage: 'linear-gradient(135deg, #107c10 0%, #267A02 100%)',
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.2)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
    }}
    >
      {/* Card shine effect overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.05) 100%)',
        zIndex: 1
      }} />
      
      {/* Decorative elements */}
      <div style={{
        position: 'absolute',
        top: '-30px',
        right: '-30px',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        zIndex: 0
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '-40px',
        left: '-20px',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.08)',
        zIndex: 0
      }} />
      
      {/* Card content */}
      <div style={{ 
        position: 'relative',
        padding: '20px', 
        height: '100%',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxSizing: 'border-box'
      }}>
        {/* Card header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '10px' 
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px' 
          }}>
            <div style={{ position: 'relative', width: '24px', height: '24px' }}>
              <div style={{
                width: '16px',
                height: '16px',
                backgroundColor: '#ffb900',
                transform: 'rotate(45deg)',
                position: 'absolute',
                top: '4px',
                left: '0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}></div>
              <div style={{
                width: '16px',
                height: '16px',
                backgroundColor: '#0c5c0c',
                transform: 'rotate(45deg)',
                position: 'absolute',
                top: '4px',
                left: '8px',
                opacity: '0.9',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}></div>
            </div>
            <span style={{ 
              fontWeight: '600', 
              fontSize: '18px',
              letterSpacing: '0.5px',
              textShadow: '0 1px 2px rgba(0,0,0,0.2)'
            }}>
              WolfeGrove Loyalty Card
            </span>
          </div>
        </div>
        
        {/* Card body */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ 
            marginBottom: '8px',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span style={{ opacity: 0.8, fontSize: '14px' }}>Name</span>
            <span style={{ 
              fontWeight: '600', 
              fontSize: '16px',
              letterSpacing: '0.5px' 
            }}>{displayName}</span>
          </div>
          
          <div style={{ 
            marginBottom: '8px',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span style={{ opacity: 0.8, fontSize: '14px' }}>Member ID</span>
            <span style={{ 
              fontWeight: '600', 
              fontSize: '16px',
              letterSpacing: '0.5px' 
            }}>{id}</span>
          </div>
          
          <div style={{ 
            marginBottom: '8px',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span style={{ opacity: 0.8, fontSize: '14px' }}>Tier</span>
            <span style={{ 
              fontWeight: '600', 
              fontSize: '16px',
              letterSpacing: '0.5px',
              backgroundColor: 'rgba(255, 185, 0, 0.8)',
              color: '#000',
              paddingLeft: '12px',
              paddingRight: '12px',
              paddingTop: '2px',
              paddingBottom: '2px',
              borderRadius: '12px'
            }}>{tier}</span>
          </div>
          
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span style={{ opacity: 0.8, fontSize: '14px' }}>Member Since</span>
            <span style={{ 
              fontWeight: '600', 
              fontSize: '16px',
              letterSpacing: '0.5px' 
            }}>{since}</span>
          </div>
        </div>
        
        {/* Card footer */}
        <div style={{ 
          marginTop: '10px', 
          borderTop: '1px solid rgba(255,255,255,0.2)',
          paddingTop: '10px',
          fontSize: '12px',
          opacity: 0.7,
          textAlign: 'center'
        }}>
          Valid at all WolfeGrove locations
        </div>
      </div>
    </div>
  );
};

export default EnhancedLoyaltyCard;