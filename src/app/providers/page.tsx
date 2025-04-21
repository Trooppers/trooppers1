import { NextPage } from 'next';
import Link from 'next/link';

const ProvidersPage: NextPage = () => {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Proveedores</h2>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Encuentra los mejores proveedores para tu proyecto
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            Descubre proveedores de confianza para herramientas, suministros y maquinaria de construcción
          </p>
        </div>
      </div>

      {/* Categorías de proveedores */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {/* Categoría 1: Herramientas */}
          <div className="group relative">
            <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
              <img
                src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Herramientas de construcción"
                className="w-full h-full object-center object-cover lg:w-full lg:h-full"
              />
            </div>
            <div className="mt-4 flex justify-between">
              <div>
                <h3 className="text-sm text-gray-700">
                  <Link href="/providers/tools">
                    <span aria-hidden="true" className="absolute inset-0"></span>
                    Herramientas
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-gray-500">Herramientas manuales y eléctricas</p>
              </div>
              <p className="text-sm font-medium text-gray-900">24 proveedores</p>
            </div>
          </div>

          {/* Categoría 2: Suministros */}
          <div className="group relative">
            <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
              <img
                src="https://images.unsplash.com/photo-1581783898377-1c85bf937427?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Suministros de construcción"
                className="w-full h-full object-center object-cover lg:w-full lg:h-full"
              />
            </div>
            <div className="mt-4 flex justify-between">
              <div>
                <h3 className="text-sm text-gray-700">
                  <Link href="/providers/supplies">
                    <span aria-hidden="true" className="absolute inset-0"></span>
                    Suministros
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-gray-500">Materiales y suministros para construcción</p>
              </div>
              <p className="text-sm font-medium text-gray-900">36 proveedores</p>
            </div>
          </div>

          {/* Categoría 3: Maquinaria */}
          <div className="group relative">
            <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
              <img
                src="https://images.unsplash.com/photo-1541625602330-2277a4c46182?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Maquinaria de construcción"
                className="w-full h-full object-center object-cover lg:w-full lg:h-full"
              />
            </div>
            <div className="mt-4 flex justify-between">
              <div>
                <h3 className="text-sm text-gray-700">
                  <Link href="/providers/machinery">
                    <span aria-hidden="true" className="absolute inset-0"></span>
                    Maquinaria
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-gray-500">Alquiler y venta de maquinaria</p>
              </div>
              <p className="text-sm font-medium text-gray-900">18 proveedores</p>
            </div>
          </div>
        </div>
      </div>

      {/* Proveedores destacados */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Destacados</h2>
            <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl sm:tracking-tight">
              Proveedores recomendados
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Proveedor 1 */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img className="h-12 w-12" src="https://via.placeholder.com/150" alt="Logo proveedor" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Herramientas Pro</h3>
                    <p className="text-sm text-gray-500">Herramientas profesionales</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-base text-gray-500">
                    Especialistas en herramientas profesionales para construcción y reformas.
                  </p>
                </div>
                <div className="mt-6">
                  <div className="flex items-center">
                    <div className="flex">
                      {[0, 1, 2, 3, 4].map((rating) => (
                        <svg
                          key={rating}
                          className="h-5 w-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                          />
                        </svg>
                      ))}
                    </div>
                    <p className="ml-2 text-sm text-gray-500">4.8 (120 reseñas)</p>
                  </div>
                </div>
                <div className="mt-6">
                  <a
                    href="#"
                    className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Ver perfil
                  </a>
                </div>
              </div>
            </div>

            {/* Proveedor 2 */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img className="h-12 w-12" src="https://via.placeholder.com/150" alt="Logo proveedor" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Materiales Express</h3>
                    <p className="text-sm text-gray-500">Suministros de construcción</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-base text-gray-500">
                    Entrega rápida de materiales de construcción de alta calidad.
                  </p>
                </div>
                <div className="mt-6">
                  <div className="flex items-center">
                    <div className="flex">
                      {[0, 1, 2, 3, 4].map((rating) => (
                        <svg
                          key={rating}
                          className={`h-5 w-5 ${
                            rating < 4 ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                          />
                        </svg>
                      ))}
                    </div>
                    <p className="ml-2 text-sm text-gray-500">4.2 (85 reseñas)</p>
                  </div>
                </div>
                <div className="mt-6">
                  <a
                    href="#"
                    className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Ver perfil
                  </a>
                </div>
              </div>
            </div>

            {/* Proveedor 3 */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img className="h-12 w-12" src="https://via.placeholder.com/150" alt="Logo proveedor" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Maquinaria Total</h3>
                    <p className="text-sm text-gray-500">Alquiler de maquinaria</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-base text-gray-500">
                    Alquiler de maquinaria pesada y ligera para todo tipo de proyectos.
                  </p>
                </div>
                <div className="mt-6">
                  <div className="flex items-center">
                    <div className="flex">
                      {[0, 1, 2, 3, 4].map((rating) => (
                        <svg
                          key={rating}
                          className={`h-5 w-5 ${
                            rating < 5 ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                          />
                        </svg>
                      ))}
                    </div>
                    <p className="ml-2 text-sm text-gray-500">5.0 (42 reseñas)</p>
                  </div>
                </div>
                <div className="mt-6">
                  <a
                    href="#"
                    className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Ver perfil
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <a
              href="#"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Ver todos los proveedores
            </a>
          </div>
        </div>
      </div>

      {/* Sección para proveedores */}
      <div className="bg-blue-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">¿Eres proveedor?</span>
            <span className="block text-blue-200">Anúnciate en nuestra plataforma</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a
                href="#"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
              >
                Registrarse como proveedor
              </a>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <a
                href="#"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Más información
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProvidersPage;
