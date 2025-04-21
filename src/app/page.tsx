import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-blue-600">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Reforma de vivienda"
          />
          <div className="absolute inset-0 bg-blue-600 mix-blend-multiply" aria-hidden="true"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">TROOPPERS</h1>
          <p className="mt-6 text-xl text-blue-100 max-w-3xl">
            Tu plataforma integral para presupuestos de reformas, contratación de obras y proveedores de construcción
          </p>
          <div className="mt-10 flex space-x-4">
            <Link href="/dashboard/projects/new" className="inline-block bg-white py-3 px-6 border border-transparent rounded-md text-base font-medium text-blue-600 hover:bg-blue-50">
              Crear presupuesto
            </Link>
            <Link href="/contract" className="inline-block bg-blue-500 py-3 px-6 border border-transparent rounded-md text-base font-medium text-white hover:bg-blue-400">
              Contratar obra
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 space-y-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Todo en uno</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
              La solución completa para tus proyectos de reforma
            </p>
            <p className="mt-5 max-w-prose mx-auto text-xl text-gray-500">
              TROOPPERS te ofrece todas las herramientas que necesitas para planificar, presupuestar y ejecutar tus proyectos de reforma
            </p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Presupuestos detallados</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Crea presupuestos profesionales con partidas de albañilería, fontanería y electricidad. Activa o desactiva partidas según las necesidades de cada proyecto.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Gestión de planos</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Sube planos en PDF o CAD, o crea planos básicos desde cero. Personaliza los planos con anotaciones y medidas.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Contratación de obras</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Contrata directamente a profesionales cualificados para ejecutar tus proyectos de reforma con garantías y seguimiento.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Proveedores de confianza</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Accede a un directorio de proveedores verificados de herramientas, suministros y maquinaria para tus proyectos.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 5 */}
              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Exportación a PDF</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Descarga presupuestos en PDF con tu logo y el de tus clientes. Documentos profesionales listos para compartir.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 6 */}
              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Ahorro de tiempo</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Automatiza cálculos de precios, descuentos e impuestos. Genera presupuestos profesionales en minutos, no en horas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Todo lo que necesitas en un solo lugar</h2>
            <p className="mt-4 text-lg text-gray-500">
              TROOPPERS te ofrece una solución integral para tus proyectos de reforma
            </p>
          </div>
          <div className="mt-12 space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3 lg:gap-x-8">
            {/* Service 1 */}
            <div className="relative group">
              <div className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden bg-gray-100">
                <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1489&q=80" alt="Presupuestos" className="object-center object-cover group-hover:opacity-75" />
                <div className="flex items-end opacity-0 p-4 group-hover:opacity-100">
                  <div className="w-full bg-white bg-opacity-75 backdrop-filter backdrop-blur py-2 px-4 rounded-md text-sm font-medium text-gray-900 text-center">
                    Ver detalles
                  </div>
                </div>
              </div>
              <h3 className="mt-6 text-base font-semibold text-gray-900">
                <Link href="/dashboard">
                  <span className="absolute inset-0" />
                  Presupuestos de reformas
                </Link>
              </h3>
              <p className="text-sm text-gray-500">Crea presupuestos detallados para todo tipo de reformas con partidas personalizables.</p>
            </div>

            {/* Service 2 */}
            <div className="relative group">
              <div className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden bg-gray-100">
                <img src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Contratación" className="object-center object-cover group-hover:opacity-75" />
                <div className="flex items-end opacity-0 p-4 group-hover:opacity-100">
                  <div className="w-full bg-white bg-opacity-75 backdrop-filter backdrop-blur py-2 px-4 rounded-md text-sm font-medium text-gray-900 text-center">
                    Ver detalles
                  </div>
                </div>
              </div>
              <h3 className="mt-6 text-base font-semibold text-gray-900">
                <Link href="/contract">
                  <span className="absolute inset-0" />
                  Contratación de obras
                </Link>
              </h3>
              <p className="text-sm text-gray-500">Contrata profesionales cualificados para ejecutar tus proyectos con garantías.</p>
            </div>

            {/* Service 3 */}
            <div className="relative group">
              <div className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden bg-gray-100">
                <img src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80" alt="Proveedores" className="object-center object-cover group-hover:opacity-75" />
                <div className="flex items-end opacity-0 p-4 group-hover:opacity-100">
                  <div className="w-full bg-white bg-opacity-75 backdrop-filter backdrop-blur py-2 px-4 rounded-md text-sm font-medium text-gray-900 text-center">
                    Ver detalles
                  </div>
                </div>
              </div>
              <h3 className="mt-6 text-base font-semibold text-gray-900">
                <Link href="/providers">
                  <span className="absolute inset-0" />
                  Proveedores de construcción
                </Link>
              </h3>
              <p className="text-sm text-gray-500">Encuentra proveedores de herramientas, suministros y maquinaria para tus proyectos.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">¿Listo para empezar?</span>
            <span className="block">Regístrate gratis hoy mismo.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-200">
            Crea tu cuenta gratuita y comienza a gestionar tus proyectos de reforma de manera profesional.
          </p>
          <Link href="/register" className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 sm:w-auto">
            Registrarse gratis
          </Link>
        </div>
      </div>
    </div>
  );
}
