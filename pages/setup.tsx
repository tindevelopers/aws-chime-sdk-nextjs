import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Link from 'next/link';

// Dynamic imports for standalone components
const StandaloneDeviceInitializer = dynamic(() => import('../src/components/enhanced/StandaloneDeviceInitializer'), {
  ssr: false,
  loading: () => <div style={{ textAlign: 'center', padding: '20px' }}>Initializing device setup...</div>
});

const StandaloneVideoPreview = dynamic(() => import('../src/components/enhanced/StandaloneVideoPreview'), {
  ssr: false,
  loading: () => <div style={{ textAlign: 'center', padding: '20px' }}>Loading camera...</div>
});

const StandaloneAudioControl = dynamic(() => import('../src/components/enhanced/StandaloneAudioControl'), {
  ssr: false,
  loading: () => <div style={{ textAlign: 'center', padding: '20px' }}>Loading audio controls...</div>
});

const StandaloneScreenShare = dynamic(() => import('../src/components/enhanced/StandaloneScreenShare'), {
  ssr: false,
  loading: () => <div style={{ textAlign: 'center', padding: '20px' }}>Loading screen share...</div>
});

interface SetupStep {
  id: string;
  title: string;
  description: string;
  component: 'camera' | 'audio' | 'screen';
  completed: boolean;
}

