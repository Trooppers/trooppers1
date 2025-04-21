// API para generar planos
import { NextRequest, NextResponse } from 'next/server';
import { PlanService } from '../../../../lib/plan/service';
import { GeneratePlanData } from '../../../../lib/plan/types';

export async function POST(request: NextRequest) {
  try {
    const data: GeneratePlanData = await request.json();
    
    if (!data.projectId) {
      return NextResponse.json({ error: 'Se requiere el ID del proyecto' }, { status: 400 });
    }
    
    if (!data.name) {
      return NextResponse.json({ error: 'El nombre del plano es obligatorio' }, { status: 400 });
    }
    
    if (!data.width || !data.length) {
      return NextResponse.json({ error: 'Las dimensiones del plano son obligatorias' }, { status: 400 });
    }
    
    if (!data.rooms || data.rooms.length === 0) {
      return NextResponse.json({ error: 'Se requiere al menos una habitación' }, { status: 400 });
    }
    
    const planService = new PlanService();
    const plan = await planService.generatePlan(data);
    
    if (!plan) {
      return NextResponse.json({ error: 'Error al generar el plano' }, { status: 500 });
    }
    
    return NextResponse.json({ plan }, { status: 201 });
  } catch (error) {
    console.error('Error en API de generación de planos:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}
