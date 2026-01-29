'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import { useEffect } from 'react';
import { loadFromStorage } from './authSlice';
import { loadCartFromStorage } from './cartSlice';

function Init({ children }: { children: React.ReactNode }) {
  useEffect(() => { store.dispatch(loadFromStorage()); store.dispatch(loadCartFromStorage()); }, []);
  return <>{children}</>;
}

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}><Init>{children}</Init></Provider>;
}
