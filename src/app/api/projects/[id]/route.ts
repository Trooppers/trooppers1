// API para gestionar un proyecto específico
import { NextRequest, NextResponse } from 'next/server';
import { BudgetService } from '../../../../lib/budget/service';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ error: 'Se requiere el ID del proyecto' }, { status: 400 });
    }
    
    const budgetService = new BudgetService();
    const project = await budgetService.getProjectById(id);
    
    if (!project) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
    }
    
    return NextResponse.json({ project });
  } catch (error) {
    console.error('Error en API de proyecto:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    const data = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'Se requiere el ID del proyecto' }, { status: 400 });
    }
    
    if (!data.name) {
      return NextResponse.json({ error: 'El nombre del proyecto es obligatorio' }, { status: 400 });
    }
    
    const budgetService = new BudgetService();
    const success = await budgetService.updateProject(id, data);
    
    if (!success) {
      return NextResponse.json({ error: 'Error al actualizar el proyecto' }, { status: 500 });
    }
    
    const updatedProject = await budgetService.getProjectById(id);
    
    return NextResponse.json({ project: updatedProject });
  } catch (error) {
    console.error('Error en API de proyecto:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ error: 'Se requiere el ID del proyecto' }, { status: 400 });
    }
    
    const budgetService = new BudgetService();
    const success = await budgetService.deleteProject(id);
    
    if (!success) {
      return NextResponse.json({ error: 'Error al eliminar el proyecto' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en API de proyecto:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}
