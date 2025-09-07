import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  MeetingProvider,
  lightTheme,
  darkTheme 
} from 'amazon-chime-sdk-component-library-react';

// Dynamically import enhanced meeting components
const EnhancedMeetingExperience = dynamic(() => import('../src/components/enhanced/EnhancedMeetingExperience'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#1a1a1a',
      color: 'white',
      fontSize: '18px'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚀</div>
        <div>Loading Enhanced Meeting Experience...</div>
        <div style={{ fontSize: '14px', marginTop: '10px', opacity: 0.7 }}>
          Initializing components and providers
        </div>
      </div>
    </div>
  )
});

const EnhancedMeetingControls = dynamic(() => import('../src/components/enhanced/EnhancedMeetingControls'), {
  ssr: false,
  loading: () => <div style={{ textAlign: 'center', padding: '20px' }}>Loading controls...</div>
});

const StandaloneMeetingControls = dynamic(() => import('../src/components/enhanced/StandaloneMeetingControls'), {
  ssr: false,
  loading: () => <div style={{ textAlign: 'center', padding: '20px' }}>Loading standalone controls...</div>
});

const EnhancedMeetingRoster = dynamic(() => import('../src/components/enhanced/EnhancedMeetingRoster'), {
  ssr: false,
  loading: () => <div style={{ textAlign: 'center', padding: '20px' }}>Loading roster...</div>
});

const EnhancedMeetingChat = dynamic(() => import('../src/components/enhanced/EnhancedMeetingChat'), {
  ssr: false,
  loading: () => <div style={{ textAlign: 'center', padding: '20px' }}>Loading chat...</div>
});

