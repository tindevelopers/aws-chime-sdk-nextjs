import MeetingForm from '../src/components/MeetingForm';

export default function HomePage() {
  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'system-ui' }}>
      <h1 style={{ color: '#232f3e', marginBottom: '20px' }}>🎬 Amazon Chime SDK Meeting Demo</h1>
      <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>Real-time video meetings with Amazon Chime SDK on Vercel</p>
      
      {/* Production User Flow */}
      <div style={{
        marginBottom: '40px',
        padding: '25px',
        backgroundColor: '#d4edda',
        borderRadius: '15px',
        border: '2px solid #28a745',
        maxWidth: '600px',
        margin: '0 auto 40px auto',
        textAlign: 'center'
      }}>
        <h2 style={{ margin: '0 0 15px 0', color: '#155724', fontSize: '24px' }}>
          🚀 Production Meeting Flow
        </h2>
        <p style={{ color: '#155724', fontSize: '16px', marginBottom: '20px' }}>
          Complete device setup → Join production meeting
        </p>
        <a href="/setup" style={{
          display: 'inline-block',
          padding: '15px 30px',
          backgroundColor: '#28a745',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: '18px',
          boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#218838';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(40, 167, 69, 0.4)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#28a745';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.3)';
        }}>
          ▶️ Start Complete Flow
        </a>
      </div>

      {/* Development/Testing Options */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#666', fontSize: '18px', marginBottom: '15px' }}>
          🛠️ Development & Testing Tools
        </h3>
      </div>
      {/* Enhanced Experience Options */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px', 
        justifyContent: 'center', 
        marginBottom: '30px',
        maxWidth: '900px',
        margin: '0 auto 30px auto'
      }}>
        <a href="/enhanced-meeting" style={{
          display: 'block',
          padding: '20px',
          backgroundColor: '#17a2b8',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '12px',
          fontWeight: 'bold',
          fontSize: '16px',
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
          border: '2px solid transparent',
          transition: 'all 0.3s ease',
          textAlign: 'center'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#138496';
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#17a2b8';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
        }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>🎥</div>
          <div style={{ fontSize: '18px', marginBottom: '8px' }}>Demo Meeting</div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            Meeting demo with standalone components
          </div>
        </a>
        
        <a href="/enhanced-devices" style={{
          display: 'block',
          padding: '20px',
          backgroundColor: '#007bff',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '12px',
          fontWeight: 'bold',
          fontSize: '16px',
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
          border: '2px solid transparent',
          transition: 'all 0.3s ease',
          textAlign: 'center'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#0056b3';
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#007bff';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
        }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>🚀</div>
          <div style={{ fontSize: '18px', marginBottom: '8px' }}>Advanced Testing</div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            Compare Component Library vs Standalone
          </div>
        </a>
        
        <a href="/devices" style={{
          display: 'block',
          padding: '20px',
          backgroundColor: '#6c757d',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '12px',
          fontWeight: 'bold',
          fontSize: '16px',
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.3s ease',
          textAlign: 'center'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#545b62';
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#6c757d';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
        }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>📱</div>
          <div style={{ fontSize: '18px', marginBottom: '8px' }}>Basic Testing</div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            Simple device diagnostics
          </div>
        </a>
      </div>

      <div style={{
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#e8f4f8',
        borderRadius: '12px',
        border: '1px solid #bee5eb',
        maxWidth: '800px',
        margin: '0 auto 30px auto'
      }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', color: '#0c5460' }}>
          ✨ What's New in Enhanced Experience
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '15px',
          fontSize: '14px', 
          color: '#0c5460' 
        }}>
          <div>
            <strong>🎥 Meeting Experience:</strong>
            <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
              <li>Standardized meeting controls</li>
              <li>Real-time participant roster</li>
              <li>In-meeting chat system</li>
              <li>Professional video grid</li>
            </ul>
          </div>
          <div>
            <strong>🚀 Enhanced Features:</strong>
            <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
              <li>Background blur & voice focus</li>
              <li>Advanced device management</li>
              <li>Screen sharing controls</li>
              <li>Component Library integration</li>
            </ul>
          </div>
        </div>
      </div>

      <MeetingForm />
    </div>
  );
}// Development branch test
