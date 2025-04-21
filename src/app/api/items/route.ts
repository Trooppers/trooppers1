// API para gestionar items
import { NextRequest, NextResponse } from 'next/server';
import { BudgetService } from '../../../lib/budget/service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subcategoryId = searchParams.get('subcategoryId');
    
    if (!subcategoryId) {
      return NextResponse.json({ error: 'Se requiere el ID de la subcategoría' }, { status: 400 });
    }
    
    const budgetService = new BudgetService();
    const items = await budgetService.getItemsBySubcategoryId(subcategoryId);
    
    return NextResponse.json({ items });
  } catch (error) {
    console.error('Error en API de items:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}
