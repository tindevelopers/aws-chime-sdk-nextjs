import React, { useState, useMemo } from 'react';
import { 
  Roster,
  RosterHeader,
  RosterGroup,
  RosterCell,
  RosterAttendee
} from 'amazon-chime-sdk-component-library-react';
import { 
  useRosterState,
  useAttendeeStatus 
} from 'amazon-chime-sdk-component-library-react';

interface EnhancedMeetingRosterProps {
  title?: string;
  showSearch?: boolean;
  showCloseButton?: boolean;
  onClose?: () => void;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

export default function EnhancedMeetingRoster({
  title = "Participants",
  showSearch = true,
  showCloseButton = true,
  onClose,
  width = 320,
  height = 400,
  style = {}
}: EnhancedMeetingRosterProps) {
  const { roster } = useRosterState();
  const [searchValue, setSearchValue] = useState('');

  // Convert roster object to array and filter
  const attendees = useMemo(() => {
    const attendeeArray = Object.values(roster || {});
    
    if (!searchValue) {
      return attendeeArray;
    }
    
    return attendeeArray.filter((attendee: any) => 
      attendee?.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
      attendee?.externalUserId?.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [roster, searchValue]);

  // Separate present and left attendees
  const { presentAttendees, leftAttendees } = useMemo(() => {
    const present: any[] = [];
    const left: any[] = [];

    attendees.forEach((attendee: any) => {
      if (attendee?.present) {
        present.push(attendee);
      } else {
        left.push(attendee);
      }
    });

    return {
      presentAttendees: present,
      leftAttendees: left
    };
  }, [attendees]);

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div style={containerStyle}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Roster>
        {/* Roster Header */}
        <RosterHeader
          title={title}
          badge={presentAttendees.length}
          onClose={showCloseButton ? handleClose : undefined}
          searchValue={searchValue}
          onSearch={showSearch ? handleSearch : undefined}
        />

        {/* Present Participants */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {presentAttendees.length > 0 && (
            <RosterGroup>
              {presentAttendees.map((attendee: any) => {
                const attendeeId = attendee.chimeAttendeeId || attendee.attendeeId;
                
                return (
                  <RosterAttendee 
                    key={attendeeId} 
                    attendeeId={attendeeId}
                  />
                );
              })}
            </RosterGroup>
          )}

          {/* Left Participants */}
          {leftAttendees.length > 0 && (
            <RosterGroup title="Left" badge={leftAttendees.length}>
              {leftAttendees.map((attendee: any) => {
                const attendeeId = attendee.chimeAttendeeId || attendee.attendeeId;
                const name = attendee.name || attendee.externalUserId || 'Unknown';
                
                return (
                  <RosterCell
                    key={attendeeId}
                    name={name}
                    subtitle="Left meeting"
                    muted={undefined}
                    videoEnabled={undefined}
                  />
                );
              })}
            </RosterGroup>
          )}

          {/* Empty State */}
          {attendees.length === 0 && (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: '#666',
              fontSize: '14px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>👥</div>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                No participants found
              </div>
              <div>
                {searchValue ? 'Try adjusting your search' : 'Waiting for participants to join'}
              </div>
            </div>
          )}

          {/* Search No Results */}
          {searchValue && attendees.length === 0 && Object.keys(roster || {}).length > 0 && (
            <div style={{
              padding: '20px',
              textAlign: 'center',
              color: '#666',
              fontSize: '14px'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔍</div>
              <div>No participants match "{searchValue}"</div>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div style={{
          padding: '10px 15px',
          backgroundColor: '#f8f9fa',
          borderTop: '1px solid #e0e0e0',
          fontSize: '12px',
          color: '#666',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <strong>{presentAttendees.length}</strong> present
            {leftAttendees.length > 0 && (
              <span>, <strong>{leftAttendees.length}</strong> left</span>
            )}
          </div>
          
          {searchValue && (
            <button
              onClick={() => setSearchValue('')}
              style={{
                background: 'none',
                border: 'none',
                color: '#007bff',
                cursor: 'pointer',
                fontSize: '12px',
                textDecoration: 'underline'
              }}
            >
              Clear search
            </button>
          )}
        </div>
        </Roster>
      </div>
    </div>
  );
}
