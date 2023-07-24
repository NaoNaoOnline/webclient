"use client"

import Content from './components/Content'
import Sidebar from './components/Sidebar'

import { UserProvider } from '@auth0/nextjs-auth0/client';

export default function Page() {
  return (
    <UserProvider>
      <main >

        <Sidebar />
        <Content />

      </main >
    </UserProvider>
  )
}
