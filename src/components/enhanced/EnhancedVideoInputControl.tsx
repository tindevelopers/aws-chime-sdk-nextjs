import React from 'react';
import { 
  VideoInputControl, 
  LocalVideo, 
  VideoTileGrid,
  VideoInputBackgroundBlurControl 
} from 'amazon-chime-sdk-component-library-react';
import { useLocalVideo } from 'amazon-chime-sdk-component-library-react';

interface EnhancedVideoInputControlProps {
  width?: number;
  height?: number;
  showControls?: boolean;
  showBackgroundBlur?: boolean;
  style?: React.CSSProperties;
}

export default function EnhancedVideoInputControl({
  width = 320,
  height = 240,
  showControls = true,
  showBackgroundBlur = true,
  style = {}
}: EnhancedVideoInputControlProps) {
  const { isVideoEnabled, toggleVideo } = useLocalVideo();

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    ...style
  };

  const videoContainerStyle: React.CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    backgroundColor: '#000',
    borderRadius: '8px',
    overflow: 'hidden',
    position: 'relative'
  };

  const placeholderStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: '#e9ecef',
    border: '2px dashed #adb5bd',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    color: '#6c757d',
    fontSize: '14px',
    textAlign: 'center'
  };

  return (
    <div style={containerStyle}>
      <h3 style={{ margin: '0 0 15px 0', color: '#333', textAlign: 'center' }}>
        🎥 Enhanced Camera Preview
      </h3>
      
      {/* Video Preview Area */}
      <div style={videoContainerStyle}>
        {isVideoEnabled ? (
          <LocalVideo 
            style={{ 
              width: '100%', 
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <div style={placeholderStyle}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📹</div>
            <div>Camera is off</div>
            <div style={{ fontSize: '12px', marginTop: '5px', color: '#666' }}>
              Click the camera button below to start
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Controls */}
      {showControls && (
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {/* Video Input Control with device selection */}
          <VideoInputControl 
            label="Camera"
            style={{
              backgroundColor: isVideoEnabled ? '#28a745' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          />

          {/* Background Blur Control */}
          {showBackgroundBlur && (
            <VideoInputBackgroundBlurControl 
              label="Background Blur"
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            />
          )}
        </div>
      )}

      {/* Status Info */}
      <div style={{
        fontSize: '12px',
        color: isVideoEnabled ? '#28a745' : '#6c757d',
        textAlign: 'center',
        padding: '8px 12px',
        backgroundColor: isVideoEnabled ? '#d4edda' : '#e2e3e5',
        borderRadius: '4px',
        border: `1px solid ${isVideoEnabled ? '#c3e6cb' : '#ced4da'}`
      }}>
        {isVideoEnabled ? '✅ Camera is active' : '📱 Camera is ready to start'}
      </div>

      {/* Instructions */}
      <div style={{
        fontSize: '12px',
        color: '#666',
        textAlign: 'center',
        maxWidth: `${width}px`,
        lineHeight: '1.4'
      }}>
        💡 <strong>Tip:</strong> Click the camera button to toggle video on/off. 
        Use the dropdown to switch between cameras.
        {showBackgroundBlur && ' Background blur can be applied for professional appearance.'}
      </div>
    </div>
  );
}
