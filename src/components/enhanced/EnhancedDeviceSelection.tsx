import React from 'react';
import { 
  CameraSelection,
  MicSelection,
  SpeakerSelection,
  QualitySelection,
  BackgroundBlurCheckbox
} from 'amazon-chime-sdk-component-library-react';

interface EnhancedDeviceSelectionProps {
  showQualitySettings?: boolean;
  showBackgroundBlur?: boolean;
  orientation?: 'horizontal' | 'vertical';
  style?: React.CSSProperties;
}

export default function EnhancedDeviceSelection({
  showQualitySettings = true,
  showBackgroundBlur = true,
  orientation = 'vertical',
  style = {}
}: EnhancedDeviceSelectionProps) {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: orientation === 'vertical' ? 'column' : 'row',
    gap: '20px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    ...style
  };

  const sectionStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '6px',
    border: '1px solid #e0e0e0'
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '5px'
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#666',
    marginTop: '5px'
  };

  return (
    <div style={containerStyle}>
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <h3 style={{ margin: '0', color: '#333' }}>⚙️ Device Management</h3>
        <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
          Configure your audio and video devices for the best meeting experience
        </p>
      </div>

      {/* Camera Selection */}
      <div style={sectionStyle}>
        <div style={labelStyle}>📹 Camera</div>
        <CameraSelection 
          label="Select Camera"
        />
        <div style={descriptionStyle}>
          Choose your camera device. Grant camera permission to see available options.
        </div>
      </div>

      {/* Microphone Selection */}
      <div style={sectionStyle}>
        <div style={labelStyle}>🎤 Microphone</div>
        <MicSelection 
          label="Select Microphone"
        />
        <div style={descriptionStyle}>
          Choose your microphone device. Test audio levels to ensure it's working properly.
        </div>
      </div>

      {/* Speaker Selection */}
      <div style={sectionStyle}>
        <div style={labelStyle}>🔊 Speaker</div>
        <SpeakerSelection 
          label="Select Speaker"
        />
        <div style={descriptionStyle}>
          Choose your audio output device. This controls where you'll hear other participants.
        </div>
      </div>

      {/* Quality Settings */}
      {showQualitySettings && (
        <div style={sectionStyle}>
          <div style={labelStyle}>📊 Video Quality</div>
          <QualitySelection />
          <div style={descriptionStyle}>
            Adjust video quality based on your internet connection. Higher quality uses more bandwidth.
          </div>
        </div>
      )}

      {/* Background Blur */}
      {showBackgroundBlur && (
        <div style={sectionStyle}>
          <div style={labelStyle}>🌫️ Background Effects</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BackgroundBlurCheckbox />
            <span style={{ fontSize: '14px' }}>Enable background blur</span>
          </div>
          <div style={descriptionStyle}>
            Blur your background for a professional appearance during video calls.
          </div>
        </div>
      )}

      {/* Device Status & Tips */}
      <div style={{
        ...sectionStyle,
        backgroundColor: '#e8f4f8',
        border: '1px solid #bee5eb'
      }}>
        <div style={labelStyle}>💡 Tips for Best Experience</div>
        <ul style={{ 
          margin: '5px 0', 
          paddingLeft: '20px', 
          fontSize: '12px', 
          color: '#666',
          lineHeight: '1.5'
        }}>
          <li>Test your devices before joining important meetings</li>
          <li>Use a headset to prevent echo and improve audio quality</li>
          <li>Ensure good lighting for better video quality</li>
          <li>Choose a quiet environment to minimize background noise</li>
          <li>Background blur works best with good lighting and contrast</li>
        </ul>
      </div>
    </div>
  );
}
