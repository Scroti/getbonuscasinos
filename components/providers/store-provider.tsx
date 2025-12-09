'use client';

import { useMemo } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '@/lib/store/store';

let store: AppStore | undefined;

function getStore() {
  // Only create store on client side
  if (typeof window === 'undefined') {
    // Return a dummy store for SSR (won't be used)
    return makeStore();
  }
  
  // Create the store once in the client
  if (!store) {
    store = makeStore();
  }

  return store;
}

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = useMemo(() => getStore(), []);

  return <Provider store={store}>{children}</Provider>;
}

