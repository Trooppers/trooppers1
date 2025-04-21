// API para gestionar proyectos
import { NextRequest, NextResponse } from 'next/server';
import { BudgetService } from '../../../lib/budget/service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'Se requiere el ID de usuario' }, { status: 400 });
    }
    
    const budgetService = new BudgetService();
    const projects = await budgetService.getProjectsByUserId(userId);
    
    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error en API de proyectos:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { userId, ...projectData } = data;
    
    if (!userId) {
      return NextResponse.json({ error: 'Se requiere el ID de usuario' }, { status: 400 });
    }
    
    if (!projectData.name) {
      return NextResponse.json({ error: 'El nombre del proyecto es obligatorio' }, { status: 400 });
    }
    
    const budgetService = new BudgetService();
    const project = await budgetService.createProject(userId, projectData);
    
    if (!project) {
      return NextResponse.json({ error: 'Error al crear el proyecto' }, { status: 500 });
    }
    
    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error('Error en API de proyectos:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}
