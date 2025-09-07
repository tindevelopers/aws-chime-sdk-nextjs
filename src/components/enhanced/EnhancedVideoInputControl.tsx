import React, { useEffect, useState, useRef } from 'react';
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
  const [isInitialized, setIsInitialized] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fallbackStream, setFallbackStream] = useState<MediaStream | null>(null);

  // Initialize device selection when component mounts
  useEffect(() => {
    const initializeDevices = async () => {
      try {
        if (devices.length > 0 && !selectedDevice && !isInitialized) {
          console.log('Initializing video device selection...');
          // Select the first available camera device
          const firstCamera = devices[0];
          await meetingManager.selectVideoInputDevice(firstCamera);
          setIsInitialized(true);
          console.log('Video device initialized:', firstCamera.label);
        }
      } catch (error) {
        console.error('Failed to initialize video device:', error);
        // Fallback to direct media access
        setUseFallback(true);
      }
    };

    initializeDevices();
  }, [devices, selectedDevice, meetingManager, isInitialized]);

  // Fallback video stream using getUserMedia
  useEffect(() => {
    const startFallbackVideo = async () => {
      if (useFallback && !fallbackStream && videoRef.current) {
        try {
          console.log('Starting fallback video stream...');
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: width, height: height },
            audio: false 
          });
          setFallbackStream(stream);
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          console.log('Fallback video stream started');
        } catch (error) {
          console.error('Failed to start fallback video:', error);
        }
      }
    };

    startFallbackVideo();

    // Cleanup function
    return () => {
      if (fallbackStream) {
        fallbackStream.getTracks().forEach(track => track.stop());
        setFallbackStream(null);
      }
    };
  }, [useFallback, fallbackStream, width, height]);

  // Timeout to trigger fallback if Component Library doesn't work
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!selectedDevice && !fallbackStream && !useFallback && devices.length === 0) {
        console.log('Timeout reached, enabling fallback mode...');
        setUseFallback(true);
      }
    }, 3000); // 3 second timeout

    return () => clearTimeout(timeout);
  }, [selectedDevice, fallbackStream, useFallback, devices.length]);

  // Helper function to get device label safely
  const getDeviceLabel = (device: any): string => {
    if (!device) return 'None';
    if (typeof device === 'string') {
      // If selectedDevice is a device ID, find the matching device in devices array
      const matchingDevice = devices.find(d => d.deviceId === device);
      return matchingDevice?.label || device;
    }
    if (device.label) return device.label;
    if (device.deviceId) {
      const matchingDevice = devices.find(d => d.deviceId === device.deviceId);
      return matchingDevice?.label || device.deviceId;
    }
    return 'Unknown';
  };

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
        {useFallback && fallbackStream ? (
          <video
            ref={videoRef}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            autoPlay
            muted
            playsInline
          />
        ) : usePreview && selectedDevice ? (
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
              {devices.length === 0 ? 'No cameras detected' : 'Click the camera button below to start'}
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
        color: (useFallback && fallbackStream) || (usePreview && selectedDevice) || isVideoEnabled ? '#28a745' : '#6c757d',
        textAlign: 'center',
        padding: '8px 12px',
        backgroundColor: (useFallback && fallbackStream) || (usePreview && selectedDevice) || isVideoEnabled ? '#d4edda' : '#e2e3e5',
        borderRadius: '4px',
        border: `1px solid ${(useFallback && fallbackStream) || (usePreview && selectedDevice) || isVideoEnabled ? '#c3e6cb' : '#ced4da'}`
      }}>
        {useFallback && fallbackStream ? 
          '✅ Camera active (Direct Mode)' :
          (usePreview && selectedDevice) || isVideoEnabled ? 
            `✅ Camera active: ${getDeviceLabel(selectedDevice)}` : 
            selectedDevice ? 
              `📱 Camera ready: ${getDeviceLabel(selectedDevice)}` : 
              devices.length > 0 ?
                '🔄 Initializing camera...' :
                '⚠️ No cameras detected'
        }
      </div>

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          fontSize: '10px',
          color: '#666',
          textAlign: 'center',
          padding: '5px',
          backgroundColor: '#f8f9fa',
          borderRadius: '3px',
          fontFamily: 'monospace'
        }}>
          Devices: {devices.length} | Selected: {selectedDevice ? 'Yes' : 'No'} | Initialized: {isInitialized ? 'Yes' : 'No'} | Fallback: {useFallback ? 'Yes' : 'No'} | Stream: {fallbackStream ? 'Active' : 'None'}
        </div>
      )}

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
