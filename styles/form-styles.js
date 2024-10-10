import styled from 'styled-components';

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  max-width: 410px;

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 0;
    gap: 0;
  }
`;

export const Label = styled.label`
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 500;
  padding: 2px;
  margin-top: 5px;
  color: #333;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

export const InputContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const Input = styled.input`
  width: 100%;
  margin-top: 0.5rem;
  padding: 0.5rem 0 0.5rem 0.5rem;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-sizing: border-box;
  &.error {
    border-color: #ff0000;
  }

  @media (max-width: 768px) {
    font-size: 13px;
    padding: 0.25rem;
  }
`;

export const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  color: #ff0000;
  font-size: 14px;
  margin-top: 0.5rem;
  img {
    margin-right: 0.5rem;
  }
`;

export const Select = styled.select`
  width: 100%;
  margin-top: 0.5rem;
  padding: 0.5rem 0 0.5rem 0.5rem;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-sizing: border-box;
  &.error {
    border-color: #ff0000;
  }

  @media (max-width: 768px) {
    font-size: 13px;
    padding: 0.25rem;
  }
`;

export const SubmitButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 20px;
  padding: 0.6rem;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: #ccc;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  &.active {
    background-color: #4A5AFF;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const InputRow = styled.div`
  display: flex;
  gap: 8px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
  }
`;