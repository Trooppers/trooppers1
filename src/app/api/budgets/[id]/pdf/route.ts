// Corregir las rutas de importación en el archivo
import { NextRequest, NextResponse } from 'next/server';
import { BudgetService } from '../../../../../lib/budget/service';

// Implementación alternativa sin pdfmake para evitar problemas de dependencias
interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ error: 'Se requiere el ID del presupuesto' }, { status: 400 });
    }
    
    const budgetService = new BudgetService();
    const budget = await budgetService.getBudgetById(id);
    
    if (!budget) {
      return NextResponse.json({ error: 'Presupuesto no encontrado' }, { status: 404 });
    }
    
    const budgetItems = await budgetService.getBudgetItemsByBudgetId(id);
    const project = await budgetService.getProjectById(budget.projectId);
    
    if (!project) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
    }
    
    // En lugar de generar un PDF directamente, devolvemos los datos para que el frontend
    // pueda generar el PDF usando bibliotecas del lado del cliente
    return NextResponse.json({ 
      budget, 
      items: budgetItems, 
      project,
      success: true,
      message: 'Datos del presupuesto obtenidos correctamente'
    });
  } catch (error) {
    console.error('Error al generar datos para PDF:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}
