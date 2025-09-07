import React, { useEffect, useState } from 'react';
import { DefaultDeviceController, ConsoleLogger, LogLevel } from 'amazon-chime-sdk-js';

interface StandaloneDeviceInitializerProps {
  children: React.ReactNode;
  onInitialized?: (success: boolean, deviceController?: DefaultDeviceController) => void;
}

export default function StandaloneDeviceInitializer({ 
  children, 
  onInitialized 
}: StandaloneDeviceInitializerProps) {
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [deviceController] = useState(() => {
    const logger = new ConsoleLogger('StandaloneDeviceController', LogLevel.INFO);
    return new DefaultDeviceController(logger, { enableWebAudio: false });
  });

  useEffect(() => {
    const initializeDevices = async () => {
      try {
        console.log('StandaloneDeviceInitializer: Starting device initialization...');
        
        // Request permissions first
        console.log('StandaloneDeviceInitializer: Requesting media permissions...');
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        
        console.log('StandaloneDeviceInitializer: Permissions granted, got stream:', stream);
        setHasPermissions(true);
        
        // Stop the test stream
        stream.getTracks().forEach(track => track.stop());
        
        // Use device controller to enumerate devices
        console.log('StandaloneDeviceInitializer: Listing devices with DeviceController...');
        
        const videoDevices = await deviceController.listVideoInputDevices();
        const audioDevices = await deviceController.listAudioInputDevices();
        const outputDevices = await deviceController.listAudioOutputDevices();
        
        console.log('StandaloneDeviceInitializer: Found devices:', {
          video: videoDevices.length,
          audio: audioDevices.length,
          output: outputDevices.length
        });
        
        // Store device controller globally for enhanced components to use
        (window as any).__chimeDeviceController = deviceController;
        (window as any).__chimeDevices = {
          video: videoDevices,
          audio: audioDevices,
          output: outputDevices
        };
        
        console.log('StandaloneDeviceInitializer: Device initialization completed successfully');
        setIsInitializing(false);
        onInitialized?.(true, deviceController);
        
      } catch (error) {
        console.error('StandaloneDeviceInitializer: Failed to initialize devices:', error);
        setInitError(error instanceof Error ? error.message : 'Unknown initialization error');
        setIsInitializing(false);
        onInitialized?.(false);
      }
    };

    initializeDevices();
  }, [deviceController, onInitialized]);

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
        <h3 style={{ color: '#495057', margin: '0 0 10px 0' }}>Initializing Device Access...</h3>
        <p style={{ color: '#6c757d', textAlign: 'center', margin: '0' }}>
          {!hasPermissions ? 
            'Requesting camera and microphone permissions...' : 
            'Detecting available devices...'}
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
        <h3 style={{ margin: '0 0 15px 0' }}>❌ Device Access Failed</h3>
        <p style={{ margin: '0 0 15px 0' }}>
          <strong>Error:</strong> {initError}
        </p>
        <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
          <p><strong>Common solutions:</strong></p>
          <ul style={{ margin: '0', paddingLeft: '20px' }}>
            <li>Click "Allow" when prompted for camera and microphone permissions</li>
            <li>Check that your camera and microphone are not in use by other applications</li>
            <li>Try refreshing the page and granting permissions again</li>
            <li>Ensure you're using a supported browser (Chrome, Firefox, Safari, Edge)</li>
            <li>Check browser settings to ensure camera/microphone access is enabled</li>
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
          🔄 Retry Device Access
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
