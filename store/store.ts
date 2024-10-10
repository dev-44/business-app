import { configureStore } from "@reduxjs/toolkit";
import formReducer from "@/store/form/slice";

export const store = configureStore({
  reducer: {
    form: formReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
// export type AppSelector<TSelected = unknown> = (state: RootState) => TSelected;
