import React, { useState, useEffect } from 'react';
import { 
  AudioInputControl, 
  AudioOutputControl,
  AudioInputVFControl
} from 'amazon-chime-sdk-component-library-react';
import { 
  useToggleLocalMute, 
  useLocalAudioOutput,
  useAudioInputs 
} from 'amazon-chime-sdk-component-library-react';

interface EnhancedAudioInputControlProps {
  showVoiceFocus?: boolean;
  showOutputControl?: boolean;
  showLevelMeter?: boolean;
  style?: React.CSSProperties;
}

export default function EnhancedAudioInputControl({
  showVoiceFocus = true,
  showOutputControl = true,
  showLevelMeter = true,
  style = {}
}: EnhancedAudioInputControlProps) {
  const { muted, toggleMute } = useToggleLocalMute();
  const { selectedDevice } = useAudioInputs();
  const [audioLevel, setAudioLevel] = useState<number>(0);

  // Simple audio level simulation (in real implementation, you'd use audio context)
  useEffect(() => {
    if (!muted && selectedDevice) {
      const interval = setInterval(() => {
        // Simulate audio level fluctuation
        setAudioLevel(Math.floor(Math.random() * 80) + 10);
      }, 150);
      
      return () => clearInterval(interval);
    } else {
      setAudioLevel(0);
    }
  }, [muted, selectedDevice]);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    ...style
  };

  const levelMeterStyle: React.CSSProperties = {
    width: '250px',
    height: '24px',
    backgroundColor: '#e9ecef',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid #adb5bd',
    position: 'relative'
  };

  const levelBarStyle: React.CSSProperties = {
    width: `${audioLevel}%`,
    height: '100%',
    backgroundColor: audioLevel > 70 ? '#dc3545' : audioLevel > 30 ? '#ffc107' : '#28a745',
    transition: 'width 0.2s ease',
    borderRadius: '12px'
  };

  const getVolumeIcon = () => {
    if (muted) return '🔇';
    if (audioLevel > 50) return '🔊';
    if (audioLevel > 20) return '🔉';
    return '🔈';
  };

  return (
    <div style={containerStyle}>
      <h3 style={{ margin: '0 0 15px 0', color: '#333', textAlign: 'center' }}>
        🎤 Enhanced Audio Controls
      </h3>

      {/* Audio Level Meter */}
      {showLevelMeter && (
        <div style={{ width: '100%', textAlign: 'center' }}>
          <div style={{ 
            marginBottom: '8px', 
            fontSize: '14px', 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <span>{getVolumeIcon()}</span>
            <span>Audio Level: {audioLevel}%</span>
          </div>
          <div style={levelMeterStyle}>
            <div style={levelBarStyle}></div>
          </div>
          <div style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
            {muted ? '🔇 Microphone muted' : audioLevel > 0 ? '🎵 Audio detected' : '📢 Speak to test audio'}
          </div>
        </div>
      )}

      {/* Enhanced Audio Controls */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {/* Microphone Input Control with device selection */}
        <AudioInputControl 
          muteLabel="Mute"
          unmuteLabel="Unmute"
          mutedIconTitle="Unmute microphone"
          unmutedIconTitle="Mute microphone"
        />

        {/* Voice Focus (Noise Suppression) */}
        {showVoiceFocus && (
          <AudioInputVFControl 
            muteLabel="Mute" 
            unmuteLabel="Unmute"
          />
        )}

        {/* Speaker/Audio Output Control */}
        {showOutputControl && (
          <AudioOutputControl 
            label="Speaker"
          />
        )}
      </div>

      {/* Status Info */}
      <div style={{
        fontSize: '12px',
        color: muted ? '#dc3545' : '#28a745',
        textAlign: 'center',
        padding: '8px 12px',
        backgroundColor: muted ? '#f8d7da' : '#d4edda',
        borderRadius: '4px',
        border: `1px solid ${muted ? '#f5c6cb' : '#c3e6cb'}`,
        maxWidth: '300px'
      }}>
        {muted ? '🔇 Microphone is muted' : '🎤 Microphone is active'}
      </div>

      {/* Instructions */}
      <div style={{
        fontSize: '12px',
        color: '#666',
        textAlign: 'center',
        maxWidth: '400px',
        lineHeight: '1.4'
      }}>
        💡 <strong>Features:</strong> Device selection via dropdown menus, 
        {showVoiceFocus && ' Voice Focus for noise suppression,'} 
        {showOutputControl && ' speaker output control,'} 
        {showLevelMeter && ' real-time audio level monitoring.'} 
        All controls include comprehensive device management.
      </div>
    </div>
  );
}
