export default function TestPage() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>🎉 AWS Chime SDK Vercel Migration Test</h1>
      <p>If you can see this page, the basic Next.js setup is working!</p>
      <p>Next.js 14.2.32 with AWS Chime SDK</p>
      <div style={{ marginTop: '20px' }}>
        <a href="/api/join" style={{ 
          padding: '10px 20px', 
          backgroundColor: '#0070f3', 
          color: 'white', 
          textDecoration: 'none',
          borderRadius: '5px'
        }}>
          Test API Endpoint
        </a>
      </div>
    </div>
  );
}
