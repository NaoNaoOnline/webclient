export default function Page() {
  return (
    <div className="px-2 mt-4 md:ml-64">
      <div className="px-2 flex grid justify-items-center">
        <div className="w-full max-w-xl dark:text-gray-50">
          <div className="flex mt-4 w-full text-4xl justify-center">
            <span>🙃</span>
          </div>
          <div className="flex mt-4 w-full text-2xl justify-center">
            <span className="text-gray-500 dark:text-gray-400">You need to be logged in to see this page!</span>
          </div>
        </div>
      </div>
    </div >
  );
};
