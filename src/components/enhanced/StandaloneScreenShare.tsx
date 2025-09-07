import React, { useState, useRef } from 'react';

interface StandaloneScreenShareProps {
  showControls?: boolean;
  style?: React.CSSProperties;
}

export default function StandaloneScreenShare({
  showControls = true,
  style = {}
}: StandaloneScreenShareProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [shareStream, setShareStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startScreenShare = async () => {
    try {
      console.log('StandaloneScreenShare: Starting screen share...');
      setError(null);

      // Request screen share
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });

      console.log('StandaloneScreenShare: Screen share stream obtained:', stream);

      // Set up video preview
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Listen for stream end (user clicks "Stop sharing" in browser)
      stream.getVideoTracks()[0].addEventListener('ended', () => {
        console.log('StandaloneScreenShare: Screen share ended by user');
        stopScreenShare();
      });

      setShareStream(stream);
      setIsSharing(true);
      
    } catch (err) {
      console.error('StandaloneScreenShare: Failed to start screen share:', err);
      setError(err instanceof Error ? err.message : 'Failed to start screen sharing');
    }
  };

  const stopScreenShare = () => {
    console.log('StandaloneScreenShare: Stopping screen share...');
    
    if (shareStream) {
      shareStream.getTracks().forEach(track => track.stop());
      setShareStream(null);
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsSharing(false);
    setError(null);
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px',
    padding: '20px',
    border: '1px solid #dee2e6',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    ...style
  };

  const previewStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '600px',
    height: '400px',
    backgroundColor: '#000',
    borderRadius: '8px',
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const videoStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  };

  const placeholderStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '16px',
    textAlign: 'center'
  };

  const buttonStyle: React.CSSProperties = {
    padding: '12px 24px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    backgroundColor: isSharing ? '#dc3545' : '#007bff',
    color: 'white'
  };

  return (
    <div style={containerStyle}>
      <h3 style={{ margin: '0 0 10px 0', color: '#232f3e' }}>🖥️ Screen Sharing</h3>
      <p style={{ margin: '0 0 15px 0', color: '#666', textAlign: 'center' }}>
        Share your screen, window, or browser tab with participants
      </p>
      
      {/* Screen Share Preview */}
      <div style={previewStyle}>
        {isSharing && shareStream ? (
          <video
            ref={videoRef}
            style={videoStyle}
            autoPlay
            muted
            playsInline
          />
        ) : (
          <div style={placeholderStyle}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>🖥️</div>
            <div>No screen sharing active</div>
            <div style={{ fontSize: '12px', marginTop: '5px', opacity: 0.8 }}>
              Click the "Share Screen" button below to start<br />
              sharing your screen, window, or browser tab<br />
              with other participants
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          padding: '10px 15px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '6px',
          color: '#721c24',
          fontSize: '14px',
          textAlign: 'center'
        }}>
          ❌ {error}
        </div>
      )}

      {/* Controls */}
      {showControls && (
        <button
          onClick={isSharing ? stopScreenShare : startScreenShare}
          style={buttonStyle}
        >
          {isSharing ? '⏹️ Stop Sharing' : '📤 Share Screen'}
        </button>
      )}

      {/* Status */}
      <div style={{
        fontSize: '12px',
        color: isSharing ? '#28a745' : '#6c757d',
        textAlign: 'center',
        padding: '8px 12px',
        backgroundColor: isSharing ? '#d4edda' : '#e2e3e5',
        borderRadius: '4px',
        border: `1px solid ${isSharing ? '#c3e6cb' : '#ced4da'}`
      }}>
        {isSharing ? 
          '✅ Screen sharing is active' : 
          '📱 Screen sharing is ready • Click "Share Screen" to start'
        }
      </div>

      {/* Information */}
      <div style={{
        fontSize: '12px',
        color: '#6c757d',
        textAlign: 'center',
        padding: '10px',
        backgroundColor: '#f8f9fa',
        borderRadius: '6px',
        border: '1px solid #e9ecef'
      }}>
        <strong>💡 You can share:</strong><br />
        • Entire screen • Specific window • Just a browser tab<br />
        Audio sharing (when supported) • Multiple share support
      </div>
    </div>
  );
}
