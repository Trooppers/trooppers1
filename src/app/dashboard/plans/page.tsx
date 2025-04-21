'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/auth/context';
import { Plan } from '../../../lib/plan/types';

export default function PlansPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  // Cargar proyectos
  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      
      try {
        const response = await fetch(`/api/projects?userId=${user.id}`);
        
        if (!response.ok) {
          throw new Error('Error al cargar proyectos');
        }
        
        const data = await response.json();
        setProjects(data.projects);
        
        // Seleccionar el primer proyecto por defecto
        if (data.projects.length > 0 && !selectedProjectId) {
          setSelectedProjectId(data.projects[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar proyectos');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, [user]);

  // Cargar planos cuando cambia el proyecto seleccionado
  useEffect(() => {
    const fetchPlans = async () => {
      if (!selectedProjectId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/plans?projectId=${selectedProjectId}`);
        
        if (!response.ok) {
          throw new Error('Error al cargar planos');
        }
        
        const data = await response.json();
        setPlans(data.plans);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar planos');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlans();
  }, [selectedProjectId]);

  const getFileTypeText = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return 'PDF';
      case 'cad':
        return 'CAD';
      case 'generated':
        return 'Generado';
      default:
        return fileType;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Planos
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            No tienes proyectos creados
          </p>
        </div>
        <div className="px-4 py-12 text-center">
          <p className="text-gray-500">Debes crear un proyecto antes de poder gestionar planos</p>
          <a
            href="/dashboard/projects/new"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Crear proyecto
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Planos
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Gestiona los planos de tus proyectos
          </p>
        </div>
        {selectedProjectId && (
          <a
            href={`/dashboard/projects/${selectedProjectId}/plans/new`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Nuevo plano
          </a>
        )}
      </div>
      
      <div className="px-4 py-3 bg-gray-50 border-t border-b border-gray-200">
        <div className="flex items-center">
          <label htmlFor="projectSelect" className="block text-sm font-medium text-gray-700 mr-4">
            Proyecto:
          </label>
          <select
            id="projectSelect"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {plans.length === 0 ? (
        <div className="px-4 py-12 text-center">
          <p className="text-gray-500">No hay planos para este proyecto</p>
          <a
            href={`/dashboard/projects/${selectedProjectId}/plans/new`}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Crear plano
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 p-4">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-gray-900">{plan.name}</h4>
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    Planta {plan.floorNumber}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">{plan.description || 'Sin descripción'}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Tipo: {getFileTypeText(plan.fileType)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(plan.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-between">
                <a
                  href={`/dashboard/plans/${plan.id}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Ver
                </a>
                <a
                  href={`/dashboard/plans/${plan.id}/edit`}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Editar
                </a>
                <button
                  onClick={async () => {
                    if (confirm('¿Estás seguro de que quieres eliminar este plano?')) {
                      try {
                        const response = await fetch(`/api/plans/${plan.id}`, {
                          method: 'DELETE',
                        });
                        
                        if (!response.ok) {
                          throw new Error('Error al eliminar el plano');
                        }
                        
                        // Actualizar la lista de planos
                        setPlans(plans.filter(p => p.id !== plan.id));
                      } catch (err) {
                        setError(err instanceof Error ? err.message : 'Error al eliminar el plano');
                      }
                    }
                  }}
                  className="text-sm font-medium text-red-600 hover:text-red-500"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
