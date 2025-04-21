// API para obtener presupuestos recientes
import { NextRequest, NextResponse } from 'next/server';
import { BudgetService } from '../../../lib/budget/service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : 5;
    
    if (!userId) {
      return NextResponse.json({ error: 'Se requiere el ID del usuario' }, { status: 400 });
    }
    
    const budgetService = new BudgetService();
    const budgets = await budgetService.getBudgetsByUserId(userId, limit);
    
    // Obtener información adicional para cada presupuesto
    const budgetsWithDetails = await Promise.all(
      budgets.map(async (budget) => {
        const project = await budgetService.getProjectById(budget.projectId);
        return {
          ...budget,
          projectName: project ? project.name : 'Proyecto desconocido'
        };
      })
    );
    
    return NextResponse.json({ budgets: budgetsWithDetails });
  } catch (error) {
    console.error('Error en API de presupuestos recientes:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}
