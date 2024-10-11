"use client";

import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import classNames from 'classnames';
import { 
  ErrorMessage, 
  Input, 
  InputContainer, 
  InputRow, 
  Label, 
  StyledForm, 
  SubmitButton
} from '@/styles/form-styles';
import phones from '@/data/phones';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setContactData, ContactDataType, setSteps } from "@/store/form/slice"
import { ArrowRightIcon } from 'lucide-react';

// Estilos utilizados en este formulario
const PhoneInputContainer = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
`;

const SelectContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 8px;
  background-color: #f5f5f5;
  border-right: 1px solid #ccc;
  cursor: pointer;

  @media (max-width: 768px) {
    padding: 0.25rem;
  }
`;

const Flag = styled.img`
  width: 24px;
  height: 16px;
  margin-right: 5px;
`;

const CountryCode = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const FlagSelect = styled.select`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
`;

const PhoneInput = styled.input`
  width: 100%;
  flex-grow: 1;
  border: none;
  padding: 0.5rem 0 0.5rem 0.5rem;
  border-radius: 8px;
  font-size: 16px;
  outline: none;

  @media (max-width: 768px) {
    font-size: 13px;
    padding: 0.25rem;
  }
`;

// Tipado para el formulario
interface FormState {
  [key: string]: { 
    value: string; 
    isValid: boolean | undefined;
    optional?: boolean;
  };
}

//Estado Inicial del Formulario
const formInitialState: FormState = { 
  firstName: { value: '', isValid: undefined },
  lastName: { value: '', isValid: undefined },
  email: { value: '', isValid: undefined },
  country: {value: phones[0].name, isValid: true},
  phone: { value: '', isValid: undefined},
};

type savedFormDataType = {
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
};

