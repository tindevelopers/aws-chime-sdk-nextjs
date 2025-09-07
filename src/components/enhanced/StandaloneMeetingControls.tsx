import React, { useState, useEffect } from 'react';

interface StandaloneMeetingControlsProps {
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

export default function StandaloneMeetingControls({
  layout = 'undocked-horizontal',
  showLabels = true,
  showAdvancedControls = true,
  showRosterToggle = true,
  showChatToggle = true,
  onRosterToggle,
  onChatToggle,
  onLeaveMeeting,
  style = {}
}: StandaloneMeetingControlsProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [selectedMicrophone, setSelectedMicrophone] = useState<string>('');
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>('');
  const [devices, setDevices] = useState<{
    cameras: MediaDeviceInfo[];
    microphones: MediaDeviceInfo[];
    speakers: MediaDeviceInfo[];
  }>({ cameras: [], microphones: [], speakers: [] });

  // Initialize devices
  useEffect(() => {
    const initializeDevices = async () => {
      try {
        // Request permissions
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        stream.getTracks().forEach(track => track.stop());

        // Get device list
        const deviceList = await navigator.mediaDevices.enumerateDevices();
        
        const cameras = deviceList.filter(device => device.kind === 'videoinput');
        const microphones = deviceList.filter(device => device.kind === 'audioinput');
        const speakers = deviceList.filter(device => device.kind === 'audiooutput');

        setDevices({ cameras, microphones, speakers });
        
        // Auto-select first devices
        if (cameras.length > 0) setSelectedCamera(cameras[0].deviceId);
        if (microphones.length > 0) setSelectedMicrophone(microphones[0].deviceId);
        if (speakers.length > 0) setSelectedSpeaker(speakers[0].deviceId);

        console.log('StandaloneMeetingControls: Devices initialized', {
          cameras: cameras.length,
          microphones: microphones.length,
          speakers: speakers.length
        });
      } catch (error) {
        console.error('StandaloneMeetingControls: Failed to initialize devices:', error);
      }
    };

    initializeDevices();
  }, []);

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    console.log('StandaloneMeetingControls: Audio', isMuted ? 'unmuted' : 'muted');
  };