export default function SetupPage() {
  const router = useRouter();
  const [isDevicesInitialized, setIsDevicesInitialized] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [userName, setUserName] = useState('');
  const [meetingId, setMeetingId] = useState('');

  const [steps, setSteps] = useState<SetupStep[]>([
    {
      id: 'camera',
      title: 'Camera Setup',
      description: 'Test your camera and select the best device',
      component: 'camera',
      completed: false
    },
    {
      id: 'audio',
      title: 'Audio Setup', 
      description: 'Configure microphone and speaker settings',
      component: 'audio',
      completed: false
    },
    {
      id: 'screen',
      title: 'Screen Share Test',
      description: 'Verify screen sharing functionality',
      component: 'screen',
      completed: false
    }
  ]);

  const handleDeviceInitialization = (success: boolean) => {
    setIsDevicesInitialized(success);
  };

  const markStepCompleted = (stepIndex: number) => {
    setSteps(prev => prev.map((step, index) => 
      index === stepIndex ? { ...step, completed: true } : step
    ));
  };

  const nextStep = () => {
    markStepCompleted(currentStep);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const proceedToMeeting = () => {
    // Save setup data for meeting
    const setupData = {
      userName: userName || 'User',
      meetingId: meetingId || 'demo-meeting',
      setupCompleted: true,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('chime-setup-data', JSON.stringify(setupData));
    router.push('/production-meeting');
  };

  const allStepsCompleted = steps.every(step => step.completed);
  const canProceed = userName.trim() && meetingId.trim() && allStepsCompleted;

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    fontFamily: 'system-ui'
  };

  const headerStyle: React.CSSProperties = {
    backgroundColor: '#232f3e',
    color: 'white',
    padding: '20px 0',
    textAlign: 'center'
  };

  const contentStyle: React.CSSProperties = {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '40px 20px'
  };

  const stepperStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '40px',
    flexWrap: 'wrap',
    gap: '10px'
  };

  const stepItemStyle = (index: number, completed: boolean, active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px',
    borderRadius: '25px',
    backgroundColor: completed ? '#28a745' : active ? '#007bff' : '#e9ecef',
    color: completed || active ? 'white' : '#6c757d',
    fontWeight: 'bold',
    fontSize: '14px',
    cursor: completed ? 'pointer' : 'default',
    transition: 'all 0.3s ease'
  });

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '30px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    marginBottom: '30px'
  };

  const buttonStyle = (variant: 'primary' | 'secondary' | 'success' = 'primary'): React.CSSProperties => ({
    padding: '12px 24px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    backgroundColor: variant === 'primary' ? '#007bff' : variant === 'success' ? '#28a745' : '#6c757d',
    color: 'white',
    marginRight: '10px'
  });

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 15px',
    border: '1px solid #ced4da',
    borderRadius: '6px',
    fontSize: '16px',
    marginBottom: '15px'
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={{ margin: '0', fontSize: '2.5rem' }}>🚀 AWS Chime SDK Setup</h1>
        <p style={{ margin: '10px 0 0 0', fontSize: '18px', opacity: 0.9 }}>
          Professional device testing and configuration
        </p>
      </div>

      <div style={contentStyle}>
        {/* Progress Stepper */}
        <div style={stepperStyle}>
          {steps.map((step, index) => (
            <div
              key={step.id}
              style={stepItemStyle(index, step.completed, index === currentStep)}
              onClick={() => step.completed && setCurrentStep(index)}
            >
              <span style={{ marginRight: '8px' }}>
                {step.completed ? '✅' : index === currentStep ? '⏳' : '⭕'}
              </span>
              {step.title}
            </div>
          ))}
        </div>

        {/* User Info Form */}
        <div style={cardStyle}>
          <h2 style={{ marginTop: 0, color: '#232f3e' }}>👤 Meeting Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
                Your Name:
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
                Meeting ID:
              </label>
              <input
                type="text"
                placeholder="Enter meeting ID"
                value={meetingId}
                onChange={(e) => setMeetingId(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Device Setup */}
        <StandaloneDeviceInitializer onInitialized={handleDeviceInitialization}>
          <div style={cardStyle}>
            <h2 style={{ marginTop: 0, color: '#232f3e' }}>
              {steps[currentStep]?.title} - Step {currentStep + 1} of {steps.length}
            </h2>
            <p style={{ color: '#666', fontSize: '16px', marginBottom: '25px' }}>
              {steps[currentStep]?.description}
            </p>

            {!isDevicesInitialized ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                <div style={{ fontSize: '40px', marginBottom: '15px' }}>⏳</div>
                <div>Initializing device system...</div>
              </div>
            ) : (
              <>
                {/* Camera Setup */}
                {currentStep === 0 && (
                  <div>
                    <StandaloneVideoPreview 
                      showControls={true}
                      showDeviceSelection={true}
                      style={{ maxWidth: '600px', margin: '0 auto' }}
                    />
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                      <button onClick={nextStep} style={buttonStyle('primary')}>
                        ✅ Camera Looks Good
                      </button>
                    </div>
                  </div>
                )}

                {/* Audio Setup */}
                {currentStep === 1 && (
                  <div>
                    <StandaloneAudioControl 
                      showVoiceFocus={true}
                      showOutputControl={true}
                      showLevelMeter={true}
                      style={{ maxWidth: '600px', margin: '0 auto' }}
                    />
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                      <button onClick={prevStep} style={buttonStyle('secondary')}>
                        ⬅️ Previous
                      </button>
                      <button onClick={nextStep} style={buttonStyle('primary')}>
                        ✅ Audio Working Well
                      </button>
                    </div>
                  </div>
                )}

                {/* Screen Share Test */}
                {currentStep === 2 && (
                  <div>
                    <StandaloneScreenShare 
                      showControls={true}
                      style={{ maxWidth: '600px', margin: '0 auto' }}
                    />
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                      <button onClick={prevStep} style={buttonStyle('secondary')}>
                        ⬅️ Previous
                      </button>
                      <button onClick={nextStep} style={buttonStyle('primary')}>
                        ✅ Screen Share Works
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </StandaloneDeviceInitializer>

        {/* Completion and Navigation */}
        {allStepsCompleted && (
          <div style={{
            ...cardStyle,
            backgroundColor: '#d4edda',
            border: '1px solid #c3e6cb',
            textAlign: 'center'
          }}>
            <h2 style={{ color: '#155724', marginTop: 0 }}>🎉 Setup Complete!</h2>
            <p style={{ color: '#155724', fontSize: '16px', marginBottom: '25px' }}>
              All devices tested and ready. You can now join your meeting with confidence.
            </p>
            
            {canProceed ? (
              <button onClick={proceedToMeeting} style={buttonStyle('success')}>
                🚀 Join Meeting
              </button>
            ) : (
              <div style={{ color: '#856404', marginBottom: '15px' }}>
                Please enter your name and meeting ID to continue
              </div>
            )}
          </div>
        )}

        {/* Alternative Navigation */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <Link href="/" style={{ color: '#007bff', textDecoration: 'none', marginRight: '20px' }}>
            ← Back to Home
          </Link>
          <Link href="/enhanced-devices" style={{ color: '#007bff', textDecoration: 'none' }}>
            Advanced Device Testing →
          </Link>
        </div>
      </div>
    </div>
  );
}
