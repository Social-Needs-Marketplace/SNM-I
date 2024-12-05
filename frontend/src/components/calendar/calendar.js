import React, { useState, useEffect, Fragment } from "react";
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
import { Link } from "../shared"

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
  const [googleAppointments, setGoogleAppointments] = useState([]);
  const [viewGoogleCalendar, setViewGoogleCalendar] = useState(false);


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

  const fetchGoogleAppointments = async () => {
    try {
      const response = await fetchGoogleCalendarAppointments();
      const appointments = response.map((event) => ({
        ...event,
        date: new Date(event.start.dateTime),
      }));
      setGoogleAppointments(appointments);
    } catch (error) {
      console.error("Error fetching Google appointments:", error);
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
      
    const selectedAppointments = (viewGoogleCalendar ? googleAppointments : localAppointments).filter((app) =>
        isSameDay(app.date, date)
      );
    setSelectedDateAppointments(selectedAppointments);
      
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

    const props = { index, inMonth, onClick, title: _date.toDateString() };

    const DateComponent = isCurrent
      ? Styled.HighlightedCalendarDate
      : isToday
      ? Styled.TodayCalendarDate
      : Styled.CalendarDate;

    const appointments = (viewGoogleCalendar ? googleAppointments : localAppointments).filter((app) =>
      isSameDay(app.date, _date)
    );

    return (
      <DateComponent key={getDateISO(_date)} {...props}>
        {_date.getDate()}
        {/* {dateAppointments.length > 0 && (
          <Styled.AppointmentIndicator>
            {dateAppointments.length}
          </Styled.AppointmentIndicator>
        )} */}
        {displayedAppointments.map((app, idx) => (
        <Styled.AppointmentIndicator
          key={app._id}
          onClick={(e) => {
            e.stopPropagation();
            gotoDate(_date); // Highlight the date
            setSelectedDateAppointments([app]); // Show only the clicked appointment details
          }}
        >
          {app.characteristicOccurrences?.['Title'] || `#${idx + 1}`}
        </Styled.AppointmentIndicator>
      ))}
      {dateAppointments.length > 3 && (
        <Styled.MoreIndicator
          onClick={(e) => {
            e.stopPropagation();
            gotoDate(_date); // Highlight the date
            setSelectedDateAppointments(dateAppointments); // Show all details for the day
          }}
        >
          +{dateAppointments.length - 3} more
        </Styled.MoreIndicator>
      )}
      </DateComponent>
    );
  };

  const renderAppointmentDetails = (appointment) => {
    return (
      <div key={appointment._id}>
        <h4>Appointment ID: {appointment._id}</h4>
        <p>Date: {appointment.date.toLocaleDateString()}</p>
        <p>Time: {appointment.dateType === 'DateTime' ? appointment.date.toLocaleTimeString() : 'N/A'}</p>
        <h5>Details:</h5>
        <ul>
          {Object.entries(appointment.characteristicOccurrences)
            .filter(([key]) => key !== 'Date')
            .map(([key, value]) => (
              <li key={key}>
                <strong>{key}</strong>: {value.toString()}
              </li>
            ))}
        </ul>
        <div>
          <button onClick={() => handleEdit(appointment)}>Edit</button>
          <button onClick={() => handleDelete(appointment._id)}>Delete</button>
        </div>
      </div>
    );
  };  

  return (
    <Styled.CalendarContainer>
      {renderMonthAndYear()}
      <FormControlLabel
        control={<Switch checked={viewGoogleCalendar} onChange={() => setViewGoogleCalendar((prev) => !prev)} />}
        label={viewGoogleCalendar ? "Google Calendar" : "Local Calendar"}
      />

      <GoogleCalendarLogin onSuccess={fetchGoogleAppointments} />
      
      <Styled.CalendarGrid>
        <Fragment>
          {Object.keys(WEEK_DAYS).map(renderDayLabel)}
        </Fragment>
        <Fragment>
          {getCalendarDates().map(renderCalendarDate)}
        </Fragment>
      </Styled.CalendarGrid>

      {selectedDateAppointments.length > 0 && (
        <Styled.AppointmentList>
          <h3>Appointments for {dateState.current.toDateString()}</h3>
          {selectedDateAppointments.map(renderAppointmentDetails)}
        </Styled.AppointmentList>
      )}
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