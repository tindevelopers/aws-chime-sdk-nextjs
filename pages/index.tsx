import MeetingForm from '../src/components/MeetingForm';

export default function HomePage() {
  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'system-ui' }}>
      <h1 style={{ color: '#232f3e', marginBottom: '20px' }}>🎬 Amazon Chime SDK Meeting Demo</h1>
      <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>Real-time video meetings with Amazon Chime SDK on Vercel</p>
      <MeetingForm />
    </div>
  );
}// Development branch test
