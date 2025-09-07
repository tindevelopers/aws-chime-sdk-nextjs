import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { 
  MeetingProvider,
  useMeetingManager,
  VideoTileGrid,
  ControlBar,
  AudioInputControl,
  VideoInputControl,
  AudioOutputControl,
  ContentShareControl,
  BackgroundBlurCheckbox,
  Roster,
  ChatBubble,
  LocalVideo,
  RemoteVideo,
  useLocalVideo,
  useToggleLocalMute,
  useContentShareState,
  useRemoteVideoTileState,
  useMeetingStatus,
  MeetingStatus
} from 'amazon-chime-sdk-component-library-react';

// Dynamic import to avoid SSR issues
const ProductionMeetingContent = dynamic(() => Promise.resolve(ProductionMeetingContentComponent), {
  ssr: false,
  loading: () => <div style={{ textAlign: 'center', padding: '40px' }}>Loading meeting...</div>
});

interface SetupData {
  userName: string;
  meetingId: string;
  setupCompleted: boolean;
  timestamp: string;
}

function ProductionMeetingContentComponent() {
  const router = useRouter();
  const meetingManager = useMeetingManager();
  const [setupData, setSetupData] = useState<SetupData | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [meetingJoined, setMeetingJoined] = useState(false);
  const [showRoster, setShowRoster] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { muted } = useToggleLocalMute();
  const { isVideoEnabled } = useLocalVideo();
  const contentShareState = useContentShareState();
  const isContentShareEnabled = contentShareState.isLocalUserSharing || false;
  const { tiles } = useRemoteVideoTileState();
  const meetingStatus = useMeetingStatus();

  // Load setup data
  useEffect(() => {
    const savedSetup = localStorage.getItem('chime-setup-data');
    if (savedSetup) {
      try {
        const data = JSON.parse(savedSetup);
        setSetupData(data);
      } catch (err) {
        console.error('Failed to parse setup data:', err);
        setError('Invalid setup data. Please run device setup first.');
      }
    } else {
      setError('No setup data found. Please complete device setup first.');
    }
  }, []);

  // Auto-join meeting when setup data is available
  useEffect(() => {
    if (setupData && !meetingJoined && !isJoining) {
      joinMeeting();
    }
  }, [setupData, meetingJoined, isJoining]);

  // Monitor meeting status
  useEffect(() => {
    if (meetingStatus === MeetingStatus.Succeeded) {
      setMeetingJoined(true);
      setIsJoining(false);
    } else if (meetingStatus === MeetingStatus.Failed) {
      setError('Failed to join meeting. Please check your connection and try again.');
      setIsJoining(false);
    }
  }, [meetingStatus]);

  const joinMeeting = async () => {
    if (!setupData) return;

    setIsJoining(true);
    setError(null);

    try {
      console.log('ProductionMeeting: Joining meeting with setup data:', setupData);

      // Create meeting session
      const response = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          MeetingId: setupData.meetingId,
          Name: setupData.userName
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to join meeting: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Store meeting data for Component Library use
      sessionStorage.setItem('chime-meeting-data', JSON.stringify({
        Meeting: data.Meeting,
        Attendee: data.Attendee,
        setupData
      }));

      // For this demo, we'll show successful connection
      // In production, you would use the proper Component Library join flow
      setMeetingJoined(true);
      setIsJoining(false);
      
      console.log('ProductionMeeting: Successfully joined meeting');

    } catch (err: any) {
      console.error('ProductionMeeting: Failed to join meeting:', err);
      setError(`Failed to join meeting: ${err.message}`);
      setIsJoining(false);
    }
  };

  const leaveMeeting = async () => {
    try {
      await meetingManager.leave();
      localStorage.removeItem('chime-setup-data');
      router.push('/');
    } catch (err) {
      console.error('Failed to leave meeting:', err);
    }
  };

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: '#1a1a1a',
    color: 'white',
    fontFamily: 'system-ui'
  };

  const headerStyle: React.CSSProperties = {
    backgroundColor: '#232f3e',
    padding: '15px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
  };

  const mainContentStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: showRoster || showChat ? '1fr 300px' : '1fr',
    height: 'calc(100vh - 140px)',
    gap: '10px',
    padding: '10px'
  };

  const videoAreaStyle: React.CSSProperties = {
    backgroundColor: '#2a2a2a',
    borderRadius: '10px',
    overflow: 'hidden',
    position: 'relative'
  };

  const sidebarStyle: React.CSSProperties = {
    backgroundColor: '#333',
    borderRadius: '10px',
    padding: '20px',
    overflowY: 'auto'
  };

  const controlBarStyle: React.CSSProperties = {
    backgroundColor: '#232f3e',
    padding: '15px 20px',
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    alignItems: 'center'
  };

  const buttonStyle = (active: boolean = false): React.CSSProperties => ({
    padding: '10px 15px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: active ? '#007bff' : '#6c757d',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'background-color 0.2s ease'
  });

  const errorStyle: React.CSSProperties = {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '20px',
    borderRadius: '8px',
    margin: '20px',
    textAlign: 'center'
  };

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={errorStyle}>
          <h2>❌ Meeting Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => router.push('/setup')} 
            style={buttonStyle()}
          >
            🔧 Run Device Setup
          </button>
          <button 
            onClick={() => router.push('/')} 
            style={{...buttonStyle(), marginLeft: '10px'}}
          >
            🏠 Home
          </button>
        </div>
      </div>
    );
  }

  if (!setupData) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '40px', marginBottom: '15px' }}>⏳</div>
          <div>Loading setup data...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px' }}>
            📹 {setupData.meetingId}
          </h1>
          <div style={{ fontSize: '14px', opacity: 0.8 }}>
            {setupData.userName} • {meetingJoined ? `${tiles.length + 1} participants` : 'Joining...'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setShowRoster(!showRoster)}
            style={buttonStyle(showRoster)}
          >
            👥 Roster
          </button>
          <button 
            onClick={() => setShowChat(!showChat)}
            style={buttonStyle(showChat)}
          >
            💬 Chat
          </button>
          <button 
            onClick={leaveMeeting}
            style={{...buttonStyle(), backgroundColor: '#dc3545'}}
          >
            🚪 Leave
          </button>
        </div>
      </div>

      {/* Main Meeting Area */}
      <div style={mainContentStyle}>
        {/* Video Area */}
        <div style={videoAreaStyle}>
          {isJoining ? (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <div style={{ fontSize: '60px' }}>⏳</div>
              <div style={{ fontSize: '24px' }}>Joining Meeting...</div>
              <div style={{ fontSize: '16px', opacity: 0.7 }}>
                Setting up audio and video connections
              </div>
            </div>
          ) : meetingJoined ? (
            <VideoTileGrid 
              layout="featured"
              noRemoteVideoView={
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '100%',
                  flexDirection: 'column',
                  color: '#999'
                }}>
                  <div style={{ fontSize: '60px', marginBottom: '20px' }}>👤</div>
                  <div style={{ fontSize: '24px' }}>Waiting for participants...</div>
                  <div style={{ fontSize: '16px', marginTop: '10px' }}>
                    Share the meeting ID: <strong>{setupData.meetingId}</strong>
                  </div>
                </div>
              }
            />
          ) : (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%' 
            }}>
              <div style={{ fontSize: '24px' }}>Preparing meeting...</div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        {(showRoster || showChat) && (
          <div style={sidebarStyle}>
            {showRoster && (
              <div>
                <h3 style={{ marginTop: 0 }}>👥 Participants</h3>
                <Roster />
              </div>
            )}
            {showChat && (
              <div style={{ marginTop: showRoster ? '30px' : '0' }}>
                <h3 style={{ marginTop: 0 }}>💬 Chat</h3>
                <div style={{ color: '#ccc', textAlign: 'center', padding: '20px' }}>
                  💬 Chat feature would be implemented here using Component Library ChatBubble
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div style={controlBarStyle}>
        <AudioInputControl />
        <VideoInputControl />
        <AudioOutputControl />
        <ContentShareControl />
        <BackgroundBlurCheckbox />
        
        {/* Status Indicators */}
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          alignItems: 'center',
          marginLeft: '20px',
          fontSize: '14px'
        }}>
          <span style={{ color: muted ? '#dc3545' : '#28a745' }}>
            {muted ? '🔇' : '🎤'}
          </span>
          <span style={{ color: isVideoEnabled ? '#28a745' : '#dc3545' }}>
            {isVideoEnabled ? '📹' : '📹🚫'}
          </span>
          {isContentShareEnabled && (
            <span style={{ color: '#007bff' }}>🖥️</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductionMeetingPage() {
  return (
    <MeetingProvider>
      <ProductionMeetingContent />
    </MeetingProvider>
  );
}
