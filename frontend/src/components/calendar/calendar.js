import React, { useState, useEffect, Fragment, useRef } from "react";
import PropTypes from "prop-types";
import * as Styled from "../../styles/calendarStyles";
import calendar, {
  isDate,
  isSameDay,
  isSameMonth,
  getDateISO,
  getNextMonth,
  getPreviousMonth,
  WEEK_DAYS,
  CALENDAR_MONTHS,
} from "../../helpers/calendarHelper";
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchMultipleGeneric, deleteSingleGeneric, updateSingleGeneric } from "../../api/genericDataApi";
import { Link } from "../shared";
import AppointmentModal from "./calendarModal";

export default function Calendar({ date, onDateChanged }) {
  const [dateState, setDateState] = useState({
    current: new Date(),
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const [today] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [selectedDateAppointments, setSelectedDateAppointments] = useState([]);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [expandedDate, setExpandedDate] = useState(null);

  useEffect(() => {
    addDateToState(date);
    fetchAppointments();
  }, [date]);

  const addDateToState = (date) => {
    const isDateObject = isDate(date);
    const _date = isDateObject ? date : new Date();
    setDateState({
      current: isDateObject ? date : null,
      month: _date.getMonth() + 1,
      year: _date.getFullYear(),
    });
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetchMultipleGeneric('appointment');
      console.log("Raw appointment data:", response.data);

      const appointmentData = response.data.map(appointment => {
        let datetime, dateType;
        const processedAppointment = { ...appointment, characteristicOccurrences: {} };
        
        if (appointment.characteristicOccurrences) {
          for (const occ of appointment.characteristicOccurrences) {
            processedAppointment.characteristicOccurrences[occ.occurrenceOf?.name] = occ.dataStringValue || occ.dataDateValue || occ.objectValue;
            
            if (occ.occurrenceOf?.name === 'Date and Time') {
              datetime = occ.dataDateValue;
              dateType = 'DateTime';
            } else if (occ.occurrenceOf?.name === 'Date') {
              datetime = occ.dataDateValue;
              dateType = 'Date';
            }
          }
        }
        
        const parsedDate = parseDate(datetime);
        console.log(`Parsed date for appointment ${appointment._id}:`, parsedDate);
        
        return {
          ...processedAppointment,
          date: parsedDate,
          dateType
        };
      });

      console.log("Processed appointment data:", appointmentData);
      
      setAppointments(appointmentData.filter(app => app.date !== null));
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
  };
  
  const handleSave = async (updatedAppointment) => {
    try {
      await updateSingleGeneric('appointment', updatedAppointment._id, updatedAppointment);
      setEditingAppointment(null);
      fetchAppointments();
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };
  
  const handleDelete = async (appointmentId) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        await deleteSingleGeneric('appointment', appointmentId);
        fetchAppointments();
      } catch (error) {
        console.error("Error deleting appointment:", error);
      }
    }
  };

  const handleAppointmentClick = (e, appointment) => {
    e.stopPropagation(); // Prevent cell click handler from firing
    const rect = e.currentTarget.getBoundingClientRect();
    setModalPosition({ x: rect.right, y: rect.top });
    setSelectedAppointment(appointment);
  };

  const handleMoreClick = (e, date) => {
    e.stopPropagation(); // Prevent cell click handler
    setExpandedDate(expandedDate === getDateISO(date) ? null : getDateISO(date));
  };

  const parseDate = (dateString) => {
    if (!dateString) return null;
    
    const parsedDate = new Date(dateString);
    
    if (isNaN(parsedDate.getTime())) {
      console.error(`Failed to parse date: ${dateString}`);
      return null;
    }
    
    return parsedDate;
  };

  const getCalendarDates = () => {
    const { current, month, year } = dateState;
    const calendarMonth = month || (current ? current.getMonth() + 1 : today.getMonth() + 1);
    const calendarYear = year || (current ? current.getFullYear() : today.getFullYear());
    return calendar(calendarMonth, calendarYear);
  };

  const gotoDate = (date) => {
    const { current } = dateState;
    if (!(current && isSameDay(date, current))) {
      setDateState(prevState => ({
        ...prevState,
        current: date,
        month: date.getMonth() + 1,
        year: date.getFullYear()
      }));
      if (typeof onDateChanged === 'function') {
        onDateChanged(date);
      }
      
      // const selectedAppointments = appointments.filter(app => isSameDay(app.date, date));
      // setSelectedDateAppointments(selectedAppointments);
    }
  };

  const gotoPreviousMonth = () => {
    const { month, year } = dateState;
    const previousMonth = getPreviousMonth(month, year);
    setDateState(prevState => ({
      ...prevState,
      month: previousMonth.month,
      year: previousMonth.year
    }));
  };

  const gotoNextMonth = () => {
    const { month, year } = dateState;
    const nextMonth = getNextMonth(month, year);
    setDateState(prevState => ({
      ...prevState,
      month: nextMonth.month,
      year: nextMonth.year
    }));
  };

  const renderMonthAndYear = () => {
    const { month, year } = dateState;
    const monthname = CALENDAR_MONTHS[Math.max(0, Math.min(month - 1, 11))];
    return (
      <Styled.CalendarHeader>
        <Styled.ArrowLeft onClick={gotoPreviousMonth} title="Previous Month" />
        <Styled.CalendarMonth>
          {monthname} {year}
        </Styled.CalendarMonth>
        <Styled.ArrowRight onClick={gotoNextMonth} title="Next Month" />
      </Styled.CalendarHeader>
    );
  };

  const renderDayLabel = (day, index) => {
    const daylabel = WEEK_DAYS[day].toUpperCase();
    return (
      <Styled.CalendarDay key={daylabel} index={index}>
        {daylabel}
      </Styled.CalendarDay>
    );
  };

  const renderCalendarDate = (date, index) => {
    const _date = new Date(date.join("-"));
    const { current, month, year } = dateState;
  
    const isToday = isSameDay(_date, today);
    const isCurrent = current && isSameDay(_date, current);
    const inMonth = month && year && isSameMonth(_date, new Date([year, month, 1].join("-")));
    const onClick = () => gotoDate(_date);
  
    const dateAppointments = appointments.filter(app => isSameDay(app.date, _date));
    const maxDisplayAppointments = 3;
    const isExpanded = expandedDate === getDateISO(_date);
  
    const getAppointmentName = (appointment) => {
      const characteristics = appointment.characteristicOccurrences;
      return characteristics['Appointment Name'] || 'Untitled Appointment';
    };
  
    return (
      <Styled.CalendarCell 
        key={getDateISO(_date)}
        isToday={isToday}
        isCurrent={isCurrent}
        inMonth={inMonth}
        expanded={isExpanded}
        onClick={onClick}
      >
        <Styled.DateNumber isToday={isToday}>
          {_date.getDate()}
        </Styled.DateNumber>
        
        <Styled.AppointmentList expanded={isExpanded}>
          {(isExpanded ? dateAppointments : dateAppointments.slice(0, maxDisplayAppointments)).map((app) => (
            <Styled.AppointmentPreview 
              key={app._id}
              title={getAppointmentName(app)}
              onClick={(e) => handleAppointmentClick(e, app)}
            >
              {getAppointmentName(app)}
            </Styled.AppointmentPreview>
          ))}
          
          {!isExpanded && dateAppointments.length > maxDisplayAppointments && (
            <Styled.MoreAppointments
              onClick={(e) => handleMoreClick(e, _date)}
            >
              {dateAppointments.length - maxDisplayAppointments} more
            </Styled.MoreAppointments>
          )}
        </Styled.AppointmentList>
      </Styled.CalendarCell>
    );
  };

  const renderAppointmentDetails = (appointment) => {
    if (editingAppointment && editingAppointment._id === appointment._id) {
      return (
        <div key={appointment._id}>
          <h4>Editing Appointment: {appointment._id}</h4>
          {/* Add form fields for editing appointment details */}
          <button onClick={() => handleSave(editingAppointment)}>Save</button>
          <button onClick={() => setEditingAppointment(null)}>Cancel</button>
        </div>
      );
    }
    return (
      <div key={appointment._id}>
        <h4>Appointment ID: {appointment._id}</h4>
        <p>Date: {appointment.date.toLocaleDateString()}</p>
        <p>Time: {appointment.dateType === 'DateTime' ? appointment.date.toLocaleTimeString() : 'N/A'}</p>
        {/* <h5>Characteristics:</h5> */}
        <ul>
          {Object.entries(appointment.characteristicOccurrences)
          .filter(([key]) => key !== 'Date')  // Filter out the 'Date' characteristic
          .map(([key, value]) => (
            <li key={key}>{key}: {value.toString()}</li>
          ))}
        </ul>
        <div>
          <Link color to={`/appointments/${appointment._id}/edit`}>Edit</Link>
          <button onClick={() => handleDelete(appointment._id)}>Delete</button>
        </div>
        <hr />
      </div>
    );
  };

  return (
    <Styled.CalendarContainer>
      {renderMonthAndYear()}

      <Styled.CalendarGrid>
        <Fragment>
          {Object.keys(WEEK_DAYS).map(renderDayLabel)}
        </Fragment>
        <Fragment>
          {getCalendarDates().map(renderCalendarDate)}
        </Fragment>
      </Styled.CalendarGrid>

      // Appointment details
      {/* {selectedDateAppointments.length > 0 && (
        <Styled.AppointmentList>
          <h3>Appointments for {dateState.current.toDateString()}</h3>
          {selectedDateAppointments.map(renderAppointmentDetails)}
        </Styled.AppointmentList>
      )} */}

      {selectedAppointment && (
        <AppointmentModal
          appointment={selectedAppointment}
          position={modalPosition}
          onClose={() => setSelectedAppointment(null)}
          onEdit={() => handleEdit(selectedAppointment)}
          onDelete={() => handleDelete(selectedAppointment._id)}
      />)}
        
    </Styled.CalendarContainer>
  );
}

Calendar.propTypes = {
  date: PropTypes.instanceOf(Date),
  onDateChanged: PropTypes.func,
};

Calendar.defaultProps = {
  date: new Date(),
  onDateChanged: () => {},
};