// API para gestionar subcategorías
import { NextRequest, NextResponse } from 'next/server';
import { BudgetService } from '../../../lib/budget/service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    
    if (!categoryId) {
      return NextResponse.json({ error: 'Se requiere el ID de la categoría' }, { status: 400 });
    }
    
    const budgetService = new BudgetService();
    const subcategories = await budgetService.getSubcategoriesByCategoryId(categoryId);
    
    return NextResponse.json({ subcategories });
  } catch (error) {
    console.error('Error en API de subcategorías:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}
