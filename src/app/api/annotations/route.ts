// Corregir las rutas de importación en el archivo
import { NextRequest, NextResponse } from 'next/server';
import { PlanService } from '../../../../lib/plan/service';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (!data.planId) {
      return NextResponse.json({ error: 'Se requiere el ID del plano' }, { status: 400 });
    }
    
    if (data.xPosition === undefined || data.yPosition === undefined || 
        data.width === undefined || data.height === undefined) {
      return NextResponse.json({ error: 'Se requieren las coordenadas y dimensiones de la anotación' }, { status: 400 });
    }
    
    if (!data.annotationType) {
      return NextResponse.json({ error: 'Se requiere el tipo de anotación' }, { status: 400 });
    }
    
    const planService = new PlanService();
    const annotation = await planService.createAnnotation(data);
    
    if (!annotation) {
      return NextResponse.json({ error: 'Error al crear la anotación' }, { status: 500 });
    }
    
    return NextResponse.json({ annotation }, { status: 201 });
  } catch (error) {
    console.error('Error en API de anotaciones:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}
