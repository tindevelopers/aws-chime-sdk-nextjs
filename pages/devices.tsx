import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import components to avoid SSR issues
const CameraPreview = dynamic(() => import('../src/components/CameraPreview'), {
  ssr: false,
  loading: () => <div style={{ textAlign: 'center', padding: '20px' }}>Loading camera component...</div>
});

const AudioPreview = dynamic(() => import('../src/components/AudioPreview'), {
  ssr: false,
  loading: () => <div style={{ textAlign: 'center', padding: '20px' }}>Loading audio component...</div>
});

const MediaDiagnostics = dynamic(() => import('../src/components/MediaDiagnostics'), {
  ssr: false,
  loading: () => <div style={{ textAlign: 'center', padding: '20px' }}>Loading diagnostics...</div>
});

export default function DevicesPage() {
  const [activeTab, setActiveTab] = useState<'camera' | 'audio' | 'diagnostics'>('camera');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const tabStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '10px 20px',
    backgroundColor: isActive ? '#007bff' : '#e9ecef',
    color: isActive ? 'white' : '#495057',
    border: 'none',
    borderRadius: '4px 4px 0 0',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    marginRight: '5px'
  });

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#232f3e', marginBottom: '10px' }}>
          🎧 Device Setup & Testing
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Test your camera and microphone before joining a meeting
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          style={tabStyle(activeTab === 'camera')}
          onClick={() => setActiveTab('camera')}
        >
          📹 Camera Test
        </button>
        <button 
          style={tabStyle(activeTab === 'audio')}
          onClick={() => setActiveTab('audio')}
        >
          🎤 Microphone Test
        </button>
        <button 
          style={tabStyle(activeTab === 'diagnostics')}
          onClick={() => setActiveTab('diagnostics')}
        >
          🔍 Diagnostics
        </button>
      </div>

      {/* Tab Content */}
      <div style={{ 
        border: '1px solid #ddd', 
        borderRadius: '0 8px 8px 8px',
        backgroundColor: 'white',
        padding: '20px',
        minHeight: '400px'
      }}>
        {activeTab === 'camera' && (
          <div>
            <CameraPreview 
              width={400} 
              height={300}
              style={{ margin: '0 auto' }}
            />
            
            <div style={{ 
              marginTop: '30px', 
              padding: '15px', 
              backgroundColor: '#e8f4fd',
              borderRadius: '8px',
              border: '1px solid #bee5eb'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#0c5460' }}>📋 Camera Test Instructions:</h4>
              <ul style={{ margin: '0', paddingLeft: '20px', lineHeight: '1.6' }}>
                <li>Click "Start Camera" to test your camera</li>
                <li>Grant camera permissions when prompted by your browser</li>
                <li>Check that your video appears clearly in the preview</li>
                <li>Try switching between cameras if you have multiple devices</li>
                <li>Ensure good lighting for best video quality</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'audio' && (
          <div>
            <AudioPreview style={{ margin: '0 auto' }} />
            
            <div style={{ 
              marginTop: '30px', 
              padding: '15px', 
              backgroundColor: '#fff3cd',
              borderRadius: '8px',
              border: '1px solid #ffeaa7'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>📋 Microphone Test Instructions:</h4>
              <ul style={{ margin: '0', paddingLeft: '20px', lineHeight: '1.6' }}>
                <li>Click "Start Microphone" to test your audio input</li>
                <li>Grant microphone permissions when prompted</li>
                <li>Speak normally and watch the audio level meter</li>
                <li>Green levels (1-30%) are good, yellow (30-70%) is loud, red (70%+) may cause distortion</li>
                <li>Try different microphones if available</li>
                <li>Ensure you're in a quiet environment</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'diagnostics' && (
          <div>
            <MediaDiagnostics style={{ margin: '0' }} />
            
            <div style={{ 
              marginTop: '20px', 
              padding: '15px', 
              backgroundColor: '#e8f4fd',
              borderRadius: '8px',
              border: '1px solid #bee5eb'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#0c5460' }}>📋 Diagnostics Help:</h4>
              <ul style={{ margin: '0', paddingLeft: '20px', lineHeight: '1.6' }}>
                <li>This page shows detailed information about your browser's media capabilities</li>
                <li>Red ❌ indicators show potential issues that need to be resolved</li>
                <li>Yellow ⚠️ indicators show warnings or missing features</li>
                <li>Green ✅ indicators show everything is working correctly</li>
                <li>Use the "Test Camera" and "Test Microphone" buttons for quick access tests</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* System Information */}
      {isClient && (
        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#495057' }}>🔧 System Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
            <div><strong>Browser:</strong> {
              typeof navigator !== 'undefined' ? (
                navigator.userAgent.includes('Chrome') ? 'Chrome' : 
                navigator.userAgent.includes('Firefox') ? 'Firefox' : 
                navigator.userAgent.includes('Safari') ? 'Safari' : 'Unknown'
              ) : 'Detecting...'
            }</div>
            <div><strong>Platform:</strong> {typeof navigator !== 'undefined' ? navigator.platform : 'Detecting...'}</div>
            <div><strong>Media Devices API:</strong> {
              typeof navigator !== 'undefined' && navigator.mediaDevices ? '✅ Supported' : '❌ Not Supported'
            }</div>
            <div><strong>getUserMedia:</strong> {
              typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia ? '✅ Available' : '❌ Not Available'
            }</div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ 
        marginTop: '30px', 
        textAlign: 'center',
        display: 'flex',
        gap: '15px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <a href="/" style={{
          display: 'inline-block',
          padding: '12px 24px',
          backgroundColor: '#28a745',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px',
          fontWeight: 'bold'
        }}>
          ⬅️ Back to Home
        </a>
        
        <a href="/meeting" style={{
          display: 'inline-block',
          padding: '12px 24px',
          backgroundColor: '#ff9900',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px',
          fontWeight: 'bold'
        }}>
          🎥 Continue to Meeting
        </a>

        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '12px 24px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          🔄 Refresh Page
        </button>
      </div>

      {/* Browser Permissions Help */}
      <div style={{ 
        marginTop: '30px', 
        padding: '15px', 
        backgroundColor: '#d4edda',
        borderRadius: '8px',
        border: '1px solid #c3e6cb',
        fontSize: '14px'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#155724' }}>💡 Troubleshooting Camera/Microphone Issues:</h4>
        <ul style={{ margin: '0', paddingLeft: '20px', lineHeight: '1.6' }}>
          <li><strong>Permissions Denied:</strong> Click the camera/microphone icon in your browser's address bar to grant permissions</li>
          <li><strong>Device Not Found:</strong> Check that your camera/microphone is properly connected and not used by other applications</li>
          <li><strong>Privacy Settings:</strong> Ensure your browser allows camera/microphone access for this site</li>
          <li><strong>HTTPS Required:</strong> Camera/microphone access requires HTTPS in production</li>
        </ul>
      </div>
    </div>
  );
}