import React, { useEffect, useRef, useState } from 'react';
import { Edit2, Trash2, X } from 'lucide-react';
import * as Styled from '../../styles/calendarModalStyles';
import { Link } from "../shared";
import GoogleCalendarSync from './googleCalendarSync';

const AppointmentDetails = ({ appointment, position, onClose, onEdit, onDelete }) => {
  const popupRef = useRef(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (popupRef.current) {
      const popupRect = popupRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let top = position.y;
      let left = position.x;

      // Adjust if popup would go off screen
      if (left + popupRect.width > viewportWidth) {
        left = position.x - popupRect.width;
      }
      if (top + popupRect.height > viewportHeight) {
        top = position.y - popupRect.height;
      }

      setPopupPosition({ top, left });
    }
  }, [position]);

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };
  };

  const { date, time } = formatDateTime(appointment.date);

  const handleClickOutside = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Styled.Popup 
      ref={popupRef}
      style={{ top: popupPosition.top, left: popupPosition.left }}
    >
      <Styled.PopupHeader>
        <Styled.HeaderActions>
            <Link to={`/appointments/${appointment._id}/edit`}>
                <Styled.ActionIcon><Edit2 size={18} /></Styled.ActionIcon>
            </Link>
            <Styled.ActionIcon onClick={onDelete}><Trash2 size={18} /></Styled.ActionIcon>
        </Styled.HeaderActions>
        <Styled.ActionIcon onClick={onClose}><X size={18} /></Styled.ActionIcon>
      </Styled.PopupHeader>

      <Styled.Title>
        {appointment.characteristicOccurrences['Appointment Name']}
      </Styled.Title>

      <Styled.DateTime>
        {date} • {time}
      </Styled.DateTime>
      
      <Styled.SyncContainer>
        <GoogleCalendarSync appointment={appointment} />
      </Styled.SyncContainer>
    </Styled.Popup>
  );
};

export default AppointmentDetails;