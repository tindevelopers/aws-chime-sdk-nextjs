import { useEffect, useRef, useState } from 'react';

interface CameraPreviewProps {
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

export default function CameraPreview({ 
  width = 320, 
  height = 240, 
  style = {} 
}: CameraPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getMediaDevices = async () => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
      setError('Media devices not supported');
      return;
    }
    
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setDevices(videoDevices);
      
      if (videoDevices.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(videoDevices[0].deviceId);
      }
    } catch (err: any) {
      console.error('Error enumerating devices:', err);
      setError('Could not access media devices');
    }
  };

  const startCamera = async (deviceId?: string) => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
      setError('Media devices not supported');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const constraints: MediaStreamConstraints = {
        video: deviceId ? { deviceId: { exact: deviceId } } : true,
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setIsEnabled(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Get updated device list after permission granted
      await getMediaDevices();
    } catch (err: any) {
      console.error('Error accessing camera:', err);
      
      if (err.name === 'NotAllowedError') {
        setError('Camera access denied. Please allow camera access in your browser settings.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera device found.');
      } else if (err.name === 'NotReadableError') {
        setError('Camera is already in use by another application.');
      } else {
        setError(`Camera error: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsEnabled(false);
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const switchCamera = async (deviceId: string) => {
    if (isEnabled) {
      stopCamera();
      await startCamera(deviceId);
    }
    setSelectedDeviceId(deviceId);
  };

  useEffect(() => {
    if (isClient) {
      getMediaDevices();
    }

    return () => {
      stopCamera();
    };
  }, [isClient]);

  // Ensure video element gets the stream when it changes
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      console.log('Video element updated with stream');
    }
  }, [stream]);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    ...style
  };

  const videoStyle: React.CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    backgroundColor: '#000',
    borderRadius: '8px',
    objectFit: 'cover'
  };

  const placeholderStyle: React.CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
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

  if (!isClient) {
    return (
      <div style={containerStyle}>
        <div style={placeholderStyle}>
          <div>🎥</div>
          <div style={{ marginTop: '8px' }}>Loading camera interface...</div>
        </div>
      </div>
    );
  }


  return (
    <div style={containerStyle}>
      <h3 style={{ margin: '0 0 15px 0', color: '#333', textAlign: 'center' }}>🎥 Camera Preview</h3>
      {/* Camera Selection */}
      {devices.length > 1 && (
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
            Camera:
          </label>
          <select 
            value={selectedDeviceId}
            onChange={(e) => switchCamera(e.target.value)}
            style={{
              padding: '5px 10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            {devices.map(device => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${device.deviceId.slice(0, 8)}`}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Video Preview */}
      {isEnabled && stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={videoStyle}
          onLoadedMetadata={() => console.log('Video metadata loaded')}
          onCanPlay={() => console.log('Video can play')}
          onError={(e) => console.error('Video error:', e)}
        />
      ) : (
        <div style={placeholderStyle}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>📹</div>
          <div>
            {error ? (
              <div style={{ color: '#dc3545' }}>❌ {error}</div>
            ) : isLoading ? (
              'Loading camera...'
            ) : (
              'Camera Preview'
            )}
          </div>
        </div>
      )}
      
      {/* Debug Info */}
      {isEnabled && (
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
          Stream: {stream ? '✅ Active' : '❌ None'} | 
          Video Element: {videoRef.current ? '✅ Ready' : '❌ Missing'}
        </div>
      )}

      {/* Camera Controls */}
      <div style={{ display: 'flex', gap: '10px' }}>
        {!isEnabled ? (
          <button
            onClick={() => startCamera(selectedDeviceId)}
            disabled={isLoading}
            style={{
              padding: '8px 16px',
              backgroundColor: isLoading ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            {isLoading ? 'Starting...' : '🎥 Start Camera'}
          </button>
        ) : (
          <button
            onClick={stopCamera}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🛑 Stop Camera
          </button>
        )}

        <button
          onClick={getMediaDevices}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          padding: '10px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          color: '#721c24',
          fontSize: '14px',
          maxWidth: `${width}px`,
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      {/* Device Info */}
      {isEnabled && stream && (
        <div style={{
          fontSize: '12px',
          color: '#666',
          textAlign: 'center',
          maxWidth: `${width}px`
        }}>
          ✅ Camera active • {stream.getVideoTracks()[0]?.label || 'Unknown camera'}
        </div>
      )}
    </div>
  );
}
