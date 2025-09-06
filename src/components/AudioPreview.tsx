import { useEffect, useRef, useState } from 'react';

interface AudioPreviewProps {
  style?: React.CSSProperties;
}

export default function AudioPreview({ style = {} }: AudioPreviewProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [isClient, setIsClient] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getMediaDevices = async () => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
      setError('Media devices not supported');
      return;
    }
    
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioDevices = devices.filter(device => device.kind === 'audioinput');
      setDevices(audioDevices);
      
      if (audioDevices.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(audioDevices[0].deviceId);
      }
    } catch (err: any) {
      console.error('Error enumerating devices:', err);
      setError('Could not access media devices');
    }
  };

  const startAudioAnalysis = (mediaStream: MediaStream) => {
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      const source = audioContextRef.current.createMediaStreamSource(mediaStream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateAudioLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          
          // Calculate average volume
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
          }
          const average = sum / bufferLength;
          setAudioLevel(Math.floor((average / 255) * 100));
        }
        
        animationRef.current = requestAnimationFrame(updateAudioLevel);
      };

      updateAudioLevel();
    } catch (err) {
      console.error('Error setting up audio analysis:', err);
    }
  };

  const stopAudioAnalysis = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    analyserRef.current = null;
    setAudioLevel(0);
  };

  const startMicrophone = async (deviceId?: string) => {
    setIsLoading(true);
    setError('');

    try {
      const constraints: MediaStreamConstraints = {
        audio: deviceId ? { deviceId: { exact: deviceId } } : true,
        video: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setIsEnabled(true);

      startAudioAnalysis(mediaStream);

      // Get updated device list after permission granted
      await getMediaDevices();
    } catch (err: any) {
      console.error('Error accessing microphone:', err);
      
      if (err.name === 'NotAllowedError') {
        setError('Microphone access denied. Please allow microphone access in your browser settings.');
      } else if (err.name === 'NotFoundError') {
        setError('No microphone device found.');
      } else if (err.name === 'NotReadableError') {
        setError('Microphone is already in use by another application.');
      } else {
        setError(`Microphone error: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const stopMicrophone = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsEnabled(false);
    }

    stopAudioAnalysis();
  };

  const switchMicrophone = async (deviceId: string) => {
    if (isEnabled) {
      stopMicrophone();
      await startMicrophone(deviceId);
    }
    setSelectedDeviceId(deviceId);
  };

  useEffect(() => {
    if (isClient) {
      getMediaDevices();
    }

    return () => {
      stopMicrophone();
    };
  }, [isClient]);

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
    width: '200px',
    height: '20px',
    backgroundColor: '#e9ecef',
    borderRadius: '10px',
    overflow: 'hidden',
    border: '1px solid #adb5bd'
  };

  const levelBarStyle: React.CSSProperties = {
    width: `${audioLevel}%`,
    height: '100%',
    backgroundColor: audioLevel > 70 ? '#dc3545' : audioLevel > 30 ? '#ffc107' : '#28a745',
    transition: 'width 0.1s ease',
    borderRadius: '10px'
  };

  if (!isClient) {
    return (
      <div style={containerStyle}>
        <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>🎤 Microphone Test</h3>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>🎤</div>
          <div>Loading microphone interface...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>🎤 Microphone Test</h3>

      {/* Microphone Selection */}
      {devices.length > 1 && (
        <div style={{ width: '100%', maxWidth: '300px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
            Microphone:
          </label>
          <select 
            value={selectedDeviceId}
            onChange={(e) => switchMicrophone(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            {devices.map(device => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Microphone ${device.deviceId.slice(0, 8)}`}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Audio Level Meter */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
          Audio Level: {audioLevel}%
        </div>
        <div style={levelMeterStyle}>
          <div style={levelBarStyle}></div>
        </div>
        <div style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
          {audioLevel > 0 ? '🎵 Audio detected' : '🔇 No audio'}
        </div>
      </div>

      {/* Microphone Controls */}
      <div style={{ display: 'flex', gap: '10px' }}>
        {!isEnabled ? (
          <button
            onClick={() => startMicrophone(selectedDeviceId)}
            disabled={isLoading}
            style={{
              padding: '10px 20px',
              backgroundColor: isLoading ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            {isLoading ? 'Starting...' : '🎤 Start Microphone'}
          </button>
        ) : (
          <button
            onClick={stopMicrophone}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            🛑 Stop Microphone
          </button>
        )}

        <button
          onClick={getMediaDevices}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          padding: '15px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          color: '#721c24',
          fontSize: '14px',
          maxWidth: '400px',
          textAlign: 'center'
        }}>
          ❌ {error}
        </div>
      )}

      {/* Device Info */}
      {isEnabled && stream && (
        <div style={{
          fontSize: '12px',
          color: '#666',
          textAlign: 'center',
          maxWidth: '400px',
          padding: '10px',
          backgroundColor: '#d1ecf1',
          border: '1px solid #bee5eb',
          borderRadius: '4px'
        }}>
          ✅ Microphone active • {stream.getAudioTracks()[0]?.label || 'Unknown microphone'}
        </div>
      )}

      {/* Instructions */}
      <div style={{
        fontSize: '12px',
        color: '#666',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        💡 Speak into your microphone to test the audio level. The meter should show activity.
      </div>
    </div>
  );
}