  const handleToggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    console.log('StandaloneMeetingControls: Video', isVideoOn ? 'disabled' : 'enabled');
  };

  const handleToggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        console.log('StandaloneMeetingControls: Screen sharing started');
        setIsScreenSharing(true);
        
        // Listen for stream end
        stream.getVideoTracks()[0].addEventListener('ended', () => {
          setIsScreenSharing(false);
          console.log('StandaloneMeetingControls: Screen sharing stopped');
        });
      } else {
        setIsScreenSharing(false);
        console.log('StandaloneMeetingControls: Screen sharing stopped');
      }
    } catch (error) {
      console.error('StandaloneMeetingControls: Screen sharing failed:', error);
    }
  };

  const handleLeaveMeeting = () => {
    if (onLeaveMeeting) {
      onLeaveMeeting();
    } else {
      console.log('StandaloneMeetingControls: Leave meeting');
    }
  };

  const getDeviceLabel = (deviceId: string, deviceList: MediaDeviceInfo[]) => {
    const device = deviceList.find(d => d.deviceId === deviceId);
    return device?.label || `Device ${deviceList.indexOf(device || {} as MediaDeviceInfo) + 1}`;
  };

  const controlBarStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 20px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: '50px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    ...style
  };

  const buttonStyle = (active: boolean, danger?: boolean): React.CSSProperties => ({
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    transition: 'all 0.2s ease',
    backgroundColor: active 
      ? (danger ? '#dc3545' : '#28a745') 
      : 'rgba(255, 255, 255, 0.2)',
    color: active ? 'white' : '#ffffff'
  });

  const selectStyle: React.CSSProperties = {
    padding: '6px 10px',
    borderRadius: '6px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    fontSize: '12px',
    minWidth: '120px'
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: '4px',
    fontWeight: '500'
  };

  return (
    <div style={controlBarStyle}>
      {/* Audio Control */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button
          onClick={handleToggleMute}
          style={buttonStyle(!isMuted)}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? '🔇' : '🎤'}
        </button>
        {showLabels && <div style={labelStyle}>{isMuted ? 'Muted' : 'Mic'}</div>}
      </div>

      {/* Audio Device Selection */}
      {showAdvancedControls && devices.microphones.length > 1 && (
        <select
          value={selectedMicrophone}
          onChange={(e) => setSelectedMicrophone(e.target.value)}
          style={selectStyle}
          title="Select Microphone"
        >
          {devices.microphones.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Microphone ${devices.microphones.indexOf(device) + 1}`}
            </option>
          ))}
        </select>
      )}

      {/* Video Control */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button
          onClick={handleToggleVideo}
          style={buttonStyle(isVideoOn)}
          title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
        >
          {isVideoOn ? '📹' : '📷'}
        </button>
        {showLabels && <div style={labelStyle}>{isVideoOn ? 'Camera' : 'Off'}</div>}
      </div>

      {/* Camera Device Selection */}
      {showAdvancedControls && devices.cameras.length > 1 && (
        <select
          value={selectedCamera}
          onChange={(e) => setSelectedCamera(e.target.value)}
          style={selectStyle}
          title="Select Camera"
        >
          {devices.cameras.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera ${devices.cameras.indexOf(device) + 1}`}
            </option>
          ))}
        </select>
      )}

      {/* Screen Share Control */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button
          onClick={handleToggleScreenShare}
          style={buttonStyle(isScreenSharing)}
          title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
        >
          {isScreenSharing ? '⏹️' : '🖥️'}
        </button>
        {showLabels && <div style={labelStyle}>{isScreenSharing ? 'Sharing' : 'Share'}</div>}
      </div>

      {/* Speaker Selection */}
      {showAdvancedControls && devices.speakers.length > 1 && (
        <select
          value={selectedSpeaker}
          onChange={(e) => setSelectedSpeaker(e.target.value)}
          style={selectStyle}
          title="Select Speaker"
        >
          {devices.speakers.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Speaker ${devices.speakers.indexOf(device) + 1}`}
            </option>
          ))}
        </select>
      )}

      {/* Divider */}
      {(showRosterToggle || showChatToggle) && (
        <div style={{ 
          width: '1px', 
          height: '30px', 
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          margin: '0 8px'
        }} />
      )}

      {/* Roster Toggle */}
      {showRosterToggle && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button
            onClick={onRosterToggle}
            style={buttonStyle(false)}
            title="Toggle participants"
          >
            👥
          </button>
          {showLabels && <div style={labelStyle}>People</div>}
        </div>
      )}

      {/* Chat Toggle */}
      {showChatToggle && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button
            onClick={onChatToggle}
            style={buttonStyle(false)}
            title="Toggle chat"
          >
            💬
          </button>
          {showLabels && <div style={labelStyle}>Chat</div>}
        </div>
      )}

      {/* Divider */}
      <div style={{ 
        width: '1px', 
        height: '30px', 
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        margin: '0 8px'
      }} />

      {/* Leave Meeting */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button
          onClick={handleLeaveMeeting}
          style={buttonStyle(true, true)}
          title="Leave meeting"
        >
          📞
        </button>
        {showLabels && <div style={labelStyle}>Leave</div>}
      </div>

      {/* Status Indicator */}
      <div style={{
        marginLeft: '12px',
        padding: '6px 12px',
        backgroundColor: 'rgba(40, 167, 69, 0.2)',
        borderRadius: '12px',
        border: '1px solid rgba(40, 167, 69, 0.3)',
        fontSize: '12px',
        color: '#28a745',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <div style={{
          width: '6px',
          height: '6px',
          backgroundColor: '#28a745',
          borderRadius: '50%',
          animation: 'pulse 2s infinite'
        }} />
        Demo Active
      </div>
    </div>
  );
}
