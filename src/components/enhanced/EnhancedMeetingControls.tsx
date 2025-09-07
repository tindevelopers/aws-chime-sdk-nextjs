import React from 'react';
import { 
  ControlBar,
  ControlBarButton,
  AudioInputControl,
  AudioInputVFControl,
  VideoInputControl,
  VideoInputBackgroundBlurControl,
  AudioOutputControl,
  ContentShareControl
} from 'amazon-chime-sdk-component-library-react';
import { 
  useToggleLocalMute,
  useLocalVideo,
  useContentShareState,
  useMeetingManager 
} from 'amazon-chime-sdk-component-library-react';
import { Phone, Chat } from 'amazon-chime-sdk-component-library-react';

interface EnhancedMeetingControlsProps {
  layout?: 'top' | 'bottom' | 'undocked-horizontal' | 'undocked-vertical';
  showLabels?: boolean;
  showAdvancedControls?: boolean;
  showRosterToggle?: boolean;
  showChatToggle?: boolean;
  onRosterToggle?: () => void;
  onChatToggle?: () => void;
  onLeaveMeeting?: () => void;
  style?: React.CSSProperties;
}

export default function EnhancedMeetingControls({
  layout = 'undocked-horizontal',
  showLabels = true,
  showAdvancedControls = true,
  showRosterToggle = true,
  showChatToggle = true,
  onRosterToggle,
  onChatToggle,
  onLeaveMeeting,
  style = {}
}: EnhancedMeetingControlsProps) {
  const { muted } = useToggleLocalMute();
  const { isVideoEnabled } = useLocalVideo();
  const { isContentShareActive } = useContentShareState();
  const meetingManager = useMeetingManager();

  const handleLeaveMeeting = () => {
    if (onLeaveMeeting) {
      onLeaveMeeting();
    } else {
      meetingManager.leave();
    }
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    ...style
  };

  return (
    <div style={containerStyle}>
      <ControlBar
        layout={layout}
        showLabels={showLabels}
        responsive={true}
        style={{
          backgroundColor: 'transparent',
          boxShadow: 'none',
          border: 'none'
        }}
      >
        {/* Core Audio/Video Controls */}
        <AudioInputControl 
          label="Microphone"
        />
        
        <VideoInputControl 
          label="Camera"
        />

        {/* Advanced Audio Controls */}
        {showAdvancedControls && (
          <>
            <AudioInputVFControl 
              label="Voice Focus"
            />
            
            <AudioOutputControl 
              label="Speaker"
            />
          </>
        )}

        {/* Video Effects */}
        {showAdvancedControls && (
          <VideoInputBackgroundBlurControl 
            label="Background Blur"
          />
        )}

        {/* Content Sharing */}
        <ContentShareControl 
          label="Share Screen"
        />

        {/* Roster Toggle */}
        {showRosterToggle && (
          <ControlBarButton
            icon={<div style={{ fontSize: '20px' }}>👥</div>}
            onClick={onRosterToggle}
            label="Participants"
            data-tooltip="Show/hide participant roster"
            data-tooltip-position="top"
          />
        )}

        {/* Chat Toggle */}
        {showChatToggle && (
          <ControlBarButton
            icon={<Chat />}
            onClick={onChatToggle}
            label="Chat"
            data-tooltip="Show/hide meeting chat"
            data-tooltip-position="top"
          />
        )}

        {/* Leave Meeting */}
        <ControlBarButton
          icon={<Phone />}
          onClick={handleLeaveMeeting}
          label="Leave"
          data-tooltip="Leave meeting"
          data-tooltip-position="top"
          style={{
            backgroundColor: '#dc3545'
          }}
        />
      </ControlBar>

      {/* Status Indicators */}
      {showLabels && (
        <div style={{
          display: 'flex',
          gap: '8px',
          marginLeft: '15px',
          fontSize: '12px',
          color: '#666'
        }}>
          <div style={{
            padding: '4px 8px',
            borderRadius: '12px',
            backgroundColor: muted ? '#f8d7da' : '#d4edda',
            border: `1px solid ${muted ? '#f5c6cb' : '#c3e6cb'}`,
            color: muted ? '#721c24' : '#155724'
          }}>
            {muted ? '🔇 Muted' : '🎤 Live'}
          </div>
          
          <div style={{
            padding: '4px 8px',
            borderRadius: '12px',
            backgroundColor: isVideoEnabled ? '#d4edda' : '#e2e3e5',
            border: `1px solid ${isVideoEnabled ? '#c3e6cb' : '#ced4da'}`,
            color: isVideoEnabled ? '#155724' : '#495057'
          }}>
            {isVideoEnabled ? '📹 Video On' : '📱 Video Off'}
          </div>

          {isContentShareActive && (
            <div style={{
              padding: '4px 8px',
              borderRadius: '12px',
              backgroundColor: '#d1ecf1',
              border: '1px solid #bee5eb',
              color: '#0c5460'
            }}>
              🖥️ Sharing
            </div>
          )}
        </div>
      )}
    </div>
  );
}
