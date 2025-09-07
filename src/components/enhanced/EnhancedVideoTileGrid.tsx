import React from 'react';
import { 
  VideoTileGrid,
  LocalVideo,
  ControlBar,
  VideoInputControl,
  AudioInputControl,
  ContentShareControl,
  VideoInputBackgroundBlurControl
} from 'amazon-chime-sdk-component-library-react';
import { useRemoteVideoTileState, useLocalVideo } from 'amazon-chime-sdk-component-library-react';

interface EnhancedVideoTileGridProps {
  showControls?: boolean;
  showLocalVideo?: boolean;
  layout?: 'featured' | 'standard';
  style?: React.CSSProperties;
}

export default function EnhancedVideoTileGrid({
  showControls = true,
  showLocalVideo = true,
  layout = 'featured',
  style = {}
}: EnhancedVideoTileGridProps) {
  const { tiles: remoteVideoTiles } = useRemoteVideoTileState();
  const { isVideoEnabled } = useLocalVideo();

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    minHeight: '400px',
    ...style
  };

  const videoGridContainerStyle: React.CSSProperties = {
    flex: 1,
    minHeight: '300px',
    backgroundColor: '#000',
    borderRadius: '8px',
    overflow: 'hidden',
    position: 'relative'
  };

  const noVideoPlaceholderStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: 'white',
    fontSize: '16px',
    textAlign: 'center',
    padding: '40px'
  };

  const controlsStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    padding: '15px',
    backgroundColor: '#e9ecef',
    borderRadius: '8px',
    flexWrap: 'wrap'
  };

  const statusStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#666',
    textAlign: 'center',
    padding: '8px 12px',
    backgroundColor: '#fff3cd',
    border: '1px solid #ffeaa7',
    borderRadius: '4px'
  };

  // Custom no remote video view
  const NoRemoteVideoView = () => (
    <div style={noVideoPlaceholderStyle}>
      <div style={{ fontSize: '48px', marginBottom: '20px' }}>👥</div>
      <div style={{ marginBottom: '10px', fontSize: '18px', fontWeight: 'bold' }}>
        Waiting for participants...
      </div>
      <div style={{ fontSize: '14px', opacity: 0.8 }}>
        Other participants will appear here when they join with video
      </div>
      {showLocalVideo && isVideoEnabled && (
        <div style={{ 
          marginTop: '20px', 
          fontSize: '12px', 
          padding: '8px 12px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: '4px'
        }}>
          ✅ Your camera is active
        </div>
      )}
    </div>
  );

  return (
    <div style={containerStyle}>
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <h3 style={{ margin: '0', color: '#333' }}>📺 Video Conference</h3>
        <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
          Multi-participant video grid with enhanced controls
        </p>
      </div>

      {/* Video Grid Container */}
      <div style={videoGridContainerStyle}>
        <VideoTileGrid 
          layout={layout}
          noRemoteVideoView={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>No remote participants</div>}
        />
      </div>

      {/* Meeting Status */}
      <div style={statusStyle}>
        📊 <strong>Participants:</strong> {remoteVideoTiles.length + 1} total
        {remoteVideoTiles.length === 0 && ' (you)'}
        {remoteVideoTiles.length === 1 && ' (you + 1 other)'}
        {remoteVideoTiles.length > 1 && ` (you + ${remoteVideoTiles.length} others)`}
        {isVideoEnabled ? ' • 📹 Your video: ON' : ' • 📹 Your video: OFF'}
      </div>

      {/* Enhanced Meeting Controls */}
      {showControls && (
        <div style={controlsStyle}>
          <VideoInputControl 
            label="Camera"
          />
          
          <AudioInputControl 
            muteLabel="Mute"
            unmuteLabel="Unmute"
          />
          
          <VideoInputBackgroundBlurControl 
            backgroundBlurLabel="Background"
          />
          
          <ContentShareControl 
            label="Share Screen"
            pauseLabel="Pause"
            unpauseLabel="Resume"
          />
        </div>
      )}

      {/* Instructions */}
      <div style={{
        fontSize: '12px',
        color: '#666',
        textAlign: 'center',
        lineHeight: '1.4'
      }}>
        💡 <strong>Features:</strong> 
        {layout === 'featured' ? ' Featured speaker layout with' : ' Grid layout with'} 
        {' '}automatic video tile management, background blur, screen sharing, and responsive design.
        {remoteVideoTiles.length === 0 && ' Share your meeting link to invite participants.'}
      </div>
    </div>
  );
}
