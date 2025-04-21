// API para inicio de sesión
import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '../../../../lib/auth/service';
import { LoginCredentials } from '../../../../lib/auth/types';

export async function POST(request: NextRequest) {
  try {
    const credentials: LoginCredentials = await request.json();
    const authService = new AuthService();
    
    const result = await authService.login(credentials);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }
    
    // Si el usuario es una entidad legal, obtener información adicional
    let legalEntity = null;
    if (result.user && result.user.entityType === 'legal') {
      legalEntity = await authService.getLegalEntityByUserId(result.user.id);
    }
    
    return NextResponse.json({ 
      success: true, 
      token: result.token,
      user: result.user,
      legalEntity
    });
  } catch (error) {
    console.error('Error en API de login:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}
