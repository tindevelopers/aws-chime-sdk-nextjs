import React, { useState, useEffect, useRef } from 'react';
import { DefaultDeviceController, ConsoleLogger, LogLevel } from 'amazon-chime-sdk-js';

interface StandaloneAudioControlProps {
  deviceController?: DefaultDeviceController;
  showVoiceFocus?: boolean;
  showOutputControl?: boolean;
  showLevelMeter?: boolean;
  style?: React.CSSProperties;
}

export default function StandaloneAudioControl({
  deviceController,
  showVoiceFocus = true,
  showOutputControl = true,
  showLevelMeter = true,
  style = {}
}: StandaloneAudioControlProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [outputDevices, setOutputDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>('');
  const [selectedOutputDevice, setSelectedOutputDevice] = useState<string>('');
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [currentStream, setCurrentStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVoiceFocusEnabled, setIsVoiceFocusEnabled] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize audio context for level monitoring
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Load available devices
  useEffect(() => {
    const loadDevices = async () => {
      try {
        // First try to get deviceController from props, then from window
        const controller = deviceController || (window as any).__chimeDeviceController;
        
        if (controller) {
          console.log('StandaloneAudioControl: Loading devices with DeviceController...');
          const audioInputs = await controller.listAudioInputDevices();
          const audioOutputs = await controller.listAudioOutputDevices();
          
          setAudioDevices(audioInputs);
          setOutputDevices(audioOutputs);
          
          // Set default selections
          if (audioInputs.length > 0 && !selectedAudioDevice) {
            setSelectedAudioDevice(audioInputs[0].deviceId);
          }
          if (audioOutputs.length > 0 && !selectedOutputDevice) {
            setSelectedOutputDevice(audioOutputs[0].deviceId);
          }
          
          console.log('StandaloneAudioControl: Found devices:', {
            audioInputs: audioInputs.length,
            audioOutputs: audioOutputs.length
          });
        } else {
          // Fallback to direct navigator.mediaDevices
          console.log('StandaloneAudioControl: Loading devices with navigator.mediaDevices...');
          const devices = await navigator.mediaDevices.enumerateDevices();
          const audioInputs = devices.filter(device => device.kind === 'audioinput');
          const audioOutputs = devices.filter(device => device.kind === 'audiooutput');
          
          setAudioDevices(audioInputs);
          setOutputDevices(audioOutputs);
          
          if (audioInputs.length > 0 && !selectedAudioDevice) {
            setSelectedAudioDevice(audioInputs[0].deviceId);
          }
          if (audioOutputs.length > 0 && !selectedOutputDevice) {
            setSelectedOutputDevice(audioOutputs[0].deviceId);
          }
          
          console.log('StandaloneAudioControl: Found devices (fallback):', {
            audioInputs: audioInputs.length,
            audioOutputs: audioOutputs.length
          });
        }
      } catch (err) {
        console.error('StandaloneAudioControl: Error loading devices:', err);
        setError(`Failed to load audio devices: ${err}`);
      }
    };

    // Delay loading to ensure deviceController is available
    const timer = setTimeout(loadDevices, 100);
    return () => clearTimeout(timer);
  }, [deviceController]);

  // Start audio monitoring
  const startAudioMonitoring = async (deviceId: string) => {
    try {
      console.log('StandaloneAudioControl: Starting audio monitoring for device:', deviceId);
      
      // Stop existing stream
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }

      // Get new audio stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: deviceId ? { exact: deviceId } : undefined },
        video: false
      });

      setCurrentStream(stream);
      setError(null);

      // Set up audio level monitoring
      if (audioContextRef.current && showLevelMeter) {
        const source = audioContextRef.current.createMediaStreamSource(stream);
        const analyser = audioContextRef.current.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        
        source.connect(analyser);
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        const updateAudioLevel = () => {
          if (analyserRef.current && !isMuted) {
            analyserRef.current.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
            const normalizedLevel = Math.min((average / 128) * 100, 100);
            setAudioLevel(Math.floor(normalizedLevel));
          } else {
            setAudioLevel(0);
          }
          
          animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
        };
        
        updateAudioLevel();
      }
      
      console.log('StandaloneAudioControl: Audio monitoring started successfully');
    } catch (err) {
      console.error('StandaloneAudioControl: Error starting audio monitoring:', err);
      setError(`Failed to access microphone: ${err}`);
    }
  };

  // Handle microphone device change
  const handleAudioDeviceChange = async (deviceId: string) => {
    console.log('StandaloneAudioControl: Changing audio device to:', deviceId);
    setSelectedAudioDevice(deviceId);
    
    if (!isMuted) {
      await startAudioMonitoring(deviceId);
    }
  };

  // Handle output device change
  const handleOutputDeviceChange = (deviceId: string) => {
    console.log('StandaloneAudioControl: Changing output device to:', deviceId);
    setSelectedOutputDevice(deviceId);
    // Note: Setting output device would require additional implementation for actual audio routing
  };

  // Toggle mute
  const toggleMute = async () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    if (newMutedState) {
      // Mute: stop audio monitoring
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        setCurrentStream(null);
      }
      setAudioLevel(0);
      console.log('StandaloneAudioControl: Audio muted');
    } else {
      // Unmute: start audio monitoring
      if (selectedAudioDevice) {
        await startAudioMonitoring(selectedAudioDevice);
      }
      console.log('StandaloneAudioControl: Audio unmuted');
    }
  };

  // Toggle Voice Focus (noise suppression simulation)
  const toggleVoiceFocus = () => {
    setIsVoiceFocusEnabled(!isVoiceFocusEnabled);
    console.log('StandaloneAudioControl: Voice Focus toggled:', !isVoiceFocusEnabled);
  };

  // Start monitoring on component mount if not muted
  useEffect(() => {
    if (!isMuted && selectedAudioDevice && audioDevices.length > 0) {
      startAudioMonitoring(selectedAudioDevice);
    }
    
    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [selectedAudioDevice, audioDevices.length]);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    padding: '25px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
    maxWidth: '600px',
    margin: '0 auto',
    ...style
  };

  const controlRowStyle: React.CSSProperties = {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center'
  };

  const buttonStyle = (active: boolean = false): React.CSSProperties => ({
    padding: '10px 15px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    backgroundColor: active ? '#007bff' : '#6c757d',
    color: 'white',
    transition: 'background-color 0.2s ease',
    minWidth: '100px'
  });

  const selectStyle: React.CSSProperties = {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #ced4da',
    fontSize: '14px',
    backgroundColor: 'white',
    minWidth: '200px'
  };

  const levelMeterStyle: React.CSSProperties = {
    width: '300px',
    height: '20px',
    backgroundColor: '#e9ecef',
    borderRadius: '10px',
    overflow: 'hidden',
    border: '1px solid #adb5bd',
    position: 'relative'
  };

  const levelBarStyle: React.CSSProperties = {
    width: `${audioLevel}%`,
    height: '100%',
    backgroundColor: audioLevel > 70 ? '#dc3545' : audioLevel > 30 ? '#ffc107' : '#28a745',
    transition: 'width 0.1s ease',
    borderRadius: '10px'
  };

  const getVolumeIcon = () => {
    if (isMuted) return '🔇';
    if (audioLevel > 60) return '🔊';
    if (audioLevel > 30) return '🔉';
    if (audioLevel > 5) return '🔈';
    return '📢';
  };

  return (
    <div style={containerStyle}>
      <h3 style={{ margin: '0', color: '#333', textAlign: 'center' }}>
        🎤 Standalone Audio Controls
      </h3>

      {error && (
        <div style={{
          padding: '10px 15px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '5px',
          border: '1px solid #f5c6cb',
          fontSize: '14px',
          textAlign: 'center'
        }}>
          ❌ {error}
        </div>
      )}

      {/* Audio Level Meter */}
      {showLevelMeter && (
        <div style={{ width: '100%', textAlign: 'center' }}>
          <div style={{ 
            marginBottom: '10px', 
            fontSize: '14px', 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '20px' }}>{getVolumeIcon()}</span>
            <span>Audio Level: {audioLevel}%</span>
          </div>
          <div style={levelMeterStyle}>
            <div style={levelBarStyle}></div>
          </div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
            {isMuted ? '🔇 Microphone muted' : audioLevel > 5 ? '🎵 Audio detected' : '📢 Speak to test microphone'}
          </div>
        </div>
      )}

      {/* Main Controls */}
      <div style={controlRowStyle}>
        {/* Mute/Unmute Button */}
        <button 
          onClick={toggleMute}
          style={buttonStyle(isMuted)}
          title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
        >
          {isMuted ? '🔇 Unmute' : '🎤 Mute'}
        </button>

        {/* Voice Focus Toggle */}
        {showVoiceFocus && (
          <button 
            onClick={toggleVoiceFocus}
            style={buttonStyle(isVoiceFocusEnabled)}
            title="Toggle noise suppression"
          >
            {isVoiceFocusEnabled ? '🎯 VF ON' : '🎯 VF OFF'}
          </button>
        )}
      </div>

      {/* Device Selection */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {/* Microphone Selection */}
        <div style={{ textAlign: 'center' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>
            🎤 Microphone Device:
          </label>
          <select 
            value={selectedAudioDevice} 
            onChange={(e) => handleAudioDeviceChange(e.target.value)}
            style={selectStyle}
          >
            {audioDevices.map(device => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Microphone ${device.deviceId.slice(0, 8)}...`}
              </option>
            ))}
          </select>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '3px' }}>
            {audioDevices.length} microphone(s) available
          </div>
        </div>

        {/* Speaker Selection */}
        {showOutputControl && (
          <div style={{ textAlign: 'center' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>
              🔊 Speaker Device:
            </label>
            <select 
              value={selectedOutputDevice} 
              onChange={(e) => handleOutputDeviceChange(e.target.value)}
              style={selectStyle}
            >
              {outputDevices.map(device => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Speaker ${device.deviceId.slice(0, 8)}...`}
                </option>
              ))}
            </select>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '3px' }}>
              {outputDevices.length} speaker(s) available
            </div>
          </div>
        )}
      </div>

      {/* Status */}
      <div style={{
        fontSize: '14px',
        color: isMuted ? '#dc3545' : '#28a745',
        textAlign: 'center',
        padding: '10px 15px',
        backgroundColor: isMuted ? '#f8d7da' : '#d4edda',
        borderRadius: '5px',
        border: `1px solid ${isMuted ? '#f5c6cb' : '#c3e6cb'}`,
        maxWidth: '400px'
      }}>
        {isMuted ? '🔇 Microphone is muted' : '🎤 Microphone is active'}
        {showVoiceFocus && (isVoiceFocusEnabled ? ' • 🎯 Noise suppression ON' : ' • 🎯 Noise suppression OFF')}
      </div>

      {/* Features Description */}
      <div style={{
        fontSize: '12px',
        color: '#666',
        textAlign: 'center',
        maxWidth: '500px',
        lineHeight: '1.4',
        backgroundColor: '#f8f9fa',
        padding: '12px',
        borderRadius: '5px',
        border: '1px solid #e9ecef'
      }}>
        💡 <strong>Features:</strong> Real device selection and monitoring,
        {showVoiceFocus && ' noise suppression toggle,'} 
        {showOutputControl && ' speaker output control,'} 
        {showLevelMeter && ' live audio level meter,'} 
        direct browser API integration for immediate testing.
      </div>
    </div>
  );
}
