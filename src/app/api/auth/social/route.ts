// API para autenticación social
import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '../../../../lib/auth/service';
import { AuthProvider } from '../../../../lib/auth/types';

export async function POST(request: NextRequest) {
  try {
    const { provider, providerId, email, name } = await request.json();
    
    if (!provider || !providerId || !email || !name) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
    }
    
    const authService = new AuthService();
    
    const result = await authService.socialLogin(
      provider as AuthProvider,
      providerId,
      email,
      name
    );
    
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
    console.error('Error en API de autenticación social:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}
