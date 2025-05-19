// app/(auth)/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-50'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-6'>
          <h1 className='text-2xl font-bold'>
            Sistema Integrado de Gestão Ambiental e Social
          </h1>
          <p className='text-gray-600'>Autenticação Segura</p>
        </div>
        {children}
      </div>
    </div>
  );
}
