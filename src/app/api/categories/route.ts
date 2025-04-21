// API para gestionar categorías
import { NextRequest, NextResponse } from 'next/server';
import { BudgetService } from '../../../lib/budget/service';

export async function GET(request: NextRequest) {
  try {
    const budgetService = new BudgetService();
    const categories = await budgetService.getAllCategories();
    
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error en API de categorías:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}