export default function EnhancedMeetingPage() {
  const [isClient, setIsClient] = useState(false);
  type DemoMode = 'full' | 'controls' | 'roster' | 'chat';
  const [demoMode, setDemoMode] = useState<DemoMode>('full');
  const [currentUser, setCurrentUser] = useState({
    id: `user-${Date.now()}`,
    name: 'Demo User'
  });
  const [theme, setTheme] = useState(lightTheme);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLeaveMeeting = () => {
    if (confirm('Are you sure you want to leave the meeting?')) {
      // In a real implementation, this would clean up the meeting session
      window.location.href = '/';
    }
  };

  const containerStyle: React.CSSProperties = {
    width: '100vw',
    height: '100vh',
    backgroundColor: (demoMode as string) === 'full' ? '#1a1a1a' : '#f8f9fa',
    overflow: 'hidden'
  };

  if (!isClient) {
    return (
      <div style={containerStyle}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: '100%',
          color: 'white',
          fontSize: '18px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
            <div>Initializing Meeting Components...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <MeetingProvider>
      <div style={containerStyle}>
        {(demoMode as string) === 'full' ? (
          // Full Meeting Experience
          <EnhancedMeetingExperience
            currentUserId={currentUser.id}
            currentUserName={currentUser.name}
            onLeaveMeeting={handleLeaveMeeting}
            showAdvancedControls={true}
          />
        ) : (
          // Component Demo Mode
          <div style={{ 
            padding: '20px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Demo Navigation */}
            <div style={{
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ margin: '0 0 15px 0', color: '#333' }}>
                🎛️ Enhanced Meeting Components Demo
              </h2>
              
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setDemoMode('full')}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: (demoMode as string) === 'full' ? '#007bff' : '#e9ecef',
                    color: (demoMode as string) === 'full' ? 'white' : '#495057',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  🚀 Full Experience
                </button>
                <button
                  onClick={() => setDemoMode('controls')}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: demoMode === 'controls' ? '#007bff' : '#e9ecef',
                    color: demoMode === 'controls' ? 'white' : '#495057',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  🎮 Controls Only
                </button>
                <button
                  onClick={() => setDemoMode('roster')}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: demoMode === 'roster' ? '#007bff' : '#e9ecef',
                    color: demoMode === 'roster' ? 'white' : '#495057',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  👥 Roster Only
                </button>
                <button
                  onClick={() => setDemoMode('chat')}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: demoMode === 'chat' ? '#007bff' : '#e9ecef',
                    color: demoMode === 'chat' ? 'white' : '#495057',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  💬 Chat Only
                </button>
              </div>

              <div style={{ marginTop: '10px' }}>
                <a href="/" style={{
                  color: '#007bff',
                  textDecoration: 'none',
                  fontSize: '14px'
                }}>
                  ← Back to Home
                </a>
              </div>
            </div>

            {/* Component Display */}
            <div style={{ 
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '20px'
            }}>
              {demoMode === 'controls' && (
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ marginBottom: '20px', color: '#333' }}>Enhanced Meeting Controls</h3>
                  <StandaloneMeetingControls
                    layout="undocked-horizontal"
                    showLabels={true}
                    showAdvancedControls={true}
                    showRosterToggle={true}
                    showChatToggle={true}
                    onRosterToggle={() => alert('Roster toggle clicked!')}
                    onChatToggle={() => alert('Chat toggle clicked!')}
                    onLeaveMeeting={() => alert('Leave meeting clicked!')}
                  />
                  
                  <div style={{ 
                    marginTop: '30px', 
                    maxWidth: '600px', 
                    textAlign: 'left',
                    padding: '20px',
                    backgroundColor: '#e8f4f8',
                    borderRadius: '8px'
                  }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#0c5460' }}>✨ Standalone Features:</h4>
                    <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '14px' }}>
                      <li>✅ Audio/Video controls with direct device access</li>
                      <li>✅ Real device selection dropdowns</li>
                      <li>✅ Functional screen sharing</li>
                      <li>✅ Working camera and microphone toggle</li>
                      <li>✅ Participant roster toggle</li>
                      <li>✅ Meeting chat toggle</li>
                      <li>✅ Leave meeting with confirmation</li>
                      <li>✅ Real-time status indicators and animations</li>
                      <li>✅ No meeting session required - works immediately!</li>
                    </ul>
                  </div>
                </div>
              )}

              {demoMode === 'roster' && (
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ marginBottom: '20px', color: '#333' }}>Enhanced Meeting Roster</h3>
                  <EnhancedMeetingRoster
                    title="Demo Participants"
                    showSearch={true}
                    showCloseButton={true}
                    onClose={() => alert('Roster closed!')}
                  />
                  
                  <div style={{ 
                    marginTop: '30px', 
                    maxWidth: '600px', 
                    textAlign: 'left',
                    padding: '20px',
                    backgroundColor: '#fff3cd',
                    borderRadius: '8px'
                  }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>Features:</h4>
                    <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '14px' }}>
                      <li>Real-time participant list</li>
                      <li>Search functionality</li>
                      <li>Present/Left participant grouping</li>
                      <li>Audio/Video status indicators</li>
                      <li>Participant count badges</li>
                      <li>Running late messages</li>
                      <li>Menu actions for each participant</li>
                      <li>Responsive design</li>
                    </ul>
                  </div>
                </div>
              )}

              {demoMode === 'chat' && (
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ marginBottom: '20px', color: '#333' }}>Enhanced Meeting Chat</h3>
                  <EnhancedMeetingChat
                    title="Demo Chat"
                    currentUserId={currentUser.id}
                    currentUserName={currentUser.name}
                    showCloseButton={true}
                    onClose={() => alert('Chat closed!')}
                  />
                  
                  <div style={{ 
                    marginTop: '30px', 
                    maxWidth: '600px', 
                    textAlign: 'left',
                    padding: '20px',
                    backgroundColor: '#f8d7da',
                    borderRadius: '8px'
                  }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#721c24' }}>Features:</h4>
                    <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '14px' }}>
                      <li>Real-time messaging using Chime SDK data messages</li>
                      <li>Incoming/Outgoing message bubbles</li>
                      <li>Typing indicators</li>
                      <li>Message timestamps</li>
                      <li>Auto-scroll to new messages</li>
                      <li>Send on Enter key</li>
                      <li>Message history</li>
                      <li>Professional chat UI</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </MeetingProvider>
  );
}
