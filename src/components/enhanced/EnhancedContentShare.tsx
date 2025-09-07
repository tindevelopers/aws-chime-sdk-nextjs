import React from 'react';
import { 
  ContentShare, 
  ContentShareControl 
} from 'amazon-chime-sdk-component-library-react';
import { useContentShareState } from 'amazon-chime-sdk-component-library-react';

interface EnhancedContentShareProps {
  showControls?: boolean;
  style?: React.CSSProperties;
}

export default function EnhancedContentShare({
  showControls = true,
  style = {}
}: EnhancedContentShareProps) {
  const { tiles: contentShareTiles, isLocalUserSharing } = useContentShareState();

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    minHeight: '400px',
    ...style
  };

  const contentAreaStyle: React.CSSProperties = {
    flex: 1,
    minHeight: '300px',
    backgroundColor: '#000',
    borderRadius: '8px',
    overflow: 'hidden',
    position: 'relative'
  };

  const placeholderStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: 'white',
    fontSize: '16px',
    textAlign: 'center',
    padding: '40px'
  };

  const controlsStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    padding: '15px',
    backgroundColor: '#e9ecef',
    borderRadius: '8px'
  };

  const statusStyle: React.CSSProperties = {
    fontSize: '12px',
    color: isLocalUserSharing ? '#28a745' : '#6c757d',
    textAlign: 'center',
    padding: '8px 12px',
    backgroundColor: isLocalUserSharing ? '#d4edda' : '#e2e3e5',
    border: `1px solid ${isLocalUserSharing ? '#c3e6cb' : '#ced4da'}`,
    borderRadius: '4px'
  };

  return (
    <div style={containerStyle}>
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <h3 style={{ margin: '0', color: '#333' }}>🖥️ Screen Sharing</h3>
        <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
          Share your screen, window, or browser tab with participants
        </p>
      </div>

      {/* Content Share Area */}
      <div style={contentAreaStyle}>
        {isLocalUserSharing && contentShareTiles.length > 0 ? (
          <div style={{ 
            width: '100%', 
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <ContentShare />
          </div>
        ) : (
          <div style={placeholderStyle}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🖥️</div>
            <div style={{ marginBottom: '10px', fontSize: '18px', fontWeight: 'bold' }}>
              No screen sharing active
            </div>
            <div style={{ fontSize: '14px', opacity: 0.8, maxWidth: '300px' }}>
              Click the "Share Screen" button below to start sharing your screen, 
              window, or browser tab with other participants
            </div>
            <div style={{ 
              marginTop: '20px', 
              fontSize: '12px', 
              padding: '8px 12px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '4px'
            }}>
              💡 You can share your entire screen, a specific window, or just a browser tab
            </div>
          </div>
        )}
      </div>

      {/* Status Info */}
      <div style={statusStyle}>
        {isLocalUserSharing ? (
          <>📤 Screen sharing is active • {contentShareTiles.length} content share(s)</>
        ) : (
          <>📱 Screen sharing is ready • Click "Share Screen" to start</>
        )}
      </div>

      {/* Content Share Controls */}
      {showControls && (
        <div style={controlsStyle}>
          <ContentShareControl 
            label="Share Screen"
            pauseLabel="Pause"
            unpauseLabel="Resume"
          />
        </div>
      )}

      {/* Instructions & Features */}
      <div style={{
        fontSize: '12px',
        color: '#666',
        textAlign: 'center',
        lineHeight: '1.4',
        padding: '10px',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '4px'
      }}>
        <strong>🚀 Screen Sharing Features:</strong><br/>
        • Share entire screen, specific windows, or browser tabs<br/>
        • High-quality content transmission with audio (if supported)<br/>
        • Automatic layout adjustment for optimal viewing<br/>
        • One-click start/stop sharing controls
      </div>

      {/* Browser Compatibility Note */}
      <div style={{
        fontSize: '11px',
        color: '#6c757d',
        textAlign: 'center',
        fontStyle: 'italic'
      }}>
        📋 Note: Screen sharing requires modern browser support. 
        Chrome, Firefox, Edge, and Safari are recommended for the best experience.
      </div>
    </div>
  );
}
