import Sidebar from './components/Sidebar'

export default function Page() {
  return (
    <main >

      <Sidebar />

      <div className="pl-4 pr-4 mt-4 md:ml-64">
        <div className="pl-4 pr-4 rounded-lg">
          <div className="flex h-14 mb-4 rounded bg-gray-50 dark:bg-gray-800">
            <button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" className="absolute inline-flex items-center p-4 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
              <span className="sr-only">Open sidebar</span>
              <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="pl-4 pr-4 md:ml-64">
        <div className="pl-4 pr-4 rounded-lg">
          <div className="flex items-center justify-center h-48 mb-4 rounded bg-gray-50 dark:bg-gray-800">
          </div>
        </div>
      </div>

    </main >
  )
}
