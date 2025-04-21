// Componente de formulario de registro
'use client';

import { useState } from 'react';
import { RegisterUserData, EntityType } from '../../../lib/auth/types';

interface RegisterFormProps {
  onSubmit: (data: RegisterUserData) => Promise<void>;
}

export default function RegisterForm({ onSubmit }: RegisterFormProps) {
  const [formData, setFormData] = useState<RegisterUserData>({
    email: '',
    password: '',
    name: '',
    phone: '',
    entityType: 'physical' as EntityType,
    companyName: '',
    taxId: '',
    address: '',
    postalCode: '',
    city: '',
    province: '',
    country: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Información básica</h2>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Contraseña *
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
          <p className="text-xs text-gray-500 mt-1">
            Mínimo 8 caracteres, al menos una letra y un número
          </p>
        </div>
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Nombre completo *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium">
            Teléfono
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        
        <div>
          <label htmlFor="entityType" className="block text-sm font-medium">
            Tipo de entidad *
          </label>
          <select
            id="entityType"
            name="entityType"
            required
            value={formData.entityType}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="physical">Persona física</option>
            <option value="legal">Persona jurídica (empresa)</option>
          </select>
        </div>
      </div>

      {formData.entityType === 'legal' && (
        <div className="space-y-4 pt-4 border-t">
          <h2 className="text-xl font-bold">Información de empresa</h2>
          
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium">
              Nombre de la empresa *
            </label>
            <input
              id="companyName"
              name="companyName"
              type="text"
              required={formData.entityType === 'legal'}
              value={formData.companyName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          
          <div>
            <label htmlFor="taxId" className="block text-sm font-medium">
              CIF/NIF *
            </label>
            <input
              id="taxId"
              name="taxId"
              type="text"
              required={formData.entityType === 'legal'}
              value={formData.taxId}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium">
              Dirección
            </label>
            <input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium">
                Código postal
              </label>
              <input
                id="postalCode"
                name="postalCode"
                type="text"
                value={formData.postalCode}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            
            <div>
              <label htmlFor="city" className="block text-sm font-medium">
                Ciudad
              </label>
              <input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="province" className="block text-sm font-medium">
                Provincia
              </label>
              <input
                id="province"
                name="province"
                type="text"
                value={formData.province}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            
            <div>
              <label htmlFor="country" className="block text-sm font-medium">
                País
              </label>
              <input
                id="country"
                name="country"
                type="text"
                value={formData.country}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </div>
    </form>
  );
}
