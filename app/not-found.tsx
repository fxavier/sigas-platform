import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-4'>
      <h1 className='text-4xl font-bold text-gray-800 mb-4'>404</h1>
      <p className='text-xl text-gray-600 mb-8'>
        Não conseguimos encontrar a pagina que voce esta procurando.
      </p>
      <Link
        href='/dashboard'
        className='px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors'
      >
        Voltar para a pagina inicial
      </Link>
    </div>
  );
}
