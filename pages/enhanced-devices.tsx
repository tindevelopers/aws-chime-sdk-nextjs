import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  MeetingProvider, 
  darkTheme, 
  lightTheme,
  useMeetingManager
} from 'amazon-chime-sdk-component-library-react';

// Dynamically import enhanced components to avoid SSR issues
const EnhancedVideoInputControl = dynamic(() => import('../src/components/enhanced/EnhancedVideoInputControl'), {
  ssr: false,
  loading: () => <div style={{ textAlign: 'center', padding: '20px' }}>Loading enhanced camera component...</div>
});

const EnhancedAudioInputControl = dynamic(() => import('../src/components/enhanced/EnhancedAudioInputControl'), {
  ssr: false,
  loading: () => <div style={{ textAlign: 'center', padding: '20px' }}>Loading enhanced audio component...</div>
});

const EnhancedDeviceSelection = dynamic(() => import('../src/components/enhanced/EnhancedDeviceSelection'), {
  ssr: false,
  loading: () => <div style={{ textAlign: 'center', padding: '20px' }}>Loading device selection...</div>
});

const EnhancedVideoTileGrid = dynamic(() => import('../src/components/enhanced/EnhancedVideoTileGrid'), {
  ssr: false,
  loading: () => <div style={{ textAlign: 'center', padding: '20px' }}>Loading video grid...</div>
});

const EnhancedContentShare = dynamic(() => import('../src/components/enhanced/EnhancedContentShare'), {
  ssr: false,
  loading: () => <div style={{ textAlign: 'center', padding: '20px' }}>Loading content share...</div>
});

const DeviceInitializer = dynamic(() => import('../src/components/enhanced/DeviceInitializer'), {
  ssr: false,
  loading: () => <div style={{ textAlign: 'center', padding: '20px' }}>Initializing device management...</div>
});

// Legacy components for comparison
const MediaDiagnostics = dynamic(() => import('../src/components/MediaDiagnostics'), {
  ssr: false,
  loading: () => <div style={{ textAlign: 'center', padding: '20px' }}>Loading diagnostics...</div>
});

