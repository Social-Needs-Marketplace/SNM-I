import React, { useState } from 'react';
import { googleCalendarService } from '../../helpers/googleCalendarHelper';

const GoogleCalendarSync = ({ appointment }) => {
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);

  const handleSync = async () => {
    try {
      setSyncing(true);
      setError(null);
      
      if (!googleCalendarService.isAuthenticated) {
        await googleCalendarService.authenticate();
      }
      
      await googleCalendarService.syncAppointment(appointment);
      alert('Successfully synced with Google Calendar!');
    } catch (err) {
      setError(err.message);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <>
      <button 
        onClick={handleSync}
        disabled={syncing}
        style={{
          padding: '4px 8px',
          fontSize: '12px',
          color: '#1a73e8',
          border: '1px solid #1a73e8',
          borderRadius: '4px',
          background: 'white',
          cursor: syncing ? 'default' : 'pointer',
          opacity: syncing ? 0.7 : 1
        }}
      >
        {syncing ? 'Syncing...' : 'Sync to Google Calendar'}
      </button>
      {error && <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{error}</div>}
    </>
  );
};

export default GoogleCalendarSync;