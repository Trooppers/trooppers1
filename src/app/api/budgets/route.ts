// Corregir las rutas de importación en el archivo
import { NextRequest, NextResponse } from 'next/server';
import { BudgetService } from '../../../../lib/budget/service';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (!data.projectId) {
      return NextResponse.json({ error: 'Se requiere el ID del proyecto' }, { status: 400 });
    }
    
    if (!data.name) {
      return NextResponse.json({ error: 'El nombre del presupuesto es obligatorio' }, { status: 400 });
    }
    
    if (!data.items || data.items.length === 0) {
      return NextResponse.json({ error: 'Se requiere al menos un item en el presupuesto' }, { status: 400 });
    }
    
    const budgetService = new BudgetService();
    const budget = await budgetService.createBudget(data);
    
    if (!budget) {
      return NextResponse.json({ error: 'Error al crear el presupuesto' }, { status: 500 });
    }
    
    return NextResponse.json({ budget }, { status: 201 });
  } catch (error) {
    console.error('Error en API de presupuestos:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}
