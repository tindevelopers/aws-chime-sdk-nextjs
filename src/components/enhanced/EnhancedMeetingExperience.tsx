import React, { useState } from 'react';
// No longer using Component Library hooks to avoid "no input video device chosen" warnings

import EnhancedMeetingControls from './EnhancedMeetingControls';
import StandaloneMeetingControls from './StandaloneMeetingControls';
import StandaloneVideoGrid from './StandaloneVideoGrid';
import EnhancedMeetingRoster from './EnhancedMeetingRoster';
import EnhancedMeetingChat from './EnhancedMeetingChat';

interface EnhancedMeetingExperienceProps {
  currentUserId?: string;
  currentUserName?: string;
  onLeaveMeeting?: () => void;
  showAdvancedControls?: boolean;
  style?: React.CSSProperties;
}

export default function EnhancedMeetingExperience({
  currentUserId = 'current-user',
  currentUserName = 'You',
  onLeaveMeeting,
  showAdvancedControls = true,
  style = {}
}: EnhancedMeetingExperienceProps) {
  const [showRoster, setShowRoster] = useState(false);
  const [showChat, setShowChat] = useState(false);
  
  // Mock data for demo purposes (no Component Library hooks)
  const [participantCount, setParticipantCount] = useState(3);
  const isVideoEnabled = false;

  const containerStyle: React.CSSProperties = {
    width: '100vw',
    height: '100vh',
    backgroundColor: '#1a1a1a',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'relative',
    ...style
  };

  const mainContentStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    position: 'relative',
    overflow: 'hidden'
  };

  const videoAreaStyle: React.CSSProperties = {
    flex: 1,
    position: 'relative',
    backgroundColor: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const sidebarStyle: React.CSSProperties = {
    width: '320px',
    backgroundColor: 'white',
    borderLeft: '1px solid #e0e0e0',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  };

  const controlsStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 10
  };

  const noVideoPlaceholderStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '18px',
    textAlign: 'center',
    padding: '40px'
  };

  // participantCount is now a state variable

  const NoVideoView = () => (
    <div style={noVideoPlaceholderStyle}>
      <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎥</div>
      <div style={{ marginBottom: '15px', fontSize: '24px', fontWeight: 'bold' }}>
        Meeting in Progress
      </div>
      <div style={{ fontSize: '16px', opacity: 0.8, maxWidth: '400px', lineHeight: '1.5' }}>
        {participantCount === 0 
          ? 'You are the only participant. Others will appear when they join with video.' 
          : `${participantCount} participant${participantCount !== 1 ? 's' : ''} in the meeting. Turn on your camera to see the video grid.`
        }
      </div>
      
      {/* Meeting Info */}
      <div style={{ 
        marginTop: '30px', 
        padding: '15px 20px',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <div style={{ marginBottom: '8px' }}>
          <strong>Meeting Status:</strong> Active
        </div>
        <div style={{ marginBottom: '8px' }}>
          <strong>Your Status:</strong> {isVideoEnabled ? 'Video On' : 'Audio Only'}
        </div>
        <div>
          <strong>Participants:</strong> {participantCount} connected
        </div>
      </div>
    </div>
  );

  const handleToggleRoster = () => {
    setShowRoster(!showRoster);
    // Close chat if roster is opening
    if (!showRoster && showChat) {
      setShowChat(false);
    }
  };

  const handleToggleChat = () => {
    setShowChat(!showChat);
    // Close roster if chat is opening
    if (!showChat && showRoster) {
      setShowRoster(false);
    }
  };

  const handleCloseRoster = () => {
    setShowRoster(false);
  };

  const handleCloseChat = () => {
    setShowChat(false);
  };

  return (
    <div style={containerStyle}>
      {/* Meeting Status Bar */}
      <div style={{
        padding: '10px 20px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '14px'
      }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '8px', 
              height: '8px', 
              backgroundColor: '#28a745', 
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }} />
            <span>Meeting Active</span>
          </div>
          
          <div>
            👥 {participantCount} participant{participantCount !== 1 ? 's' : ''}
          </div>
          
          <div>
            🕐 {new Date().toLocaleTimeString()}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {showRoster && (
            <span style={{ fontSize: '12px', opacity: 0.8 }}>📋 Roster Open</span>
          )}
          {showChat && (
            <span style={{ fontSize: '12px', opacity: 0.8 }}>💬 Chat Open</span>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div style={mainContentStyle}>
        {/* Video Area */}
        <div style={videoAreaStyle}>
          <div style={{ 
            width: '100%', 
            height: '100%' 
          }}>
            <StandaloneVideoGrid 
              layout="featured"
            />
          </div>

          {/* Meeting Controls Overlay */}
          <div style={controlsStyle}>
            <StandaloneMeetingControls
              layout="undocked-horizontal"
              showLabels={true}
              showAdvancedControls={showAdvancedControls}
              showRosterToggle={true}
              showChatToggle={true}
              onRosterToggle={handleToggleRoster}
              onChatToggle={handleToggleChat}
              onLeaveMeeting={onLeaveMeeting}
            />
          </div>
        </div>

        {/* Sidebar - Roster or Chat */}
        {(showRoster || showChat) && (
          <div style={sidebarStyle}>
            {showRoster && (
              <EnhancedMeetingRoster
                title="Participants"
                showSearch={true}
                showCloseButton={true}
                onClose={handleCloseRoster}
                width={320}
                height={400}
                style={{ 
                  height: '100%', 
                  borderRadius: '0',
                  border: 'none',
                  boxShadow: 'none'
                }}
              />
            )}

            {showChat && (
              <EnhancedMeetingChat
                title="Meeting Chat"
                currentUserId={currentUserId}
                currentUserName={currentUserName}
                showCloseButton={true}
                onClose={handleCloseChat}
                width={320}
                height={400}
                style={{ 
                  height: '100%', 
                  borderRadius: '0',
                  border: 'none',
                  boxShadow: 'none'
                }}
              />
            )}
          </div>
        )}
      </div>

      {/* Footer Information */}
      <div style={{
        padding: '8px 20px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        fontSize: '12px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px'
      }}>
        <span>🔒 End-to-end encrypted</span>
        <span>📡 Powered by Amazon Chime SDK</span>
        <span>⚡ Enhanced meeting experience</span>
      </div>

      {/* CSS for pulse animation */}
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
