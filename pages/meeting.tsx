import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function MeetingPage() {
  const router = useRouter();
  const [meetingData, setMeetingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    // Get meeting data from sessionStorage or query params
    const storedData = typeof window !== 'undefined' && window.sessionStorage ? 
      sessionStorage.getItem('meetingData') : null;
      
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setMeetingData(data);
        setLoading(false);
      } catch (err) {
        setError('Invalid meeting data');
        setLoading(false);
      }
    } else if (router.query.meetingId) {
      // If no stored data, we could fetch meeting info here
      setError('No meeting data found. Please join a meeting from the home page.');
      setLoading(false);
    } else {
      // Still waiting for router to be ready
      setTimeout(() => {
        if (!router.query.meetingId && !storedData) {
          setError('No meeting data found. Please join a meeting from the home page.');
          setLoading(false);
        }
      }, 1000);
    }
  }, [router.query, isClient]);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Loading meeting...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2 style={{ color: 'red' }}>Error: {error}</h2>
        <button
          onClick={() => router.push('/')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Back to Home
        </button>
      </div>
    );
  }

  const leaveMeeting = () => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.removeItem('meetingData');
    }
    router.push('/');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        padding: '10px 20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <h1 style={{ margin: 0 }}>🎥 Meeting: {meetingData?.JoinInfo?.Title}</h1>
        <button
          onClick={leaveMeeting}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Leave Meeting
        </button>
      </div>

      {meetingData && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ 
            padding: '20px', 
            border: '1px solid #ddd', 
            borderRadius: '8px',
            backgroundColor: 'white'
          }}>
            <h3>👤 Attendee Info</h3>
            <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <div><strong>Name:</strong> {meetingData.JoinInfo.Attendee.Name}</div>
              <div><strong>Attendee ID:</strong> {meetingData.JoinInfo.Attendee.AttendeeId}</div>
              <div><strong>Capabilities:</strong></div>
              <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                <li>Audio: {meetingData.JoinInfo.Attendee.Capabilities.Audio}</li>
                <li>Video: {meetingData.JoinInfo.Attendee.Capabilities.Video}</li>
                <li>Content: {meetingData.JoinInfo.Attendee.Capabilities.Content}</li>
              </ul>
            </div>
          </div>

          <div style={{ 
            padding: '20px', 
            border: '1px solid #ddd', 
            borderRadius: '8px',
            backgroundColor: 'white'
          }}>
            <h3>🌐 Meeting Info</h3>
            <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <div><strong>Meeting ID:</strong> {meetingData.JoinInfo.Meeting.MeetingId}</div>
              <div><strong>Region:</strong> {meetingData.JoinInfo.Meeting.MediaRegion}</div>
              <div><strong>External ID:</strong> {meetingData.JoinInfo.Meeting.ExternalMeetingId}</div>
            </div>
          </div>
        </div>
      )}

      <div style={{ 
        marginTop: '30px',
        padding: '30px',
        border: '2px dashed #ccc',
        borderRadius: '8px',
        textAlign: 'center',
        backgroundColor: '#fafafa'
      }}>
        <h2 style={{ color: '#666', marginBottom: '15px' }}>
          🎬 Video Meeting Interface
        </h2>
        <p style={{ color: '#888', marginBottom: '20px' }}>
          This is where the actual Chime SDK video interface will be integrated.
          <br />
          The meeting connection is established and ready!
        </p>
        
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={{ 
            padding: '10px 20px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
            🎤 Microphone
          </button>
          <button style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
            🎥 Camera
          </button>
          <button style={{ 
            padding: '10px 20px', 
            backgroundColor: '#ffc107', 
            color: 'black', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
            📺 Share Screen
          </button>
          <button style={{ 
            padding: '10px 20px', 
            backgroundColor: '#6f42c1', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
            💬 Chat
          </button>
        </div>

        <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
          <strong>Next Steps:</strong> The full Chime SDK components will be integrated here with:
          <br />
          • Video tiles for participants • Audio controls • Screen sharing • Chat functionality
        </div>
      </div>
    </div>
  );
}