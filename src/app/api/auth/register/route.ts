// API para registro de usuarios
import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '../../../../lib/auth/service';
import { RegisterUserData } from '../../../../lib/auth/types';

export async function POST(request: NextRequest) {
  try {
    const data: RegisterUserData = await request.json();
    const authService = new AuthService();
    
    const result = await authService.registerUser(data);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Usuario registrado correctamente',
      user: result.user
    }, { status: 201 });
  } catch (error) {
    console.error('Error en API de registro:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}
