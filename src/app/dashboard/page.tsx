'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth/context';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    projects: 0,
    budgets: 0,
    plans: 0
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentBudgets, setRecentBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        // Obtener estadísticas
        const statsResponse = await fetch(`/api/dashboard/stats?userId=${user.id}`);
        if (!statsResponse.ok) throw new Error('Error al cargar estadísticas');
        const statsData = await statsResponse.json();
        setStats(statsData);
        
        // Obtener proyectos recientes
        const projectsResponse = await fetch(`/api/projects?userId=${user.id}&limit=5`);
        if (!projectsResponse.ok) throw new Error('Error al cargar proyectos recientes');
        const projectsData = await projectsResponse.json();
        setRecentProjects(projectsData.projects);
        
        // Obtener presupuestos recientes
        const budgetsResponse = await fetch(`/api/dashboard/recent-budgets?userId=${user.id}`);
        if (!budgetsResponse.ok) throw new Error('Error al cargar presupuestos recientes');
        const budgetsData = await budgetsResponse.json();
        setRecentBudgets(budgetsData.budgets);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bienvenida */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Bienvenido, {user?.name || 'Usuario'}
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>
              Gestiona tus proyectos de reforma, crea presupuestos personalizados y visualiza planos desde un solo lugar.
            </p>
          </div>
        </div>
      </div>
      
      {/* Estadísticas */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Proyectos
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {stats.projects}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link href="/dashboard/projects" className="font-medium text-blue-600 hover:text-blue-500">
                Ver todos los proyectos
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Presupuestos
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {stats.budgets}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link href="/dashboard/budgets" className="font-medium text-blue-600 hover:text-blue-500">
                Ver todos los presupuestos
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Planos
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {stats.plans}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link href="/dashboard/plans" className="font-medium text-blue-600 hover:text-blue-500">
                Ver todos los planos
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Acciones rápidas */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Acciones rápidas
          </h3>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <Link
                href="/dashboard/projects/new"
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Nuevo proyecto
              </Link>
            </div>
            <div>
              <Link
                href={recentProjects.length > 0 ? `/dashboard/projects/${recentProjects[0].id}/budgets/new` : '/dashboard/projects'}
                className={`w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${recentProjects.length > 0 ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : 'bg-gray-400 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2`}
              >
                Nuevo presupuesto
              </Link>
            </div>
            <div>
              <Link
                href={recentProjects.length > 0 ? `/dashboard/projects/${recentProjects[0].id}/plans/new` : '/dashboard/projects'}
                className={`w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${recentProjects.length > 0 ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500' : 'bg-gray-400 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2`}
              >
                Nuevo plano
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Proyectos recientes */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Proyectos recientes
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Tus últimos proyectos de reforma
          </p>
        </div>
        <div className="border-t border-gray-200">
          {recentProjects.length === 0 ? (
            <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
              No tienes proyectos creados
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {recentProjects.map((project) => (
                <li key={project.id}>
                  <Link href={`/dashboard/projects/${project.id}`} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {project.name}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            project.status === 'active' ? 'bg-green-100 text-green-800' :
                            project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            project.status === 'archived' ? 'bg-gray-100 text-gray-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {project.status === 'active' ? 'Activo' :
                             project.status === 'completed' ? 'Completado' :
                             project.status === 'archived' ? 'Archivado' :
                             'Borrador'}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            {project.address || 'Sin dirección'}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>
                            Creado el {new Date(project.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      {/* Presupuestos recientes */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Presupuestos recientes
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Tus últimos presupuestos generados
          </p>
        </div>
        <div className="border-t border-gray-200">
          {recentBudgets.length === 0 ? (
            <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
              No tienes presupuestos creados
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {recentBudgets.map((budget) => (
                <li key={budget.id}>
                  <Link href={`/dashboard/budgets/${budget.id}`} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {budget.name}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {budget.total.toFixed(2)} €
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            Proyecto: {budget.projectName}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>
                            Creado el {new Date(budget.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
