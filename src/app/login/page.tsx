'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth/context';
import LoginForm from '../../components/auth/LoginForm';

export default function LoginPage() {
  const { login, socialLogin } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (credentials: { email: string; password: string }) => {
    try {
      await login(credentials);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    }
  };

  const handleSocialLogin = async (provider: string) => {
    try {
      // En una implementación real, aquí se integraría con las SDKs de los proveedores
      // Para este ejemplo, simulamos el proceso con datos ficticios
      const mockSocialData = {
        google: {
          providerId: 'google-123456',
          email: 'usuario@gmail.com',
          name: 'Usuario Google'
        },
        apple: {
          providerId: 'apple-123456',
          email: 'usuario@icloud.com',
          name: 'Usuario Apple'
        },
        facebook: {
          providerId: 'facebook-123456',
          email: 'usuario@facebook.com',
          name: 'Usuario Facebook'
        }
      };

      const data = mockSocialData[provider as keyof typeof mockSocialData];
      
      await socialLogin(provider, data.providerId, data.email, data.name);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : `Error al iniciar sesión con ${provider}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Iniciar sesión
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          ¿No tienes una cuenta?{' '}
          <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
            Regístrate
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <LoginForm onSubmit={handleLogin} onSocialLogin={handleSocialLogin} />
        </div>
      </div>
    </div>
  );
}
