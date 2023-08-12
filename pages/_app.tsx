import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { UserProvider } from '@auth0/nextjs-auth0/client';
import Sidebar from '../components/app/Sidebar'
import * as Toast from '@radix-ui/react-toast';

export default function App({ Component, pageProps: { ...pageProps } }: AppProps) {
  return (
    <UserProvider>
      <Toast.Provider>
        <Sidebar />
        <Component {...pageProps} />
      </Toast.Provider >
    </UserProvider>
  );
}
