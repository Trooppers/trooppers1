'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PlanFormData } from '../../../../../lib/plan/types';

interface NewPlanPageProps {
  params: {
    projectId: string;
  };
}

export default function NewPlanPage({ params }: NewPlanPageProps) {
  const { projectId } = params;
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<PlanFormData>({
    name: '',
    description: '',
    projectId: projectId,
    fileType: 'pdf',
    floorNumber: 0
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Para el generador de planos
  const [generatorData, setGeneratorData] = useState({
    width: 800,
    length: 600,
    rooms: [
      { name: 'Salón', x: 50, y: 50, width: 300, length: 200, type: 'living' as const },
      { name: 'Cocina', x: 400, y: 50, width: 200, length: 150, type: 'kitchen' as const },
      { name: 'Baño', x: 50, y: 300, width: 150, length: 150, type: 'bathroom' as const },
      { name: 'Dormitorio', x: 250, y: 300, width: 250, length: 200, type: 'bedroom' as const }
    ]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('El nombre del plano es obligatorio');
      return;
    }
    
    // Validar que si el tipo es pdf o cad, se haya seleccionado un archivo
    if ((formData.fileType === 'pdf' || formData.fileType === 'cad') && !selectedFile && !isGenerating) {
      setError('Debes seleccionar un archivo para planos PDF o CAD');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Si estamos generando un plano
      if (isGenerating) {
        // Crear datos para la generación del plano
        const generateData = {
          projectId: formData.projectId,
          name: formData.name,
          description: formData.description,
          floorNumber: formData.floorNumber,
          ...generatorData
        };
        
        const response = await fetch('/api/plans/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(generateData),
        });
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Error al generar el plano');
        }
        
        const data = await response.json();
        router.push(`/dashboard/plans/${data.plan.id}`);
        return;
      }
      
      // Si estamos subiendo un archivo
      const formDataToSend = new FormData();
      formDataToSend.append('projectId', formData.projectId);
      formDataToSend.append('name', formData.name);
      if (formData.description) formDataToSend.append('description', formData.description);
      formDataToSend.append('fileType', formData.fileType);
      formDataToSend.append('floorNumber', formData.floorNumber.toString());
      if (selectedFile) formDataToSend.append('file', selectedFile);
      
      const response = await fetch('/api/plans', {
        method: 'POST',
        body: formDataToSend,
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al crear el plano');
      }
      
      const data = await response.json();
      router.push(`/dashboard/plans/${data.plan.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el plano');
    } finally {
      setLoading(false);
    }
  };

  const toggleGenerateMode = () => {
    setIsGenerating(!isGenerating);
    setFormData(prev => ({
      ...prev,
      fileType: isGenerating ? 'pdf' : 'generated'
    }));
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Nuevo Plano
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          {isGenerating ? 'Genera un plano básico' : 'Sube un plano existente'}
        </p>
      </div>
      
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <div className="mb-6">
          <button
            type="button"
            onClick={toggleGenerateMode}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isGenerating ? 'Subir plano existente' : 'Generar plano básico'}
          </button>
        </div>
        
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nombre del plano *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Descripción
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="floorNumber" className="block text-sm font-medium text-gray-700">
                Número de planta
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="floorNumber"
                  id="floorNumber"
                  min="0"
                  value={formData.floorNumber}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            {!isGenerating && (
              <>
                <div className="sm:col-span-3">
                  <label htmlFor="fileType" className="block text-sm font-medium text-gray-700">
                    Tipo de archivo
                  </label>
                  <div className="mt-1">
                    <select
                      id="fileType"
                      name="fileType"
                      value={formData.fileType}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="pdf">PDF</option>
                      <option value="cad">CAD</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Archivo
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Subir un archivo</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept={formData.fileType === 'pdf' ? '.pdf' : '.dwg,.dxf'}
                          />
                        </label>
                        <p className="pl-1">o arrastra y suelta</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        {formData.fileType === 'pdf' ? 'PDF' : 'CAD (.dwg, .dxf)'} hasta 10MB
                      </p>
                      {selectedFile && (
                        <p className="text-sm text-green-600">
                          Archivo seleccionado: {selectedFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {isGenerating && (
              <div className="sm:col-span-6 border-t border-gray-200 pt-6">
                <h4 className="text-lg font-medium text-gray-900">Generador de planos</h4>
                <p className="text-sm text-gray-500 mb-4">
                  Define las dimensiones y habitaciones para generar un plano básico
                </p>
                
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="width" className="block text-sm font-medium text-gray-700">
                      Ancho (px)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        id="width"
                        min="200"
                        max="2000"
                        value={generatorData.width}
                        onChange={(e) => setGeneratorData(prev => ({ ...prev, width: parseInt(e.target.value) }))}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="length" className="block text-sm font-medium text-gray-700">
                      Largo (px)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        id="length"
                        min="200"
                        max="2000"
                        value={generatorData.length}
                        onChange={(e) => setGeneratorData(prev => ({ ...prev, length: parseInt(e.target.value) }))}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-6">
                    <h5 className="text-md font-medium text-gray-900 mb-2">Habitaciones</h5>
                    
                    {generatorData.rooms.map((room, index) => (
                      <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md">
                        <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6">
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Nombre
                            </label>
                            <input
                              type="text"
                              value={room.name}
                              onChange={(e) => {
                                const newRooms = [...generatorData.rooms];
                                newRooms[index].name = e.target.value;
                                setGeneratorData(prev => ({ ...prev, rooms: newRooms }));
                              }}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Tipo
                            </label>
                            <select
                              value={room.type}
                              onChange={(e) => {
                                const newRooms = [...generatorData.rooms];
                                newRooms[index].type = e.target.value as any;
                                setGeneratorData(prev => ({ ...prev, rooms: newRooms }));
                              }}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                              <option value="bedroom">Dormitorio</option>
                              <option value="bathroom">Baño</option>
                              <option value="kitchen">Cocina</option>
                              <option value="living">Salón</option>
                              <option value="dining">Comedor</option>
                              <option value="other">Otro</option>
                            </select>
                          </div>
                          
                          <div className="sm:col-span-1">
                            <label className="block text-sm font-medium text-gray-700">
                              X
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={room.x}
                              onChange={(e) => {
                                const newRooms = [...generatorData.rooms];
                                newRooms[index].x = parseInt(e.target.value);
                                setGeneratorData(prev => ({ ...prev, rooms: newRooms }));
                              }}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          
                          <div className="sm:col-span-1">
                            <label className="block text-sm font-medium text-gray-700">
                              Y
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={room.y}
                              onChange={(e) => {
                                const newRooms = [...generatorData.rooms];
                                newRooms[index].y = parseInt(e.target.value);
                                setGeneratorData(prev => ({ ...prev, rooms: newRooms }));
                              }}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          
                          <div className="sm:col-span-1">
                            <label className="block text-sm font-medium text-gray-700">
                              Ancho
                            </label>
                            <input
                              type="number"
                              min="50"
                              value={room.width}
                              onChange={(e) => {
                                const newRooms = [...generatorData.rooms];
                                newRooms[index].width = parseInt(e.target.value);
                                setGeneratorData(prev => ({ ...prev, rooms: newRooms }));
                              }}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          
                          <div className="sm:col-span-1">
                            <label className="block text-sm font-medium text-gray-700">
                              Largo
                            </label>
                            <input
                              type="number"
                              min="50"
                              value={room.length}
                              onChange={(e) => {
                                const newRooms = [...generatorData.rooms];
                                newRooms[index].length = parseInt(e.target.value);
                                setGeneratorData(prev => ({ ...prev, rooms: newRooms }));
                              }}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          
                          <div className="sm:col-span-6 flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                const newRooms = [...generatorData.rooms];
                                newRooms.splice(index, 1);
                                setGeneratorData(prev => ({ ...prev, rooms: newRooms }));
                              }}
                              className="text-sm text-red-600 hover:text-red-500"
                            >
                              Eliminar habitación
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={() => {
                        setGeneratorData(prev => ({
                          ...prev,
                          rooms: [
                            ...prev.rooms,
                            { name: 'Nueva habitación', x: 50, y: 50, width: 200, length: 150, type: 'other' as const }
                          ]
                        }));
                      }}
                      className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Añadir habitación
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-5 border-t border-gray-200">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => router.push('/dashboard/plans')}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar plano'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
