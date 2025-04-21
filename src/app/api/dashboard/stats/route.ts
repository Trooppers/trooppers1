// API para obtener estadísticas del dashboard
import { NextRequest, NextResponse } from 'next/server';
import { BudgetService } from '../../../lib/budget/service';
import { PlanService } from '../../../lib/plan/service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'Se requiere el ID del usuario' }, { status: 400 });
    }
    
    // Obtener estadísticas de proyectos
    const budgetService = new BudgetService();
    const projects = await budgetService.getProjectsByUserId(userId);
    
    // Obtener estadísticas de presupuestos
    const budgets = await budgetService.getBudgetsByUserId(userId);
    
    // Obtener estadísticas de planos
    const planService = new PlanService();
    let plans = [];
    
    // Para cada proyecto, obtener sus planos
    for (const project of projects) {
      const projectPlans = await planService.getPlansByProjectId(project.id);
      plans = [...plans, ...projectPlans];
    }
    
    return NextResponse.json({
      projects: projects.length,
      budgets: budgets.length,
      plans: plans.length
    });
  } catch (error) {
    console.error('Error en API de estadísticas:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}