export default function EnhancedDevicesPage() {
  const [activeTab, setActiveTab] = useState<'video' | 'audio' | 'devices' | 'meeting' | 'share' | 'diagnostics'>('video');
  const [isClient, setIsClient] = useState(false);
  const [isDevicesInitialized, setIsDevicesInitialized] = useState(false);
  const [meetingConfig, setMeetingConfig] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    
    // Mock meeting configuration for demo purposes
    // In real implementation, this would come from your meeting session
    setMeetingConfig({
      meetingId: 'demo-meeting-id',
      mediaRegion: 'us-east-1',
      attendeeId: 'demo-attendee-id',
      joinToken: 'demo-join-token'
    });
  }, []);

  const handleDeviceInitialization = (success: boolean) => {
    console.log('Device initialization result:', success);
    setIsDevicesInitialized(success);
  };

  const tabStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '12px 16px',
    backgroundColor: isActive ? '#007bff' : '#e9ecef',
    color: isActive ? 'white' : '#495057',
    border: 'none',
    borderRadius: '6px 6px 0 0',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    marginRight: '5px',
    transition: 'all 0.2s ease'
  });

  const containerStyle: React.CSSProperties = {
    padding: '40px',
    fontFamily: 'system-ui',
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh'
  };

  return (
    <MeetingProvider>
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#232f3e', marginBottom: '10px', fontSize: '2.5rem' }}>
            🚀 Enhanced Device Setup & Testing
          </h1>
          <p style={{ color: '#666', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
            Professional-grade device testing and configuration using Amazon Chime SDK Component Library
          </p>
          <div style={{ 
            marginTop: '15px', 
            padding: '10px 20px', 
            backgroundColor: isDevicesInitialized ? '#d4edda' : '#fff3cd', 
            borderRadius: '6px',
            display: 'inline-block',
            fontSize: '14px',
            color: isDevicesInitialized ? '#155724' : '#856404',
            border: `1px solid ${isDevicesInitialized ? '#c3e6cb' : '#ffeaa7'}`
          }}>
            {isDevicesInitialized ? 
              '✅ Device initialization complete - Enhanced components ready!' :
              '⏳ Initializing device management system...'
            }
          </div>
        </div>

        {/* Enhanced Tab Navigation */}
        <div style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '5px' }}>
          <button 
            style={tabStyle(activeTab === 'video')}
            onClick={() => setActiveTab('video')}
          >
            📹 Enhanced Camera
          </button>
          <button 
            style={tabStyle(activeTab === 'audio')}
            onClick={() => setActiveTab('audio')}
          >
            🎤 Enhanced Audio
          </button>
          <button 
            style={tabStyle(activeTab === 'devices')}
            onClick={() => setActiveTab('devices')}
          >
            ⚙️ Device Management
          </button>
          <button 
            style={tabStyle(activeTab === 'meeting')}
            onClick={() => setActiveTab('meeting')}
          >
            👥 Video Grid
          </button>
          <button 
            style={tabStyle(activeTab === 'share')}
            onClick={() => setActiveTab('share')}
          >
            🖥️ Screen Share
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
          borderRadius: '0 12px 12px 12px',
          backgroundColor: 'white',
          padding: '30px',
          minHeight: '500px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          {isClient && (
            <>
              {/* Enhanced components need DeviceInitializer */}
              {(activeTab === 'video' || activeTab === 'audio' || activeTab === 'devices' || activeTab === 'meeting' || activeTab === 'share') && (
                <DeviceInitializer onInitialized={handleDeviceInitialization}>
                  {activeTab === 'video' && (
            <div>
              <EnhancedVideoInputControl 
                width={500} 
                height={375}
                showControls={true}
                showBackgroundBlur={true}
                style={{ margin: '0 auto' }}
              />
              
              <div style={{ 
                marginTop: '30px', 
                padding: '20px', 
                backgroundColor: '#e8f4fd',
                borderRadius: '8px',
                border: '1px solid #bee5eb'
              }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#0c5460' }}>🚀 Enhanced Camera Features:</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                  <div>
                    <strong>✅ Professional Controls:</strong>
                    <ul style={{ margin: '5px 0', paddingLeft: '20px', fontSize: '14px' }}>
                      <li>One-click camera toggle</li>
                      <li>Device selection dropdown</li>
                      <li>Background blur toggle</li>
                      <li>Real-time preview</li>
                    </ul>
                  </div>
                  <div>
                    <strong>🎨 Enhanced UI:</strong>
                    <ul style={{ margin: '5px 0', paddingLeft: '20px', fontSize: '14px' }}>
                      <li>Responsive design</li>
                      <li>Status indicators</li>
                      <li>Error handling</li>
                      <li>Loading states</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audio' && isClient && (
            <div>
              <EnhancedAudioInputControl 
                showVoiceFocus={true}
                showOutputControl={true}
                showLevelMeter={true}
                style={{ margin: '0 auto' }}
              />
              
              <div style={{ 
                marginTop: '30px', 
                padding: '20px', 
                backgroundColor: '#fff3cd',
                borderRadius: '8px',
                border: '1px solid #ffeaa7'
              }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#856404' }}>🎵 Enhanced Audio Features:</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                  <div>
                    <strong>🎤 Advanced Controls:</strong>
                    <ul style={{ margin: '5px 0', paddingLeft: '20px', fontSize: '14px' }}>
                      <li>Microphone device selection</li>
                      <li>Speaker device selection</li>
                      <li>Voice Focus (noise suppression)</li>
                      <li>Real-time audio level meter</li>
                    </ul>
                  </div>
                  <div>
                    <strong>🔊 Professional Audio:</strong>
                    <ul style={{ margin: '5px 0', paddingLeft: '20px', fontSize: '14px' }}>
                      <li>Echo cancellation</li>
                      <li>Automatic gain control</li>
                      <li>Noise suppression</li>
                      <li>Audio quality optimization</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'devices' && isClient && (
            <div>
              <EnhancedDeviceSelection 
                showQualitySettings={true}
                showBackgroundBlur={true}
                orientation="vertical"
                style={{ margin: '0 auto' }}
              />
              
              <div style={{ 
                marginTop: '30px', 
                padding: '20px', 
                backgroundColor: '#f8d7da',
                borderRadius: '8px',
                border: '1px solid #f5c6cb'
              }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#721c24' }}>⚙️ Comprehensive Device Management:</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                  <div>
                    <strong>📱 All Devices:</strong>
                    <ul style={{ margin: '5px 0', paddingLeft: '20px', fontSize: '14px' }}>
                      <li>Camera selection & preview</li>
                      <li>Microphone selection & testing</li>
                      <li>Speaker selection & testing</li>
                      <li>Video quality settings</li>
                    </ul>
                  </div>
                  <div>
                    <strong>🎯 Smart Features:</strong>
                    <ul style={{ margin: '5px 0', paddingLeft: '20px', fontSize: '14px' }}>
                      <li>Automatic device detection</li>
                      <li>Permission handling</li>
                      <li>Background blur controls</li>
                      <li>Performance optimization</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'meeting' && isClient && (
            <div>
              <EnhancedVideoTileGrid 
                showControls={true}
                showLocalVideo={true}
                layout="featured"
                style={{ margin: '0 auto' }}
              />
              
              <div style={{ 
                marginTop: '30px', 
                padding: '20px', 
                backgroundColor: '#d1ecf1',
                borderRadius: '8px',
                border: '1px solid #bee5eb'
              }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#0c5460' }}>👥 Multi-Participant Video Features:</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                  <div>
                    <strong>📺 Video Grid:</strong>
                    <ul style={{ margin: '5px 0', paddingLeft: '20px', fontSize: '14px' }}>
                      <li>Responsive layout (featured/grid)</li>
                      <li>Automatic tile management</li>
                      <li>Local video preview</li>
                      <li>Participant status indicators</li>
                    </ul>
                  </div>
                  <div>
                    <strong>🎮 Meeting Controls:</strong>
                    <ul style={{ margin: '5px 0', paddingLeft: '20px', fontSize: '14px' }}>
                      <li>Integrated control bar</li>
                      <li>Camera/microphone toggles</li>
                      <li>Background blur control</li>
                      <li>Screen sharing button</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'share' && isClient && (
            <div>
              <EnhancedContentShare 
                showControls={true}
                style={{ margin: '0 auto' }}
              />
              
              <div style={{ 
                marginTop: '30px', 
                padding: '20px', 
                backgroundColor: '#e2e3e5',
                borderRadius: '8px',
                border: '1px solid #ced4da'
              }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#495057' }}>🖥️ Screen Sharing Capabilities:</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                  <div>
                    <strong>📤 Share Options:</strong>
                    <ul style={{ margin: '5px 0', paddingLeft: '20px', fontSize: '14px' }}>
                      <li>Entire screen sharing</li>
                      <li>Specific window sharing</li>
                      <li>Browser tab sharing</li>
                      <li>Audio sharing (when supported)</li>
                    </ul>
                  </div>
                  <div>
                    <strong>⚡ Advanced Features:</strong>
                    <ul style={{ margin: '5px 0', paddingLeft: '20px', fontSize: '14px' }}>
                      <li>High-quality content transmission</li>
                      <li>Automatic layout adjustment</li>
                      <li>One-click start/stop</li>
                      <li>Multiple share support</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
                  )}
                </DeviceInitializer>
              )}
              
              {/* Diagnostics doesn't need Device Library context */}
              {activeTab === 'diagnostics' && (
            <div>
              <MediaDiagnostics style={{ margin: '0' }} />
              
              <div style={{ 
                marginTop: '20px', 
                padding: '20px', 
                backgroundColor: '#e8f4fd',
                borderRadius: '8px',
                border: '1px solid #bee5eb'
              }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#0c5460' }}>🔍 System Diagnostics & Compatibility:</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                  <div>
                    <strong>🔧 Browser Support:</strong>
                    <ul style={{ margin: '5px 0', paddingLeft: '20px', fontSize: '14px' }}>
                      <li>WebRTC capabilities</li>
                      <li>Media device access</li>
                      <li>getUserMedia support</li>
                      <li>Screen capture API</li>
                    </ul>
                  </div>
                  <div>
                    <strong>📊 Performance Check:</strong>
                    <ul style={{ margin: '5px 0', paddingLeft: '20px', fontSize: '14px' }}>
                      <li>Network connectivity</li>
                      <li>Device permissions</li>
                      <li>Audio/video codecs</li>
                      <li>System requirements</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
              )}
            </>
          )}
        </div>

        {/* Comparison Section */}
        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          backgroundColor: '#fff3cd',
          borderRadius: '8px',
          border: '1px solid #ffeaa7'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#856404' }}>⚡ Enhanced vs Basic Components Comparison</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div>
              <h4 style={{ color: '#155724', margin: '0 0 10px 0' }}>✅ Enhanced Components (Current)</h4>
              <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '14px', lineHeight: '1.6' }}>
                <li>Amazon Chime SDK Component Library integration</li>
                <li>Built-in device selection with dropdowns</li>
                <li>Background blur and video effects</li>
                <li>Voice Focus noise suppression</li>
                <li>Professional meeting controls</li>
                <li>Responsive video grid layouts</li>
                <li>Comprehensive error handling</li>
                <li>Production-ready components</li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: '#721c24', margin: '0 0 10px 0' }}>📱 Basic Components (Previous)</h4>
              <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '14px', lineHeight: '1.6' }}>
                <li>Custom HTML5 media implementation</li>
                <li>Manual device enumeration</li>
                <li>Basic camera/microphone testing</li>
                <li>Simple audio level visualization</li>
                <li>Custom error handling</li>
                <li>Single-participant focus</li>
                <li>Limited browser compatibility</li>
                <li>Development/testing focused</li>
              </ul>
            </div>
          </div>
        </div>

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
            borderRadius: '6px',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            ⬅️ Back to Home
          </a>
          
          <a href="/devices" style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#6c757d',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            📱 View Basic Components
          </a>
          
          <a href="/meeting" style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#ff9900',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            🎥 Continue to Meeting
          </a>

          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
          >
            🔄 Refresh Components
          </button>
        </div>
      </div>
    </MeetingProvider>
  );
}
