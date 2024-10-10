"use client";

import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://ss-company.free.beeceptor.com/company";

type AddressDataType = {
  line1: string;
  line2: string;
  city: string;
  state: string;
  zip: string;
};

type BusinnesDataType = {
  name: string;
  type: string;
  address: AddressDataType;
};

type ContactDataType = {
  firstName: string;
  lastName: string;
  email: string;
};

type StepsType = "businessForm" | "contactForm" | "review";

type FormDataType = {
  name: string;
  type: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    zip: string;
  };
  contact: ContactDataType;
  phone?: string;
  isLoading?: boolean;
  isSuccess?: boolean;
  successMessage?: string;
  isError?: boolean;
  errorMessage?: string;
  steps: {
    businessForm: boolean;
    contactForm: boolean;
    review: boolean;
  };
};

type DataToSendType = {
  name: string;
  type: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    zip: string;
  };
  contact: ContactDataType;
};

type ResponseType = {
  status: number;
  message: string;
};

// Recuperacion de estados en localStorage
const businessData = localStorage.getItem("formData") || null;
const storedBusinessData = businessData ? JSON.parse(businessData) : null;

const contactData = localStorage.getItem("contactFormData") || null;
const storedContactData = contactData ? JSON.parse(contactData) : null;

const currentStep = localStorage.getItem("currentStep");
const storedStep = currentStep ? JSON.parse(currentStep) : null;

const initialState: FormDataType = {
  name: storedBusinessData?.business?.value || "",
  type: storedBusinessData?.type?.value || "",
  address: {
    line1: storedBusinessData?.address?.value || "",
    line2: storedBusinessData?.address2?.value || "",
    city: storedBusinessData?.city?.value || "",
    state: storedBusinessData?.state?.value || "",
    zip: storedBusinessData?.zip?.value || "",
  },
  contact: {
    firstName: storedContactData?.firstName?.value || "",
    lastName: storedContactData?.lastName?.value || "",
    email: storedContactData?.email?.value || "",
  },
  phone: storedContactData?.phone?.value || "",
  isLoading: false,
  isSuccess: false,
  successMessage: "",
  isError: false,
  errorMessage: "",
  steps: {
    businessForm: storedStep && storedStep > 1 ? true : false,
    contactForm: storedStep && storedStep > 2 ? true : false,
    review: storedStep && storedStep > 3 ? true : false,
  },
};

export const submitForm = createAsyncThunk<
  ResponseType, // Tipo del resultado que devuelve
  DataToSendType // Tipo del argumento que recibe
>("form/submit", async (formData: DataToSendType, thunkAPI) => {
  try {
    console.log(" === FormData: ", formData);
    const { data } = await axios.post(API_URL, formData);
    console.log(" === Data: ", data);
    if (data.status === "error") return thunkAPI.rejectWithValue(data.message);
    return data;
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    clearState: (state) => initialState,
    setBusinessData: (
      state: FormDataType,
      action: PayloadAction<BusinnesDataType>
    ) => {
      const { name, type, address } = action.payload;
      return {
        ...state,
        name,
        type,
        address,
      };
    },
    setContactData: (
      state: FormDataType,
      action: PayloadAction<ContactDataType>
    ) => {
      return {
        ...state,
        contact: action.payload,
      };
    },
    setPhoneData: (state: FormDataType, action: PayloadAction<string>) => {
      return {
        ...state,
        phone: action.payload,
      };
    },
    setSteps: (state: FormDataType, action: PayloadAction<StepsType>) => {
      return {
        ...state,
        steps: {
          ...state.steps,
          [action.payload]: true,
        },
      };
    },
    editBusinessForm: (state: FormDataType) => {
      return {
        ...state,
        steps: {
          ...state.steps,
          businessForm: false,
          contactForm: false,
        },
      };
    },
    editContactForm: (state: FormDataType) => {
      return {
        ...state,
        steps: {
          ...state.steps,
          contactForm: false,
        },
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitForm.pending, (state: FormDataType) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(
        submitForm.fulfilled,
        (state, action: PayloadAction<ResponseType>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.successMessage = action.payload.message;
        }
      )
      .addCase(submitForm.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.errorMessage = action.payload;
      });
  },
});

export const {
  setBusinessData,
  setContactData,
  setPhoneData,
  clearState,
  setSteps,
  editBusinessForm,
  editContactForm,
} = formSlice.actions;

export type { FormDataType, BusinnesDataType, ContactDataType, DataToSendType };

export default formSlice.reducer;
