import styled from "styled-components";
import "bootstrap/dist/css/bootstrap.min.css";

export const Arrow = styled.button`
  appearance: none;
  user-select: none;
  outline: none !important;
  display: inline-block;
  position: relative;
  cursor: pointer;
  padding: 0;
  border: none;
  border-top: 1.6em solid transparent;
  border-bottom: 1.6em solid transparent;
  transition: all 0.25s ease-out;
`;

export const ArrowLeft = styled(Arrow)`
  border-right: 2.4em solid #ccc;
  left: 1.5rem;
  :hover {
    border-right-color: #06c;
  }
`;

export const ArrowRight = styled(Arrow)`
  border-left: 2.4em solid #ccc;
  right: 1.5rem;
  :hover {
    border-left-color: #06c;
  }
`;

export const CalendarContainer = styled.div`
  font-size: 5px;
  border: 2px solid #06c;
  border-radius: 5px;
  overflow: hidden;
`;

export const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template: repeat(7, auto) / repeat(7, auto);
`;

export const CalendarMonth = styled.div`
  font-weight: 500;
  font-size: 5em;
  color: #06c;
  text-align: center;
  padding: 0.5em 0.25em;
  word-spacing: 5px;
  user-select: none;
`;

export const CalendarCell = styled.div`
  text-align: center;
  align-self: center;
  letter-spacing: 0.1rem;
  padding: 0.6em 0.25em;
  user-select: none;
  grid-column: ${(props) => (props.index % 7) + 1} / span 1;
`;

export const CalendarDay = styled(CalendarCell)`
  font-weight: 600;
  font-size: 2.25em;
  color: #06c;
  border-top: 2px solid #06c;
  border-bottom: 2px solid #06c;
  border-right: ${(props) =>
    (props.index % 7) + 1 === 7 ? `none` : `2px solid #06c`};
`;

export const CalendarDate = styled(CalendarCell)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  font-weight: ${(props) => (props.inMonth ? 500 : 300)};
  font-size: 4em;
  cursor: pointer;
  border-bottom: ${(props) =>
    (props.index + 1) / 7 <= 5 ? `1px solid #ddd` : `none`};
  border-right: ${(props) =>
    (props.index % 7) + 1 === 7 ? `none` : `1px solid #ddd`};
  color: ${(props) => (props.inMonth ? `#333` : `#ddd`)};
  grid-row: ${(props) => Math.floor(props.index / 7) + 2} / span 1;
  transition: all 0.4s ease-out;

  &:hover {
    color: #06c;
    background: rgba(0, 102, 204, 0.075);
  }

  & > ${AppointmentIndicator}:not(:last-child) {
    margin-bottom: 5px;
  }
`;

export const HighlightedCalendarDate = styled(CalendarDate)`
  color: #fff !important;
  background: #06c !important;
  position: relative;
  ::before {
    content: "";
    position: absolute;
    top: -1px;
    left: -1px;
    width: calc(100% + 2px);
    height: calc(100% + 2px);
    border: 2px solid #06c;
  }
`;

export const TodayCalendarDate = styled(HighlightedCalendarDate)`
  color: #06c !important;
  background: transparent !important;
  ::after {
    content: "";
    position: absolute;
    right: 0;
    bottom: 0;
    border-bottom: 0.75em solid #06c;
    border-left: 0.75em solid transparent;
    border-top: 0.75em solid transparent;
  }
  :hover {
    color: #06c !important;
    background: rgba(0, 102, 204, 0.075) !important;
  }
`;

export const BlockedCalendarDate = styled(CalendarDate)`
  color: black !important;
  background: gray !important;
  position: relative;
  :hover {
    color: black !important;
    background: gray !important;
    border-color:gray;
        cursor:default;
  }
`;

export const AppointmentIndicator = styled.div`
  background-color: #007bff;
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 0.8rem;
  margin: 2px 0;
  display: inline-block;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background-color: #0056b3;
  }
`;

export const AppointmentList = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);

  h3 {
    margin-bottom: 10px;
    color: #007bff;
    font-size: 1.5rem;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    margin-bottom: 10px;
    font-size: 1rem;
    line-height: 1.4;
  }

  li strong {
    color: #333;
  }
`;

export const MoreIndicator = styled.div`
  color: #666;
  font-size: 0.75rem;
  cursor: pointer;
  text-decoration: underline;
  margin-top: 4px;

  &:hover {
    color: #007bff;
  }
`;

