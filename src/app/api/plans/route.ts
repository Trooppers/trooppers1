// API para gestionar planos
import { NextRequest, NextResponse } from 'next/server';
import { PlanService } from '../../../lib/plan/service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    
    if (!projectId) {
      return NextResponse.json({ error: 'Se requiere el ID del proyecto' }, { status: 400 });
    }
    
    const planService = new PlanService();
    const plans = await planService.getPlansByProjectId(projectId);
    
    return NextResponse.json({ plans });
  } catch (error) {
    console.error('Error en API de planos:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const projectId = formData.get('projectId') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const fileType = formData.get('fileType') as 'pdf' | 'cad' | 'generated';
    const floorNumber = parseInt(formData.get('floorNumber') as string, 10);
    const file = formData.get('file') as File | null;
    
    if (!projectId) {
      return NextResponse.json({ error: 'Se requiere el ID del proyecto' }, { status: 400 });
    }
    
    if (!name) {
      return NextResponse.json({ error: 'El nombre del plano es obligatorio' }, { status: 400 });
    }
    
    if (!fileType) {
      return NextResponse.json({ error: 'El tipo de archivo es obligatorio' }, { status: 400 });
    }
    
    // Si es un plano subido, debe tener un archivo
    if ((fileType === 'pdf' || fileType === 'cad') && !file) {
      return NextResponse.json({ error: 'Se requiere un archivo para planos PDF o CAD' }, { status: 400 });
    }
    
    const planService = new PlanService();
    
    // Si es un plano generado, no necesitamos procesar el archivo
    if (fileType === 'generated') {
      // En una implementación real, aquí procesaríamos los datos para generar el plano
      // Para este ejemplo, simplemente creamos un plano con tipo 'generated'
      const plan = await planService.createPlan({
        projectId,
        name,
        description,
        fileType,
        floorNumber: isNaN(floorNumber) ? 0 : floorNumber
      });
      
      if (!plan) {
        return NextResponse.json({ error: 'Error al crear el plano' }, { status: 500 });
      }
      
      return NextResponse.json({ plan }, { status: 201 });
    }
    
    // Para planos subidos, procesamos el archivo
    if (file) {
      // En una implementación real, aquí subiríamos el archivo a un almacenamiento
      // y obtendríamos una URL. Para este ejemplo, simulamos una URL
      const fileUrl = `https://example.com/plans/${Date.now()}_${file.name}`;
      
      const plan = await planService.createPlan({
        projectId,
        name,
        description,
        fileType,
        floorNumber: isNaN(floorNumber) ? 0 : floorNumber
      }, fileUrl);
      
      if (!plan) {
        return NextResponse.json({ error: 'Error al crear el plano' }, { status: 500 });
      }
      
      return NextResponse.json({ plan }, { status: 201 });
    }
    
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  } catch (error) {
    console.error('Error en API de planos:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}
