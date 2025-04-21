// Corregir las rutas de importación en el archivo
import { NextRequest, NextResponse } from 'next/server';
import { PlanService } from '../../../../../lib/plan/service';

interface Params {
  params: {
    id: string;
  };
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    const data = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'Se requiere el ID de la anotación' }, { status: 400 });
    }
    
    const planService = new PlanService();
    const success = await planService.updateAnnotation(id, data);
    
    if (!success) {
      return NextResponse.json({ error: 'Error al actualizar la anotación' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en API de anotación:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ error: 'Se requiere el ID de la anotación' }, { status: 400 });
    }
    
    const planService = new PlanService();
    const success = await planService.deleteAnnotation(id);
    
    if (!success) {
      return NextResponse.json({ error: 'Error al eliminar la anotación' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en API de anotación:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}
