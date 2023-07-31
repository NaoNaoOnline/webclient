import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { UserProvider } from '@auth0/nextjs-auth0/client';
import Sidebar from '../components/app/Sidebar'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Sidebar />
      <Component {...pageProps} />
    </UserProvider>
  );
}
