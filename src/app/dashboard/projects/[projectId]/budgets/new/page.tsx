'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Importación corregida del contexto de autenticación
import { useAuth } from '../../../../../lib/auth/context';
import { Category, Subcategory, Item, BudgetFormData } from '../../../../../lib/budget/types';

interface NewBudgetPageProps {
  params: {
    projectId: string;
  };
}

export default function NewBudgetPage({ params }: NewBudgetPageProps) {
  const { projectId } = params;
  const { user } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<{ [key: string]: Subcategory[] }>({});
  const [items, setItems] = useState<{ [key: string]: Item[] }>({});
  const [project, setProject] = useState<any>(null);
  
  const [formData, setFormData] = useState<BudgetFormData>({
    name: '',
    description: '',
    projectId: projectId,
    discountPercentage: 0,
    taxPercentage: 21, // IVA por defecto en España
    items: []
  });
  
  const [selectedItems, setSelectedItems] = useState<{
    categoryId: string;
    subcategoryId: string;
    itemId: string;
    quantity: number;
    unitMaterialPrice: number;
    unitLaborPrice: number;
    isActive: boolean;
    notes: string;
  }[]>([]);

  // Cargar proyecto
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}`);
        
        if (!response.ok) {
          throw new Error('Error al cargar el proyecto');
        }
        
        const data = await response.json();
        setProject(data.project);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el proyecto');
      }
    };
    
    fetchProject();
  }, [projectId]);

  // Cargar categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        
        if (!response.ok) {
          throw new Error('Error al cargar categorías');
        }
        
        const data = await response.json();
        setCategories(data.categories);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar categorías');
      }
    };
    
    fetchCategories();
  }, []);

  // Cargar subcategorías para una categoría
  const fetchSubcategories = async (categoryId: string) => {
    if (subcategories[categoryId]) return;
    
    try {
      const response = await fetch(`/api/subcategories?categoryId=${categoryId}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar subcategorías');
      }
      
      const data = await response.json();
      setSubcategories(prev => ({
        ...prev,
        [categoryId]: data.subcategories
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar subcategorías');
    }
  };

  // Cargar items para una subcategoría
  const fetchItems = async (subcategoryId: string) => {
    if (items[subcategoryId]) return;
    
    try {
      const response = await fetch(`/api/items?subcategoryId=${subcategoryId}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar items');
      }
      
      const data = await response.json();
      setItems(prev => ({
        ...prev,
        [subcategoryId]: data.items
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar items');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddItem = () => {
    setSelectedItems(prev => [
      ...prev,
      {
        categoryId: '',
        subcategoryId: '',
        itemId: '',
        quantity: 1,
        unitMaterialPrice: 0,
        unitLaborPrice: 0,
        isActive: true,
        notes: ''
      }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setSelectedItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    setSelectedItems(prev => {
      const newItems = [...prev];
      (newItems[index] as any)[field] = value;
      
      // Si cambia la categoría, resetear subcategoría e item
      if (field === 'categoryId') {
        newItems[index].subcategoryId = '';
        newItems[index].itemId = '';
        fetchSubcategories(value);
      }
      
      // Si cambia la subcategoría, resetear item
      if (field === 'subcategoryId') {
        newItems[index].itemId = '';
        fetchItems(value);
      }
      
      // Si cambia el item, actualizar precios
      if (field === 'itemId' && value) {
        const subcategoryId = newItems[index].subcategoryId;
        const selectedItem = items[subcategoryId]?.find(item => item.id === value);
        
        if (selectedItem) {
          newItems[index].unitMaterialPrice = selectedItem.materialPrice;
          newItems[index].unitLaborPrice = selectedItem.laborPrice;
        }
      }
      
      return newItems;
    });
  };

  const calculateSubtotal = () => {
    let subtotal = 0;
    
    selectedItems.forEach(item => {
      if (item.isActive && item.itemId) {
        const totalPrice = (item.unitMaterialPrice + item.unitLaborPrice) * item.quantity;
        subtotal += totalPrice;
      }
    });
    
    return subtotal;
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    return (subtotal * Number(formData.discountPercentage)) / 100;
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const baseAmount = subtotal - discount;
    return (baseAmount * Number(formData.taxPercentage)) / 100;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const tax = calculateTax();
    return subtotal - discount + tax;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Debes iniciar sesión para crear un presupuesto');
      return;
    }
    
    if (!formData.name.trim()) {
      setError('El nombre del presupuesto es obligatorio');
      return;
    }
    
    if (selectedItems.length === 0) {
      setError('Debes añadir al menos un item al presupuesto');
      return;
    }
    
    // Validar que todos los items tengan los campos requeridos
    const invalidItems = selectedItems.filter(item => !item.itemId || item.quantity <= 0);
    if (invalidItems.length > 0) {
      setError('Todos los items deben tener un producto seleccionado y una cantidad mayor a 0');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Preparar datos para enviar
      const budgetData = {
        ...formData,
        items: selectedItems.map(item => ({
          itemId: item.itemId,
          quantity: item.quantity,
          unitMaterialPrice: item.unitMaterialPrice,
          unitLaborPrice: item.unitLaborPrice,
          isActive: item.isActive,
          notes: item.notes
        }))
      };
      
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(budgetData),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al crear el presupuesto');
      }
      
      const data = await response.json();
      router.push(`/dashboard/budgets/${data.budget.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el presupuesto');
    } finally {
      setLoading(false);
    }
  };

  if (!project) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Nuevo Presupuesto
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Proyecto: {project.name}
        </p>
      </div>
      
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Resto del formulario se mantiene igual */}
          {/* ... */}
        </form>
      </div>
    </div>
  );
}
