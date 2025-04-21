// API para gestionar un plano específico
import { NextRequest, NextResponse } from 'next/server';
import { PlanService } from '../../../../lib/plan/service';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ error: 'Se requiere el ID del plano' }, { status: 400 });
    }
    
    const planService = new PlanService();
    const plan = await planService.getPlanById(id);
    
    if (!plan) {
      return NextResponse.json({ error: 'Plano no encontrado' }, { status: 404 });
    }
    
    const annotations = await planService.getAnnotationsByPlanId(id);
    
    return NextResponse.json({ plan, annotations });
  } catch (error) {
    console.error('Error en API de plano:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    const formData = await request.formData();
    
    if (!id) {
      return NextResponse.json({ error: 'Se requiere el ID del plano' }, { status: 400 });
    }
    
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const fileType = formData.get('fileType') as 'pdf' | 'cad' | 'generated';
    const floorNumber = parseInt(formData.get('floorNumber') as string, 10);
    const file = formData.get('file') as File | null;
    
    if (!name) {
      return NextResponse.json({ error: 'El nombre del plano es obligatorio' }, { status: 400 });
    }
    
    const planService = new PlanService();
    
    // Verificar si el plano existe
    const existingPlan = await planService.getPlanById(id);
    if (!existingPlan) {
      return NextResponse.json({ error: 'Plano no encontrado' }, { status: 404 });
    }
    
    // Si hay un nuevo archivo, procesarlo
    let fileUrl: string | undefined;
    if (file) {
      // En una implementación real, aquí subiríamos el archivo a un almacenamiento
      // y obtendríamos una URL. Para este ejemplo, simulamos una URL
      fileUrl = `https://example.com/plans/${Date.now()}_${file.name}`;
    }
    
    const success = await planService.updatePlan(id, {
      name,
      description,
      fileType,
      floorNumber: isNaN(floorNumber) ? 0 : floorNumber
    }, fileUrl);
    
    if (!success) {
      return NextResponse.json({ error: 'Error al actualizar el plano' }, { status: 500 });
    }
    
    const updatedPlan = await planService.getPlanById(id);
    
    return NextResponse.json({ plan: updatedPlan });
  } catch (error) {
    console.error('Error en API de plano:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ error: 'Se requiere el ID del plano' }, { status: 400 });
    }
    
    const planService = new PlanService();
    const success = await planService.deletePlan(id);
    
    if (!success) {
      return NextResponse.json({ error: 'Error al eliminar el plano' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en API de plano:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}
