import React, { useState, useRef, useEffect } from 'react';
import { 
  ChatBubble,
  ChatBubbleContainer,
  Input,
  PrimaryButton
} from 'amazon-chime-sdk-component-library-react';
import { useAudioVideo } from 'amazon-chime-sdk-component-library-react';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  variant: 'incoming' | 'outgoing';
}

interface EnhancedMeetingChatProps {
  title?: string;
  currentUserId?: string;
  currentUserName?: string;
  showCloseButton?: boolean;
  onClose?: () => void;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

export default function EnhancedMeetingChat({
  title = "Meeting Chat",
  currentUserId = 'current-user',
  currentUserName = 'You',
  showCloseButton = true,
  onClose,
  width = 320,
  height = 400,
  style = {}
}: EnhancedMeetingChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const audioVideo = useAudioVideo();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Setup data message listeners
  useEffect(() => {
    if (!audioVideo) {
      return;
    }

    // Listen for incoming chat messages
    audioVideo.realtimeSubscribeToReceiveDataMessage('chat', (data) => {
      try {
        const receivedData = (data && data.json()) || {};
        const { message, senderId, senderName, timestamp } = receivedData;
        
        if (message) {
          const newChatMessage: ChatMessage = {
            id: `${Date.now()}-${Math.random()}`,
            senderId,
            senderName: senderName || 'Unknown',
            content: message,
            timestamp: timestamp || new Date().toLocaleTimeString(),
            variant: senderId === currentUserId ? 'outgoing' : 'incoming'
          };
          
          setMessages(prev => [...prev, newChatMessage]);
        }
      } catch (error) {
        console.error('Error processing chat message:', error);
      }
    });

    // Listen for typing indicators
    audioVideo.realtimeSubscribeToReceiveDataMessage('typing', (data) => {
      try {
        const receivedData = (data && data.json()) || {};
        const { isTyping: typing, senderId } = receivedData;
        
        if (senderId !== currentUserId) {
          setIsTyping(typing);
          
          // Clear typing indicator after a delay
          if (typing) {
            setTimeout(() => setIsTyping(false), 3000);
          }
        }
      } catch (error) {
        console.error('Error processing typing indicator:', error);
      }
    });

    return () => {
      audioVideo.realtimeUnsubscribeFromReceiveDataMessage('chat');
      audioVideo.realtimeUnsubscribeFromReceiveDataMessage('typing');
    };
  }, [audioVideo, currentUserId]);

  const sendMessage = () => {
    if (!audioVideo || !newMessage.trim()) {
      return;
    }

    const DATA_MESSAGE_LIFETIME_MS = 30000;
    const timestamp = new Date().toLocaleTimeString();

    const payload = {
      message: newMessage.trim(),
      senderId: currentUserId,
      senderName: currentUserName,
      timestamp
    };

    try {
      audioVideo.realtimeSendDataMessage('chat', payload, DATA_MESSAGE_LIFETIME_MS);
      setNewMessage('');
      
      // Focus back to input
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      console.error('Error sending chat message:', error);
    }
  };

  const sendTypingIndicator = (typing: boolean) => {
    if (!audioVideo) return;

    const payload = {
      isTyping: typing,
      senderId: currentUserId
    };

    try {
      audioVideo.realtimeSendDataMessage('typing', payload, 5000);
    } catch (error) {
      console.error('Error sending typing indicator:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    
    // Send typing indicator
    if (e.target.value.length > 0) {
      sendTypingIndicator(true);
    } else {
      sendTypingIndicator(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
      sendTypingIndicator(false);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const containerStyle: React.CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    border: '1px solid #e0e0e0',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    ...style
  };

  const headerStyle: React.CSSProperties = {
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #e0e0e0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const messagesStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: '10px',
    backgroundColor: '#fafafa'
  };

  const inputAreaStyle: React.CSSProperties = {
    padding: '15px',
    backgroundColor: 'white',
    borderTop: '1px solid #e0e0e0',
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-end'
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div>
          <h3 style={{ margin: '0', fontSize: '16px', color: '#333' }}>
            💬 {title}
          </h3>
          {messages.length > 0 && (
            <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
              {messages.length} message{messages.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
        
        {showCloseButton && (
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              color: '#666',
              padding: '5px'
            }}
            title="Close chat"
          >
            ✕
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div style={messagesStyle}>
        {messages.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#666'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>💬</div>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
              No messages yet
            </div>
            <div style={{ fontSize: '14px' }}>
              Start the conversation by sending a message below
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const showName = index === 0 || messages[index - 1].senderId !== message.senderId;
              const showTail = index === messages.length - 1 || messages[index + 1].senderId !== message.senderId;
              
              return (
                <ChatBubbleContainer
                  key={message.id}
                  timestamp={message.timestamp}
                  style={{ marginBottom: '8px' }}
                >
                  <ChatBubble
                    variant={message.variant}
                    senderName={message.senderName}
                    showName={showName}
                    showTail={showTail}
                    style={{
                      maxWidth: '80%',
                      wordBreak: 'break-word'
                    }}
                  >
                    {message.content}
                  </ChatBubble>
                </ChatBubbleContainer>
              );
            })}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div style={{
                padding: '10px',
                fontSize: '12px',
                color: '#666',
                fontStyle: 'italic'
              }}>
                Someone is typing...
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div style={inputAreaStyle}>
        <Input
          ref={inputRef}
          value={newMessage}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          showClear={false}
          style={{ flex: 1 }}
        />
        
        <PrimaryButton
          label="Send"
          onClick={sendMessage}
          disabled={!newMessage.trim()}
          style={{
            minWidth: '60px',
            opacity: newMessage.trim() ? 1 : 0.5
          }}
        />
      </div>

      {/* Footer Info */}
      <div style={{
        padding: '8px 15px',
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #e0e0e0',
        fontSize: '11px',
        color: '#666',
        textAlign: 'center'
      }}>
        💡 Messages are shared with all meeting participants
      </div>
    </div>
  );
}
