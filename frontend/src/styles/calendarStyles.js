import styled from "styled-components";
import "bootstrap/dist/css/bootstrap.min.css";

export const CalendarContainer = styled.div`
  font-family: 'Google Sans', Roboto, Arial, sans-serif;
  border: 1px solid #dadce0;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  width: 100%;
`;

export const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  border-bottom: 1px solid #dadce0;
`;

export const CalendarMonth = styled.div`
  font-size: 22px;
  font-weight: 400;
  color: #3c4043;
  letter-spacing: 0;
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: white;
`;

export const CalendarDay = styled.div`
  color: #70757a;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0;
  text-align: center;
  padding: 15px 0;
  border-bottom: 1px solid #dadce0;
`;

export const CalendarCell = styled.div`
  aspect-ratio: ${props => props.expanded ? 'auto' : '1/1'};
  border-right: 1px solid #dadce0;
  border-bottom: 1px solid #dadce0;
  padding: 8px;
  position: relative;
  background: white;
  color: ${props => props.inMonth ? '#3c4043' : '#70757a'};
  
  &:last-child {
    border-right: none;
  }
  
  &:hover {
    background-color: #f8f9fa;
  }
`;

export const DateNumber = styled.div`
font-size: 12px;
margin-bottom: 4px;
text-align: right;
color: ${props => props.isToday ? '#1a73e8' : 'inherit'};
font-weight: ${props => props.isToday ? '500' : '400'};

${props => props.isToday && `
  background-color: #1a73e8;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
`}
`;

export const AppointmentPreview = styled.div`
  display: flex;
  align-items: center;
  font-size: 11px;
  padding: 0 4px;
  height: 18px;
  line-height: 18px;
  color: #3c4043;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;

  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #1a73e8;
    margin-right: 4px;
    flex-shrink: 0;
  }

  &:hover {
    background: #f1f3f4;
    border-radius: 3px;
  }
`;

export const MoreAppointments = styled.div`
  font-size: 11px;
  color: #70757a;
  padding: 4px 4px 4px 12px;  // Extra left padding to align with appointments
  cursor: pointer;
  border-radius: 3px;

  &:hover {
    color: #1a73e8;
    background: #f1f3f4;
  }
`;

export const Arrow = styled.button`
  border: none;
  background: transparent;
  padding: 8px;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #70757a;

  &:hover {
    background: #f8f9fa;
  }
`;

export const ArrowLeft = styled(Arrow)`
  &::before {
    content: '‹';
    font-size: 24px;
  }
`;

export const ArrowRight = styled(Arrow)`
  &::before {
    content: '›';
    font-size: 24px;
  }
`;

export const AppointmentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: ${props => props.expanded ? '200px' : '100%'};
  overflow-y: auto;
  scrollbar-width: thin;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
`;