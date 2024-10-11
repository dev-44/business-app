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
  phone?: string;
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

const initialState: FormDataType = {
  name: "",
  type: "",
  address: {
    line1: "",
    line2: "",
    city: "",
    state: "",
    zip: "",
  },
  contact: {
    firstName: "",
    lastName: "",
    email: "",
  },
  isLoading: false,
  isSuccess: false,
  successMessage: "",
  isError: false,
  errorMessage: "",
  steps: {
    businessForm: false,
    contactForm: false,
    review: false,
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
    setSteps: (state: FormDataType, action: PayloadAction<StepsType>) => {
      switch (action.payload) {
        case "businessForm":
          return {
            ...state,
            steps: {
              businessForm: true,
              contactForm: false,
              review: false,
            },
          };
        case "contactForm":
          return {
            ...state,
            steps: {
              businessForm: true,
              contactForm: true,
              review: false,
            },
          };
        case "review":
          return {
            ...state,
            steps: {
              businessForm: true,
              contactForm: true,
              review: true,
            },
          };
      }
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
  clearState,
  setSteps,
  editBusinessForm,
  editContactForm,
} = formSlice.actions;

export type { FormDataType, BusinnesDataType, ContactDataType, DataToSendType };

export default formSlice.reducer;
