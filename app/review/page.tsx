"use client";

import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from "@/store/store"
import styled from "styled-components";
import { useRouter } from 'next/navigation';
import { submitForm, DataToSendType, setSteps, editBusinessForm, editContactForm } from "@/store/form/slice"
import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';

const StyledForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  width: 100%;
  max-width: 410px;
  align-items: center;

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 0 8px 0 0;
    gap: 0;
  }
`;

const TitleRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  width: 100%;
  grid-column: 1 / 3;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    grid-template-columns: 1.5fr 0.5fr;
  }
`;

const StyledTitle = styled.h2`
  grid-column: 1;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 18px;
  line-height: 24px;
  color: #404D61;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 10px;

  @media (max-width: 768px) {
    font-size: 16px;
    font-weight: bold;
  }
`;

const EditOption = styled.span`
  grid-column: 2;
  justify-self: start;
  font-family: 'Inter', sans-serif;
  font-weight: bold;
  font-size: 14px;
  line-height: 24px;
  background-color: #fff;
  color: #4A3AFF;
  border: none;
  text-decoration: underline;
  cursor: pointer;
`;

const Row = styled.div`
  display: contents;
`;

const Label = styled.label`
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 18px;
  line-height: 40px;
  color: #757D8A;
  grid-column: 1;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const Data = styled.span`
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 18px;
  line-height: 40px;
  color: #404D61;
  grid-column: 2;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  margin-top: 20px;
  padding: 0.6rem;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: #4A3AFF;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  grid-column: 1 / 3;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SuccessMessage = styled.span`
  padding: 12px;
  grid-column: 1 / 3;
  border: 1px solid #008000;
  border-radius: 8px;
  margin: 20px 0 20px;
  color: #008000;
  background-color: #00800014;
`;

const ErrorMessage = styled.span`
  padding: 12px;
  grid-column: 1 / 3;
  border: 1px solid #EF4444;
  border-radius: 8px;
  margin: 20px 0 20px;
  color: #EF4444;
  background-color: #EF444414;
`;

//Estado Inicial del Formulario
type BusinessDataType = {
  name: string;
  type: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    zip: string;
  };
};

type ContactDataType = {
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

const businessDataInitialState = { 
  name: '',
  type: '',
  address: {
    line1: '',
    line2: '',
    city: '',
    state: '',
    zip: '',
  },
};

const contactDataInitialState = { 
  contact: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  }

};

// Se intenta recuperar los datos desde localStorage
// const savedBusinessData = localStorage.getItem('formData');
// const savedContactData = localStorage.getItem('contactFormData');

const ReviewPage = () => {

  const [businessData, setBusinessData] = useState<BusinessDataType>(businessDataInitialState);

  const [contactData, setContactData] = useState<ContactDataType>(contactDataInitialState);

  const {name, type, address} = businessData || {}
  const {line1, line2, city, state, zip} = address || {}
  const { contact } = contactData || {};
  const { firstName, lastName, email, phone} = contact || {};

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const {  
    isSuccess, 
    isError, 
    successMessage,
    errorMessage,
    isLoading
  } = useSelector((state: RootState) => state.form)

  useEffect(() => {
    const storedBusinessData = localStorage.getItem('formData') || null;
    if (storedBusinessData) {
      const formattedBusinessData: BusinessDataType = JSON.parse(storedBusinessData);
      setBusinessData({
        name: formattedBusinessData.name,
        type: formattedBusinessData.type,
        address: {
          line1: formattedBusinessData.address.line1,
          line2: formattedBusinessData.address.line2,
          city: formattedBusinessData.address.city,
          state: formattedBusinessData.address.state,
          zip: formattedBusinessData.address.zip,
        }
      });
    }

    const storedContactData = localStorage.getItem('contactFormData');
    if (storedContactData) {
      const formattedContactData: ContactDataType = JSON.parse(storedContactData);
      const { contact } = formattedContactData
      setContactData({
        contact: {
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          phone: contact.phone,
        }
      });
    }
  },[])

  useEffect(() => {
    if (isSuccess) {
      dispatch(setSteps('review'));
      localStorage.setItem('currentStep', JSON.stringify(4))
    };
  },[isSuccess])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData: DataToSendType = {
      name,
      type,
      address,
      contact,
    };

    dispatch(submitForm(formData))
  }

  const handleStartOver = () => {
    localStorage.removeItem('formData');
    localStorage.removeItem('contactFormData');
    localStorage.removeItem('currentStep');
    router.push('/');
  };

  const handleBusinessEdit = () => {
    localStorage.setItem('currentStep', JSON.stringify(1));
    dispatch(editBusinessForm());
    router.push('/');
  };

  const handleContactEdit = () => {
    localStorage.setItem('currentStep', JSON.stringify(2));
    dispatch(editContactForm());
    router.push('/contactPerson');
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <TitleRow>
        <StyledTitle>Business structure</StyledTitle>
        <EditOption onClick={handleBusinessEdit}>Edit</EditOption>
      </TitleRow>
      <Row>
        <Label>Name:</Label>
        <Data>{name}</Data>
      </Row>
      <Row>
        <Label>Type:</Label>
        <Data>{type}</Data>
      </Row>
      <Row>
        <Label>Address:</Label>
        <Data>{line1}</Data>
        {line2 !== '' ? (
          <>
            <Data>{line2}</Data>
            <Data>{state} {zip}</Data>
          </>

          ) : (
            <Data>{state} {zip}</Data>
          )}
      </Row>

      <TitleRow>
        <StyledTitle>Contact person</StyledTitle>
        <EditOption  onClick={handleContactEdit}>Edit</EditOption>
      </TitleRow>
      <Row>
        <Label>Name:</Label>
        <Data>{firstName} {lastName}</Data>
      </Row>
      <Row>
        <Label>Email:</Label>
        <Data>{email}</Data>
      </Row>
      <Row>
        <Label>Phone:</Label>
        <Data>{phone}</Data>
      </Row>
      {isSuccess ? (<SuccessMessage>{successMessage}</SuccessMessage>) : null}
      {isSuccess ? (
        <SubmitButton type="button" onClick={handleStartOver}>{isLoading ? (<Loader size={16} />) : 'Start Over'}</SubmitButton>
      ) : (<SubmitButton type="submit">{isLoading ? (<Loader size={16} />) : 'Confirm & Submit'}</SubmitButton>)}
      {isError ? (<ErrorMessage>{errorMessage}</ErrorMessage>) : null}
    </StyledForm>
  ); 
};

export default ReviewPage;