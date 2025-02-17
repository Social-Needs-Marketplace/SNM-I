import styled from "styled-components";

export const Popup = styled.div`
  position: fixed;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  padding: 16px;
  min-width: 280px;
  max-width: 400px;
  z-index: 1000;
  font-family: 'Google Sans', Roboto, Arial, sans-serif;
`;

export const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const ActionIcon = styled.button`
  border: none;
  background: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 50%;
  color: #5f6368;
  
  &:hover {
    background: #f1f3f4;
  }
`;

export const Title = styled.div`
  font-size: 22px;
  font-weight: 400;
  color: #3c4043;
  margin-bottom: 8px;
`;

export const DateTime = styled.div`
  font-size: 14px;
  color: #3c4043;
`;

export const SyncContainer = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #dadce0;
`;