"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import companyTypes from '@/data/company-types';
import { ArrowRightIcon } from 'lucide-react';
import states from '@/data/states';
import classNames from 'classnames';
import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setBusinessData, BusinnesDataType, clearState, setSteps } from "@/store/form/slice"
import { 
  ErrorMessage, 
  Input, 
  InputContainer, 
  InputRow, 
  Label, 
  Select, 
  StyledForm, 
  SubmitButton
} from '@/styles/form-styles'

// Tipado para el formulario
interface FormState {
  [key: string]: { 
    value: string; 
    isValid: boolean | undefined;
    optional?: boolean;
  };
}

type savedFormDataType = {
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

//Estado Inicial del Formulario
const formInitialState: FormState = { 
  businessName: { value: '', isValid: undefined },
  type: { value: '', isValid: undefined },
  line1: { value: '', isValid: undefined },
  line2: { value: '', isValid: true, optional: true},
  city: { value: '', isValid: undefined },
  state: { value: '', isValid: undefined },
  zip: { value: '', isValid: undefined },
};

export default function BusinessForm() {

  const router = useRouter();
  const dispatch = useDispatch();

  const isFirstRender = useRef(true);

  const [initialState, setInitialState] = useState<boolean>((true));

  const [form, setForm] = useState<FormState>(formInitialState);

  const {businessName, type, line1, line2, city, state, zip} = form

  // Recuperar los datos del formulario desde localStorage cuando el componente se monta
  useEffect(() => {
    dispatch(clearState());
    const storedData = localStorage.getItem('formData') || null;
    if (storedData) {
      setInitialState(false);
      const formattedData: savedFormDataType = JSON.parse(storedData);
      setForm({
        businessName: {value: formattedData.name, isValid: undefined},
        type: {value: formattedData.type, isValid: undefined},
        line1: {value: formattedData.address.line1, isValid: undefined},
        line2: {value: formattedData.address.line2, isValid: undefined, optional: true},
        city: {value: formattedData.address.city, isValid: undefined},
        state: {value: formattedData.address.state, isValid: undefined},
        zip: {value: formattedData.address.zip, isValid: undefined},
      })
    }

    const storedStep = localStorage.getItem('currentStep') || null;
    if (!storedStep) {
      localStorage.setItem('currentStep', JSON.stringify(1));
    }
    return () => {
      isFirstRender.current = false;
    }
  }, []);

  // Guardar los datos del formulario en localStorage cada vez que cambian
  useEffect(() => {
    if (isFirstRender.current) return;
    const businessData: BusinnesDataType = {
      name: businessName.value,
      type: type.value,
      address: {
        line1: line1.value,
        line2: line2.value,
        city: city.value,
        state: state.value,
        zip: zip.value
      }
    };
    localStorage.setItem('formData', JSON.stringify(businessData));
  }, [form]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (initialState === true) setInitialState(false);

    const { name, value } = e.target;

    // Se Actualiza el estado del formulario dinámicamente
      // Se verifica si el campo del Input está vacío o no se ha seleccionado una opcion valida en el Select
      const isValid = value.trim() !== '';
      setForm((prevForm) => ({
        ...prevForm,
        [name]: {
          value: value,
          isValid: isValid,
        },
      }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Se Verifica los campos y actualiza `isValid` si el campo `value` está vacío
    const updatedForm = { ...form }; // Se crea una copia del estado actual del formulario

    Object.entries(updatedForm).forEach(([key, field]) => {
      if (field.optional) return;
      if (!field.value || field.value.trim() === '') {
        // Si el valor está vacío, se setea `isValid` a false
        updatedForm[key].isValid = false;
      } else {
        // Si el valor no está vacío, se setea `isValid` a true
        updatedForm[key].isValid = true;
      }
    });

    // Validacion del zip code
    const regexZip = /^\d{5}$/;
    if (regexZip.test(zip.value)) {
      updatedForm['zip'].isValid = true
    } else {
      updatedForm['zip'].isValid = false
    };

    setForm(updatedForm);

      // Verificar si todos los campos son válidos después de la actualización
    const isFormValid = Object.values(form).every((field) => field.isValid || field.optional);
    if (!isFormValid) return;
    
    const businessData: BusinnesDataType = {
      name: businessName.value,
      type: type.value,
      address: {
        line1: line1.value,
        line2: line2.value,
        city: city.value,
        state: state.value,
        zip: zip.value
      }
    };

    localStorage.setItem('currentStep', JSON.stringify(2));
    dispatch(setSteps('businessForm'));
    dispatch(setBusinessData(businessData));
    router.push('/contactPerson');
  }

  return (
    <StyledForm onSubmit={handleSubmit}>
      <Label htmlFor="name">Business name</Label>
      <InputContainer>
        <Input 
          id="businessName"
          name="businessName"
          type="text" 
          placeholder="Registered business name" 
          value={businessName.value} 
          onChange={handleOnChange} 
          className={classNames({ error: businessName.isValid === false })}
        />
        {businessName.isValid === false && (
          <ErrorMessage>
            <Image src="/assets/Union.png" alt="Error icon" width={20} height={20} />
            Please enter a business name
          </ErrorMessage>
        )}
      </InputContainer>

      <Label htmlFor="type">Type</Label>
      <InputContainer>
        <Select 
          id="type" 
          name="type" 
          value={type.value} 
          onChange={handleOnChange}
          className={classNames({ error: type.isValid === false })}
        >
          <option value="" disabled>Type of business</option>
          {companyTypes.map((type, index) => (<option key={index} value={type}>{type}</option>))}
        </Select>
        {type.isValid === false && (
          <ErrorMessage>
            <Image src="/assets/Union.png" alt="Error icon" width={20} height={20} />
            Please select a type
          </ErrorMessage>
        )}
      </InputContainer>

      <Label htmlFor="line1">Address</Label>
      <InputContainer>
        <Input 
          id="line1" 
          name="line1"
          type="text" 
          placeholder="Address line 1" 
          value={line1.value}
          onChange={handleOnChange}
          className={classNames({ error: line1.isValid === false })}
        />
        {line1.isValid === false && (
          <ErrorMessage>
            <Image src="/assets/Union.png" alt="Error icon" width={20} height={20} />
            Please enter an address
          </ErrorMessage>
        )}
      </InputContainer>

      <Input 
        id="line2" 
        name="line2" 
        type="text" 
        placeholder="Address line 2 (optional)" 
        value={line2.value}
        onChange={handleOnChange} 
      />

      <InputContainer>
        <Input 
         id="city" 
         name="city"
         type="text" 
         placeholder="City" 
         value={city.value}
         onChange={handleOnChange}
         className={classNames({ error: city.isValid === false })}
        />
        {city.isValid === false && (
          <ErrorMessage>
            <Image src="/assets/Union.png" alt="Error icon" width={20} height={20} />
            Please enter a city
          </ErrorMessage>
        )}
      </InputContainer>

      <InputRow>
        <InputContainer>
          <Select 
            id="state"
            name="state" 
            value={state.value} 
            onChange={handleOnChange}
            className={classNames({ error: state.isValid === false })}
          >
          <option value="" disabled selected>State</option>
          {states.map((state, index) => (<option key={index} value={state.name + ', ' + state.abbreviation}>{state.name+ ', '+state.abbreviation}</option>))}
          </Select>
          {state.isValid === false && (
            <ErrorMessage>
              <Image src="/assets/Union.png" alt="Error icon" width={20} height={20} />
              Please select a state
            </ErrorMessage>
          )}
        </InputContainer>

        <InputContainer>
          <Input 
            id="zip" 
            name="zip"
            type="text" 
            placeholder="Zip" 
            value={zip.value}
            onChange={handleOnChange}
            className={classNames({ error: zip.isValid === false })}
          />
          {zip.isValid === false && (
          <ErrorMessage>
            <Image src="/assets/Union.png" alt="Error icon" width={20} height={20} />
            Please enter a valid zip code
          </ErrorMessage>
          )}
        </InputContainer>
      </InputRow>

      <SubmitButton type="submit" className={classNames({ active: initialState === false })}>Continue<ArrowRightIcon size={16}/></SubmitButton>
    </StyledForm>
  );
}
