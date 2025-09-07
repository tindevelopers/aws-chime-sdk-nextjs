import React, { useEffect, useState } from 'react';
import { 
  VideoInputControl, 
  LocalVideo, 
  VideoTileGrid,
  VideoInputBackgroundBlurControl,
  PreviewVideo,
  useMeetingManager,
  useVideoInputs
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
  const { devices, selectedDevice } = useVideoInputs();
  const meetingManager = useMeetingManager();
  const [usePreview, setUsePreview] = useState(true);

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
        {usePreview && selectedDevice ? (
          <div style={{ 
            width: '100%', 
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <PreviewVideo />
          </div>
        ) : isVideoEnabled ? (
          <div style={{ 
            width: '100%', 
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <LocalVideo />
          </div>
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
          />

          {/* Background Blur Control */}
          {showBackgroundBlur && (
            <VideoInputBackgroundBlurControl 
              backgroundBlurLabel="Background Blur"
            />
          )}
        </div>
      )}

      {/* Status Info */}
      <div style={{
        fontSize: '12px',
        color: (usePreview && selectedDevice) || isVideoEnabled ? '#28a745' : '#6c757d',
        textAlign: 'center',
        padding: '8px 12px',
        backgroundColor: (usePreview && selectedDevice) || isVideoEnabled ? '#d4edda' : '#e2e3e5',
        borderRadius: '4px',
        border: `1px solid ${(usePreview && selectedDevice) || isVideoEnabled ? '#c3e6cb' : '#ced4da'}`
      }}>
        {(usePreview && selectedDevice) || isVideoEnabled ? 
          '✅ Camera is active' : 
          selectedDevice ? 
            '📱 Camera is ready to start' : 
            '⚠️ No camera selected'
        }
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
