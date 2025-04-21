// Corregir las rutas de importación en el archivo
import { NextRequest, NextResponse } from 'next/server';
import { BudgetService } from '../../../../../lib/budget/service';

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
    
    return NextResponse.json({ budget, items: budgetItems });
  } catch (error) {
    console.error('Error en API de presupuesto:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    const data = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'Se requiere el ID del presupuesto' }, { status: 400 });
    }
    
    const budgetService = new BudgetService();
    const success = await budgetService.updateBudget(id, data);
    
    if (!success) {
      return NextResponse.json({ error: 'Error al actualizar el presupuesto' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en API de presupuesto:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ error: 'Se requiere el ID del presupuesto' }, { status: 400 });
    }
    
    const budgetService = new BudgetService();
    const success = await budgetService.deleteBudget(id);
    
    if (!success) {
      return NextResponse.json({ error: 'Error al eliminar el presupuesto' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en API de presupuesto:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}
