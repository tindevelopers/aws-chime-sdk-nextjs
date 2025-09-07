import React from 'react';

interface StandaloneVideoGridProps {
  layout?: 'grid' | 'featured' | 'spotlight';
  style?: React.CSSProperties;
}

export default function StandaloneVideoGrid({
  layout = 'featured',
  style = {}
}: StandaloneVideoGridProps) {
  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    borderRadius: '8px',
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...style
  };

  const placeholderStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '18px',
    textAlign: 'center',
    padding: '40px'
  };

  const demoParticipants = [
    { id: '1', name: 'You', isLocal: true, hasVideo: true, hasAudio: true },
    { id: '2', name: 'Demo Participant 1', isLocal: false, hasVideo: false, hasAudio: true },
    { id: '3', name: 'Demo Participant 2', isLocal: false, hasVideo: false, hasAudio: true }
  ];

  const gridItemStyle: React.CSSProperties = {
    flex: 1,
    minHeight: '200px',
    backgroundColor: '#1a1a1a',
    borderRadius: '8px',
    margin: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    border: '2px solid rgba(255, 255, 255, 0.1)'
  };

  const participantLabelStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '8px',
    left: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500'
  };

  const statusIndicatorStyle: React.CSSProperties = {
    position: 'absolute',
    top: '8px',
    right: '8px',
    display: 'flex',
    gap: '4px'
  };

  const audioIndicatorStyle = (hasAudio: boolean): React.CSSProperties => ({
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: hasAudio ? 'rgba(40, 167, 69, 0.8)' : 'rgba(220, 53, 69, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px'
  });

  const videoIndicatorStyle = (hasVideo: boolean): React.CSSProperties => ({
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: hasVideo ? 'rgba(40, 167, 69, 0.8)' : 'rgba(108, 117, 125, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px'
  });

  if (layout === 'featured') {
    return (
      <div style={containerStyle}>
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          padding: '8px'
        }}>
          {/* Main participant view */}
          <div style={{
            flex: 1,
            backgroundColor: '#1a1a1a',
            borderRadius: '8px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid rgba(40, 167, 69, 0.3)'
          }}>
            <div style={placeholderStyle}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>👤</div>
              <div style={{ marginBottom: '10px', fontSize: '20px', fontWeight: 'bold' }}>
                You (Demo)
              </div>
              <div style={{ fontSize: '14px', opacity: 0.8 }}>
                Camera preview - Connect to see live video
              </div>
            </div>

            <div style={participantLabelStyle}>
              You (Featured)
            </div>

            <div style={statusIndicatorStyle}>
              <div style={audioIndicatorStyle(true)} title="Audio on">🎤</div>
              <div style={videoIndicatorStyle(false)} title="Video off">📹</div>
            </div>
          </div>

          {/* Other participants strip */}
          <div style={{
            height: '120px',
            display: 'flex',
            gap: '8px'
          }}>
            {demoParticipants.slice(1).map((participant) => (
              <div key={participant.id} style={{
                width: '160px',
                height: '100%',
                backgroundColor: '#2a2a2a',
                borderRadius: '8px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  color: '#ccc',
                  fontSize: '12px'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '4px' }}>👤</div>
                  <div>{participant.name}</div>
                </div>

                <div style={{
                  ...participantLabelStyle,
                  fontSize: '10px'
                }}>
                  {participant.name}
                </div>

                <div style={statusIndicatorStyle}>
                  <div style={{
                    ...audioIndicatorStyle(participant.hasAudio),
                    width: '16px',
                    height: '16px',
                    fontSize: '8px'
                  }} title={participant.hasAudio ? 'Audio on' : 'Audio off'}>
                    {participant.hasAudio ? '🎤' : '🔇'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (layout === 'grid') {
    return (
      <div style={containerStyle}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '8px',
          padding: '8px',
          width: '100%',
          height: '100%'
        }}>
          {demoParticipants.map((participant) => (
            <div key={participant.id} style={gridItemStyle}>
              <div style={placeholderStyle}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>👤</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                  {participant.name}
                </div>
                <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '4px' }}>
                  {participant.isLocal ? 'Your preview' : 'Audio only'}
                </div>
              </div>

              <div style={participantLabelStyle}>
                {participant.name}
              </div>

              <div style={statusIndicatorStyle}>
                <div style={audioIndicatorStyle(participant.hasAudio)} title={participant.hasAudio ? 'Audio on' : 'Audio off'}>
                  {participant.hasAudio ? '🎤' : '🔇'}
                </div>
                <div style={videoIndicatorStyle(participant.hasVideo)} title={participant.hasVideo ? 'Video on' : 'Video off'}>
                  {participant.hasVideo ? '📹' : '📷'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default: spotlight layout
  return (
    <div style={containerStyle}>
      <div style={placeholderStyle}>
        <div style={{ fontSize: '72px', marginBottom: '20px' }}>🎥</div>
        <div style={{ marginBottom: '15px', fontSize: '24px', fontWeight: 'bold' }}>
          Meeting Demo
        </div>
        <div style={{ fontSize: '16px', opacity: 0.8, maxWidth: '400px', lineHeight: '1.5' }}>
          This is a demo meeting interface. In a real meeting, you would see live video feeds from participants here.
        </div>
        
        <div style={{ 
          marginTop: '30px', 
          padding: '15px 20px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          <div style={{ marginBottom: '8px' }}>
            <strong>Demo Status:</strong> Active
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>Layout:</strong> {layout}
          </div>
          <div>
            <strong>Participants:</strong> {demoParticipants.length} demo users
          </div>
        </div>
      </div>
    </div>
  );
}
