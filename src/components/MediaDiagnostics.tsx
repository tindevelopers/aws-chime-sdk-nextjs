import { useEffect, useState } from 'react';

interface MediaDiagnosticsProps {
  style?: React.CSSProperties;
}

interface DeviceInfo {
  deviceId: string;
  label: string;
  kind: MediaDeviceKind;
  groupId: string;
}

interface PermissionStatus {
  camera: PermissionState | 'unknown';
  microphone: PermissionState | 'unknown';
}

export default function MediaDiagnostics({ style = {} }: MediaDiagnosticsProps) {
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [permissions, setPermissions] = useState<PermissionStatus>({
    camera: 'unknown',
    microphone: 'unknown'
  });
  const [browserInfo, setBrowserInfo] = useState<any>({});
  const [apiSupport, setApiSupport] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const checkPermissions = async () => {
    if (typeof navigator === 'undefined' || !navigator.permissions) {
      return;
    }
    try {
      if ('permissions' in navigator) {
        const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });
        const microphonePermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        
        setPermissions({
          camera: cameraPermission.state,
          microphone: microphonePermission.state
        });
      }
    } catch (err) {
      console.log('Permissions API not fully supported');
    }
  };

  const getDevices = async () => {
    try {
      if (!navigator.mediaDevices?.enumerateDevices) {
        throw new Error('enumerateDevices not supported');
      }

      const deviceList = await navigator.mediaDevices.enumerateDevices();
      setDevices(deviceList.map(device => ({
        deviceId: device.deviceId,
        label: device.label,
        kind: device.kind,
        groupId: device.groupId
      })));
    } catch (err: any) {
      setError(`Failed to get devices: ${err.message}`);
    }
  };

  const getBrowserInfo = () => {
    if (typeof navigator === 'undefined') {
      return;
    }
    
    const ua = navigator.userAgent;
    const info = {
      userAgent: ua,
      browser: 'Unknown',
      version: 'Unknown',
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine
    };

    if (ua.includes('Chrome')) {
      info.browser = 'Chrome';
      const match = ua.match(/Chrome\/(\d+)/);
      info.version = match ? match[1] : 'Unknown';
    } else if (ua.includes('Firefox')) {
      info.browser = 'Firefox';
      const match = ua.match(/Firefox\/(\d+)/);
      info.version = match ? match[1] : 'Unknown';
    } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
      info.browser = 'Safari';
      const match = ua.match(/Version\/(\d+)/);
      info.version = match ? match[1] : 'Unknown';
    } else if (ua.includes('Edge')) {
      info.browser = 'Edge';
      const match = ua.match(/Edge\/(\d+)/);
      info.version = match ? match[1] : 'Unknown';
    }

    setBrowserInfo(info);
  };

  const checkAPISupport = () => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return;
    }
    
    const support = {
      mediaDevices: !!navigator.mediaDevices,
      getUserMedia: !!(navigator.mediaDevices?.getUserMedia),
      enumerateDevices: !!(navigator.mediaDevices?.enumerateDevices),
      getDisplayMedia: !!(navigator.mediaDevices?.getDisplayMedia),
      audioContext: !!(window.AudioContext || (window as any).webkitAudioContext),
      webRTC: !!(window.RTCPeerConnection || (window as any).webkitRTCPeerConnection),
      permissions: !!navigator.permissions,
      isSecureContext: window.isSecureContext,
      protocol: window.location.protocol
    };

    setApiSupport(support);
  };

  const testCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      return '✅ Camera access successful';
    } catch (err: any) {
      return `❌ Camera access failed: ${err.name} - ${err.message}`;
    }
  };

  const testMicrophoneAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return '✅ Microphone access successful';
    } catch (err: any) {
      return `❌ Microphone access failed: ${err.name} - ${err.message}`;
    }
  };

  const runDiagnostics = async () => {
    setLoading(true);
    setError('');

    try {
      getBrowserInfo();
      checkAPISupport();
      await checkPermissions();
      await getDevices();
    } catch (err: any) {
      setError(`Diagnostics failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isClient) {
      runDiagnostics();
    }
  }, [isClient]);

  const containerStyle: React.CSSProperties = {
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f8f9fa',
    fontFamily: 'monospace',
    fontSize: '12px',
    ...style
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '6px',
    border: '1px solid #e9ecef'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#495057'
  };

  const getStatusIcon = (status: boolean | string) => {
    if (typeof status === 'boolean') {
      return status ? '✅' : '❌';
    }
    switch (status) {
      case 'granted': return '✅';
      case 'denied': return '❌';
      case 'prompt': return '⚠️';
      default: return '❓';
    }
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center' }}>
          🔍 Running media diagnostics...
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#212529' }}>
        🔍 Media Diagnostics Report
      </h3>

      {error && (
        <div style={{
          ...sectionStyle,
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          color: '#721c24'
        }}>
          <div style={titleStyle}>❌ Error</div>
          <div>{error}</div>
        </div>
      )}

      {/* Browser Information */}
      <div style={sectionStyle}>
        <div style={titleStyle}>🌐 Browser Information</div>
        <div><strong>Browser:</strong> {browserInfo.browser} {browserInfo.version}</div>
        <div><strong>Platform:</strong> {browserInfo.platform}</div>
        <div><strong>Language:</strong> {browserInfo.language}</div>
        <div><strong>Protocol:</strong> {apiSupport.protocol}</div>
        <div><strong>Secure Context:</strong> {getStatusIcon(apiSupport.isSecureContext)} {apiSupport.isSecureContext ? 'Yes' : 'No'}</div>
        <div><strong>Online:</strong> {getStatusIcon(browserInfo.onLine)} {browserInfo.onLine ? 'Yes' : 'No'}</div>
      </div>

      {/* API Support */}
      <div style={sectionStyle}>
        <div style={titleStyle}>🔧 API Support</div>
        <div><strong>MediaDevices API:</strong> {getStatusIcon(apiSupport.mediaDevices)} {apiSupport.mediaDevices ? 'Supported' : 'Not Supported'}</div>
        <div><strong>getUserMedia:</strong> {getStatusIcon(apiSupport.getUserMedia)} {apiSupport.getUserMedia ? 'Available' : 'Not Available'}</div>
        <div><strong>enumerateDevices:</strong> {getStatusIcon(apiSupport.enumerateDevices)} {apiSupport.enumerateDevices ? 'Available' : 'Not Available'}</div>
        <div><strong>getDisplayMedia:</strong> {getStatusIcon(apiSupport.getDisplayMedia)} {apiSupport.getDisplayMedia ? 'Available' : 'Not Available'}</div>
        <div><strong>AudioContext:</strong> {getStatusIcon(apiSupport.audioContext)} {apiSupport.audioContext ? 'Supported' : 'Not Supported'}</div>
        <div><strong>WebRTC:</strong> {getStatusIcon(apiSupport.webRTC)} {apiSupport.webRTC ? 'Supported' : 'Not Supported'}</div>
        <div><strong>Permissions API:</strong> {getStatusIcon(apiSupport.permissions)} {apiSupport.permissions ? 'Available' : 'Not Available'}</div>
      </div>

      {/* Permissions */}
      <div style={sectionStyle}>
        <div style={titleStyle}>🔐 Permissions Status</div>
        <div><strong>Camera:</strong> {getStatusIcon(permissions.camera)} {permissions.camera}</div>
        <div><strong>Microphone:</strong> {getStatusIcon(permissions.microphone)} {permissions.microphone}</div>
      </div>

      {/* Devices */}
      <div style={sectionStyle}>
        <div style={titleStyle}>📱 Available Devices</div>
        {devices.length === 0 ? (
          <div style={{ color: '#dc3545' }}>No devices found or permission denied</div>
        ) : (
          <div>
            <div><strong>Total devices:</strong> {devices.length}</div>
            <div><strong>Video inputs:</strong> {devices.filter(d => d.kind === 'videoinput').length}</div>
            <div><strong>Audio inputs:</strong> {devices.filter(d => d.kind === 'audioinput').length}</div>
            <div><strong>Audio outputs:</strong> {devices.filter(d => d.kind === 'audiooutput').length}</div>
            
            {devices.map((device, index) => (
              <div key={device.deviceId || `device-${index}`} style={{ marginTop: '5px', paddingLeft: '10px' }}>
                <strong>{index + 1}.</strong> {device.kind}: {device.label || `${device.kind} (${device.deviceId?.slice(0, 8) || 'unknown'}...)`}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Test Actions */}
      <div style={sectionStyle}>
        <div style={titleStyle}>🧪 Quick Tests</div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={async () => {
              const result = await testCameraAccess();
              alert(result);
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Test Camera
          </button>
          
          <button
            onClick={async () => {
              const result = await testMicrophoneAccess();
              alert(result);
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Test Microphone
          </button>

          <button
            onClick={runDiagnostics}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Recommendations */}
      <div style={sectionStyle}>
        <div style={titleStyle}>💡 Recommendations</div>
        <ul style={{ margin: '0', paddingLeft: '20px' }}>
          {!apiSupport.isSecureContext && (
            <li style={{ color: '#dc3545' }}>❌ <strong>HTTPS Required:</strong> Camera/microphone access requires HTTPS in production</li>
          )}
          {!apiSupport.mediaDevices && (
            <li style={{ color: '#dc3545' }}>❌ <strong>Unsupported Browser:</strong> MediaDevices API is not supported</li>
          )}
          {permissions.camera === 'denied' && (
            <li style={{ color: '#dc3545' }}>❌ <strong>Camera Blocked:</strong> Camera access is denied. Check browser settings</li>
          )}
          {permissions.microphone === 'denied' && (
            <li style={{ color: '#dc3545' }}>❌ <strong>Microphone Blocked:</strong> Microphone access is denied. Check browser settings</li>
          )}
          {devices.filter(d => d.kind === 'videoinput').length === 0 && (
            <li style={{ color: '#ffc107' }}>⚠️ <strong>No Camera:</strong> No video input devices detected</li>
          )}
          {devices.filter(d => d.kind === 'audioinput').length === 0 && (
            <li style={{ color: '#ffc107' }}>⚠️ <strong>No Microphone:</strong> No audio input devices detected</li>
          )}
          {apiSupport.mediaDevices && apiSupport.isSecureContext && permissions.camera !== 'denied' && permissions.microphone !== 'denied' && (
            <li style={{ color: '#28a745' }}>✅ <strong>Good to go:</strong> Media APIs are supported and permissions look good</li>
          )}
        </ul>
      </div>
    </div>
  );
}
