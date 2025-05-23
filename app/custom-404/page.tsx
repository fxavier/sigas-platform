export default function Custom404Page() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-4'>
      <h1 className='text-4xl font-bold text-gray-800 mb-4'>404</h1>
      <p className='text-xl text-gray-600 mb-8'>Page not found</p>
      <a
        href='/'
        className='px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors'
      >
        Go back home
      </a>
    </div>
  );
}
