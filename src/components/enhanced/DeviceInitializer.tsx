import React, { useEffect, useState } from 'react';
import { useMeetingManager } from 'amazon-chime-sdk-component-library-react';

interface DeviceInitializerProps {
  children: React.ReactNode;
  onInitialized?: (success: boolean) => void;
}

export default function DeviceInitializer({ children, onInitialized }: DeviceInitializerProps) {
  const meetingManager = useMeetingManager();
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const [hasPermissions, setHasPermissions] = useState(false);

  useEffect(() => {
    const initializeDevices = async () => {
      try {
        console.log('DeviceInitializer: Starting device initialization...');
        
        // Request permissions first
        console.log('DeviceInitializer: Requesting media permissions...');
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        
        console.log('DeviceInitializer: Permissions granted, got stream:', stream);
        setHasPermissions(true);
        
        // Stop the test stream
        stream.getTracks().forEach(track => track.stop());
        
        // Initialize device lists with the meeting manager
        console.log('DeviceInitializer: Updating meeting manager device lists...');
        
        // Update device lists to populate the Component Library's device state
        await meetingManager.updateDeviceLists();
        
        const videoDevices = meetingManager.videoInputDevices || [];
        const audioDevices = meetingManager.audioInputDevices || [];
        const outputDevices = meetingManager.audioOutputDevices || [];
        
        console.log('DeviceInitializer: Found devices:', {
          video: videoDevices.length,
          audio: audioDevices.length,
          output: outputDevices.length
        });
        
        // Select first available devices if any exist
        if (videoDevices.length > 0) {
          console.log('DeviceInitializer: Selecting first video device:', videoDevices[0].label);
          meetingManager.selectVideoInputDevice(videoDevices[0].deviceId);
        }
        
        if (audioDevices.length > 0) {
          console.log('DeviceInitializer: Starting first audio device:', audioDevices[0].label);
          await meetingManager.startAudioInputDevice(audioDevices[0].deviceId);
        }
        
        if (outputDevices.length > 0) {
          console.log('DeviceInitializer: Starting first output device:', outputDevices[0].label);
          await meetingManager.startAudioOutputDevice(outputDevices[0].deviceId);
        }
        
        console.log('DeviceInitializer: Device initialization completed successfully');
        setIsInitializing(false);
        onInitialized?.(true);
        
      } catch (error) {
        console.error('DeviceInitializer: Failed to initialize devices:', error);
        setInitError(error instanceof Error ? error.message : 'Unknown initialization error');
        setIsInitializing(false);
        onInitialized?.(false);
      }
    };

    initializeDevices();
  }, [meetingManager, onInitialized]);

  if (isInitializing) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        minHeight: '300px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #e3f2fd',
          borderTop: '4px solid #2196f3',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }} />
        <h3 style={{ color: '#495057', margin: '0 0 10px 0' }}>Initializing Devices...</h3>
        <p style={{ color: '#6c757d', textAlign: 'center', margin: '0' }}>
          {!hasPermissions ? 
            'Requesting camera and microphone permissions...' : 
            'Setting up device management...'}
        </p>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (initError) {
    return (
      <div style={{
        padding: '30px',
        backgroundColor: '#f8d7da',
        border: '1px solid #f5c6cb',
        borderRadius: '8px',
        color: '#721c24'
      }}>
        <h3 style={{ margin: '0 0 15px 0' }}>❌ Device Initialization Failed</h3>
        <p style={{ margin: '0 0 15px 0' }}>
          <strong>Error:</strong> {initError}
        </p>
        <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
          <p><strong>Common solutions:</strong></p>
          <ul style={{ margin: '0', paddingLeft: '20px' }}>
            <li>Make sure to allow camera and microphone permissions</li>
            <li>Check that your camera and microphone are not in use by other applications</li>
            <li>Try refreshing the page and granting permissions again</li>
            <li>Ensure you're using a supported browser (Chrome, Firefox, Safari, Edge)</li>
          </ul>
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: '15px',
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          🔄 Retry Initialization
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