const ContactPerson = () => {

  const router = useRouter();
  const dispatch = useDispatch();
  const isFirstRender = useRef(true);

  const [initialState, setInitialState] = useState<boolean>(true);

  const [form, setForm] = useState<FormState>(formInitialState);

  const [selectedCountry, setSelectedCountry] = useState(phones[0]);

  const { firstName, lastName, email, phone} = form;

  // Se recupera los datos del formulario desde localStorage si existiesen cuando el componente se monta
  useEffect(() => {
    const storedData = localStorage.getItem('contactFormData');
    if (storedData) {
      setInitialState(false);
      const formattedData: savedFormDataType = JSON.parse(storedData);
      setForm({
        firstName: {value: formattedData.contact.firstName, isValid: undefined},
        lastName: {value: formattedData.contact.lastName, isValid: undefined},
        email: {value: formattedData.contact.email, isValid: undefined},
        phone: {value: formattedData.contact.phone.replace(/^\+\d+\s*/, ''), isValid: undefined},
      });
    }
    return () => {
      isFirstRender.current = false;
    }
  }, []);

  // Se guardar los datos del formulario en localStorage cada vez que cambian
  useEffect(() => {
    if (isFirstRender.current) return;
    const contactData: savedFormDataType = {
      contact: {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        phone : selectedCountry.phone_code + ' ' + phone.value,
      },
    };
    localStorage.setItem('contactFormData', JSON.stringify(contactData));
  }, [form]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (initialState === true) setInitialState(false);

    const { name, value } = e.target;

    // Se actualiza el estado del formulario dinámicamente
    if (form[name].value !== value) {
      // Se Verifica si el campo del Input está vacío o si no se ha seleccionado una opcion valida en el Select
      const isValid = value.trim() !== '';
      setForm((prevForm) => ({
        ...prevForm,
        [name]: {
          ...prevForm[name],
          value: value,
          isValid: isValid,
        },
      }));
    } 
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const country = phones.find(c => c.phone_code === e.target.value);
    if (!country) return;
    setSelectedCountry(country!);
    setForm((prevForm) => ({
      ...prevForm,
      country: {
        value: country.name,
        isValid: true,
      }
    }))
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedForm = { ...form };

    Object.entries(updatedForm).forEach(([key, field]) => {
      if (field.optional) return;
      if (!field.value || field.value.trim() === '') {
        updatedForm[key].isValid = false;
      } else {
        updatedForm[key].isValid = true;
      }
    });

    // Validacion de email
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (regexEmail.test(email.value)) {
      updatedForm['email'].isValid = true
    } else {
      updatedForm['email'].isValid = false
    }

    // Validacion del numero de telefono
    const regexPhone = /^\(\d{3}\)\s\d{3}-\d{3}$/;
    if (regexPhone.test(phone.value)) {
      updatedForm['phone'].isValid = true
    } else {
      updatedForm['phone'].isValid = false
    };

    setForm(updatedForm);

    // Se verifica si todos los campos son válidos después de la actualización
    const isFormValid = Object.values(form).every((field) => field.isValid || field.optional);
    if (!isFormValid) return;

    const contactData: ContactDataType = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      phone : selectedCountry.phone_code + ' ' + phone.value,
    };

    dispatch(setContactData(contactData));
    // dispatch(setPhoneData(selectedCountry.phone_code + ' ' + phone.value));
    dispatch(setSteps('contactForm'));
    localStorage.setItem('currentStep', JSON.stringify(3));
    router.push('/review');
  }

  return (
    <StyledForm onSubmit={handleSubmit}>
      <Label htmlFor="firstName">Name</Label>
      <InputRow>
        <InputContainer>
          <Input 
            id="firstName" 
            name="firstName"
            type="text" 
            placeholder="First Name" 
            value={firstName.value}
            onChange={handleOnChange}
            className={classNames({ error: firstName.isValid === false })}
          />
            {firstName.isValid === false && (
            <ErrorMessage>
              <Image src="/assets/Union.png" alt="Error icon" width={20} height={20} />
              Please enter the first name
            </ErrorMessage>
          )}
        </InputContainer>

        <InputContainer>
          <Input 
            id="lastName" 
            name="lastName"
            type="text" 
            placeholder="Last Name" 
            value={lastName.value}
            onChange={handleOnChange}
            className={classNames({ error: lastName.isValid === false })}
          />
            {lastName.isValid === false && (
            <ErrorMessage>
              <Image src="/assets/Union.png" alt="Error icon" width={20} height={20} />
              Please enter the last name
            </ErrorMessage>
          )}
        </InputContainer>
      </InputRow>

      <Label htmlFor="email">Email</Label>
      <InputContainer>
        <Input 
          id="email" 
          name="email"
          type="text" 
          placeholder="Email" 
          value={email.value}
          onChange={handleOnChange}
          className={classNames({ error: email.isValid === false })}
        />
        {email.isValid === false && (
          <ErrorMessage>
            <Image src="/assets/Union.png" alt="Error icon" width={20} height={20} />
            Make sure your email is a well formed address
          </ErrorMessage>
        )}
      </InputContainer>

      <Label htmlFor="phone">Phone</Label>
      <PhoneInputContainer>
        <SelectContainer>
          <Flag src={selectedCountry.flag_url} alt={selectedCountry.name} />
          <CountryCode>{selectedCountry.phone_code}</CountryCode>
          <FlagSelect onChange={handleCountryChange} value={selectedCountry.phone_code}>
            {phones.map((country) => (
              <option key={country.name} value={country.phone_code}>
                {country.name} ({country.phone_code})
              </option>
            ))}
          </FlagSelect>
        </SelectContainer>
        <PhoneInput
          id="phone"
          name="phone"
          type="tel"
          value={phone.value}
          onChange={handleOnChange}
          placeholder="(555) 000-0000"
        />

      </PhoneInputContainer>
      {phone.isValid === false && (
        <ErrorMessage>
          <Image src="/assets/Union.png" alt="Error icon" width={20} height={20} />
          Please enter a valid phone number
        </ErrorMessage>
      )}
      <SubmitButton type="submit" className={classNames({ active: initialState === false })}>Continue<ArrowRightIcon size={16}/></SubmitButton>
    </StyledForm>
  );
};

export default ContactPerson;