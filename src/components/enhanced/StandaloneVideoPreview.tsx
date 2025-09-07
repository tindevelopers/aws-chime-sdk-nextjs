import React, { useEffect, useState, useRef } from 'react';
import { DefaultDeviceController } from 'amazon-chime-sdk-js';

interface StandaloneVideoPreviewProps {
  width?: number;
  height?: number;
  showControls?: boolean;
  style?: React.CSSProperties;
}

export default function StandaloneVideoPreview({
  width = 480,
  height = 360,
  showControls = true,
  style = {}
}: StandaloneVideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [currentStream, setCurrentStream] = useState<MediaStream | null>(null);
  const [deviceController, setDeviceController] = useState<DefaultDeviceController | null>(null);

  useEffect(() => {
    // Get device controller from global state
    const controller = (window as any).__chimeDeviceController as DefaultDeviceController;
    const deviceData = (window as any).__chimeDevices;
    
    if (controller && deviceData) {
      setDeviceController(controller);
      setDevices(deviceData.video || []);
      
      // Auto-select first device
      if (deviceData.video && deviceData.video.length > 0) {
        setSelectedDevice(deviceData.video[0].deviceId);
      }
    }
  }, []);

  const startVideo = async () => {
    if (!deviceController || !selectedDevice) return;

    try {
      console.log('StandaloneVideoPreview: Starting video with device:', selectedDevice);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: selectedDevice },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setCurrentStream(stream);
      setIsVideoOn(true);
      console.log('StandaloneVideoPreview: Video started successfully');
      
    } catch (error) {
      console.error('StandaloneVideoPreview: Failed to start video:', error);
    }
  };

  const stopVideo = () => {
    if (currentStream) {
      currentStream.getTracks().forEach(track => track.stop());
      setCurrentStream(null);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsVideoOn(false);
    console.log('StandaloneVideoPreview: Video stopped');
  };

  const switchDevice = async (deviceId: string) => {
    setSelectedDevice(deviceId);
    
    if (isVideoOn) {
      // Restart with new device
      stopVideo();
      // Small delay to ensure cleanup
      setTimeout(() => {
        startVideo();
      }, 100);
    }
  };

  // Auto-start video when device is selected
  useEffect(() => {
    if (selectedDevice && devices.length > 0 && !isVideoOn) {
      startVideo();
    }
  }, [selectedDevice, devices.length]);

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

  const videoContainerStyle: React.CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
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
    objectFit: 'cover'
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

  const controlsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center'
  };

  const buttonStyle: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px'
  };

  return (
    <div style={containerStyle}>
      <h3 style={{ margin: '0 0 10px 0', color: '#232f3e' }}>📹 Standalone Camera Preview</h3>
      
      {/* Video Preview */}
      <div style={videoContainerStyle}>
        {isVideoOn ? (
          <video
            ref={videoRef}
            style={videoStyle}
            autoPlay
            muted
            playsInline
            onLoadedMetadata={() => console.log('Video metadata loaded')}
            onCanPlay={() => console.log('Video can play')}
            onError={(e) => console.error('Video error:', e)}
          />
        ) : (
          <div style={placeholderStyle}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>📹</div>
            <div>Camera Preview</div>
            <div style={{ fontSize: '12px', marginTop: '5px', opacity: 0.8 }}>
              {devices.length > 0 ? 'Click Start to begin preview' : 'No cameras detected'}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      {showControls && (
        <div style={controlsStyle}>
          {devices.length > 0 && (
            <select
              value={selectedDevice}
              onChange={(e) => switchDevice(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #ced4da',
                fontSize: '14px'
              }}
            >
              {devices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Camera ${devices.indexOf(device) + 1}`}
                </option>
              ))}
            </select>
          )}
          
          <button
            onClick={isVideoOn ? stopVideo : startVideo}
            disabled={!selectedDevice}
            style={{
              ...buttonStyle,
              backgroundColor: isVideoOn ? '#dc3545' : '#28a745',
              color: 'white'
            }}
          >
            {isVideoOn ? '⏹️ Stop' : '▶️ Start'} Camera
          </button>
        </div>
      )}

      {/* Status */}
      <div style={{
        fontSize: '12px',
        color: isVideoOn ? '#28a745' : devices.length > 0 ? '#6c757d' : '#dc3545',
        textAlign: 'center',
        padding: '8px 12px',
        backgroundColor: isVideoOn ? '#d4edda' : devices.length > 0 ? '#e2e3e5' : '#f8d7da',
        borderRadius: '4px',
        border: `1px solid ${isVideoOn ? '#c3e6cb' : devices.length > 0 ? '#ced4da' : '#f5c6cb'}`
      }}>
        {isVideoOn ? 
          '✅ Camera is active' : 
          devices.length > 0 ? 
            '📱 Camera ready to start' : 
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
          Devices: {devices.length} | Selected: {selectedDevice ? 'Yes' : 'No'} | Video: {isVideoOn ? 'On' : 'Off'}
        </div>
      )}
    </div>
  );
}
