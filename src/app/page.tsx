"use client"

import List from './list'
import Sort from './sort'

export default function Page() {
  return (
    <main className="flex flex-col items-center pt-10 min-h-screen bg-gray-100">
      <div className="container relative mx-auto max-w-md h-10">
        <List />
        <Sort />
      </div>
    </main>
  )
}
