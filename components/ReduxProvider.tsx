'use client'; // Este componente será renderizado en el cliente

import { Provider } from 'react-redux';
import { store } from '@/store/store';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}