// Servicio de autenticación para interactuar con la base de datos

import { D1Database } from '@cloudflare/workers-types';
import { getCloudflareContext } from '../../app/counter';
import { 
  User, 
  LegalEntity, 
  LoginCredentials, 
  RegisterUserData,
  AuthProvider
} from './types';
import { 
  generateId, 
  hashPassword, 
  verifyPassword, 
  generateToken,
  validateRegisterData
} from './utils';

export class AuthService {
  private db: D1Database;

  constructor() {
    const { env } = getCloudflareContext();
    this.db = env.DB;
  }

  // Registrar un nuevo usuario
  async registerUser(data: RegisterUserData): Promise<{ success: boolean; user?: User; error?: string }> {
    // Validar datos
    const validation = validateRegisterData(data);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    try {
      // Verificar si el email ya existe
      const existingUser = await this.getUserByEmail(data.email);
      if (existingUser) {
        return { success: false, error: 'El email ya está registrado' };
      }

      // Hashear contraseña
      const hashedPassword = await hashPassword(data.password);

      // Generar ID único
      const userId = generateId();

      // Crear usuario
      const user: User = {
        id: userId,
        email: data.email,
        name: data.name,
        phone: data.phone || null,
        userType: 'user', // Por defecto, todos los usuarios nuevos son de tipo 'user'
        authProvider: 'email',
        entityType: data.entityType,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Insertar usuario en la base de datos
      await this.db.prepare(`
        INSERT INTO users (
          id, email, password_hash, name, phone, user_type, 
          auth_provider, entity_type, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        user.id,
        user.email,
        hashedPassword,
        user.name,
        user.phone,
        user.userType,
        user.authProvider,
        user.entityType,
        user.createdAt.toISOString(),
        user.updatedAt.toISOString()
      ).run();

      // Si es una entidad legal, crear registro adicional
      if (data.entityType === 'legal' && data.companyName && data.taxId) {
        const legalEntityId = generateId();
        const legalEntity: LegalEntity = {
          id: legalEntityId,
          userId: user.id,
          companyName: data.companyName,
          taxId: data.taxId,
          address: data.address,
          postalCode: data.postalCode,
          city: data.city,
          province: data.province,
          country: data.country,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        await this.db.prepare(`
          INSERT INTO legal_entities (
            id, user_id, company_name, tax_id, address, postal_code,
            city, province, country, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          legalEntity.id,
          legalEntity.userId,
          legalEntity.companyName,
          legalEntity.taxId,
          legalEntity.address,
          legalEntity.postalCode,
          legalEntity.city,
          legalEntity.province,
          legalEntity.country,
          legalEntity.createdAt.toISOString(),
          legalEntity.updatedAt.toISOString()
        ).run();
      }

      return { success: true, user };
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      return { success: false, error: 'Error al registrar usuario' };
    }
  }

  // Iniciar sesión con email y contraseña
  async login(credentials: LoginCredentials): Promise<{ success: boolean; token?: string; user?: User; error?: string }> {
    try {
      // Buscar usuario por email
      const user = await this.getUserByEmail(credentials.email);
      if (!user) {
        return { success: false, error: 'Credenciales inválidas' };
      }

      // Obtener hash de contraseña
      const { password_hash } = await this.db.prepare(`
        SELECT password_hash FROM users WHERE email = ?
      `).bind(credentials.email).first() as { password_hash: string };

      // Verificar contraseña
      const isValid = await verifyPassword(credentials.password, password_hash);
      if (!isValid) {
        return { success: false, error: 'Credenciales inválidas' };
      }

      // Generar token
      const token = generateToken(user);

      return { success: true, token, user };
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return { success: false, error: 'Error al iniciar sesión' };
    }
  }

  // Iniciar sesión con proveedor social
  async socialLogin(provider: AuthProvider, providerId: string, email: string, name: string): Promise<{ success: boolean; token?: string; user?: User; error?: string }> {
    try {
      // Buscar si el usuario ya existe con este proveedor
      let user = await this.getUserBySocialProvider(provider, providerId);
      
      // Si no existe con este proveedor pero sí con este email, actualizar el usuario
      if (!user) {
        const existingUser = await this.getUserByEmail(email);
        if (existingUser) {
          // Actualizar usuario con nuevo proveedor
          await this.db.prepare(`
            UPDATE users 
            SET auth_provider = ?, auth_provider_id = ?, updated_at = ?
            WHERE id = ?
          `).bind(
            provider,
            providerId,
            new Date().toISOString(),
            existingUser.id
          ).run();
          
          user = existingUser;
        } else {
          // Crear nuevo usuario
          const userId = generateId();
          user = {
            id: userId,
            email,
            name,
            userType: 'user',
            authProvider: provider,
            authProviderId: providerId,
            entityType: 'physical', // Por defecto, los usuarios de redes sociales son personas físicas
            createdAt: new Date(),
            updatedAt: new Date()
          };

          await this.db.prepare(`
            INSERT INTO users (
              id, email, name, user_type, auth_provider, 
              auth_provider_id, entity_type, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            user.id,
            user.email,
            user.name,
            user.userType,
            user.authProvider,
            user.authProviderId,
            user.entityType,
            user.createdAt.toISOString(),
            user.updatedAt.toISOString()
          ).run();
        }
      }

      // Generar token
      const token = generateToken(user);

      return { success: true, token, user };
    } catch (error) {
      console.error('Error en inicio de sesión social:', error);
      return { success: false, error: 'Error en inicio de sesión social' };
    }
  }

  // Obtener usuario por ID
  async getUserById(id: string): Promise<User | null> {
    try {
      const result = await this.db.prepare(`
        SELECT * FROM users WHERE id = ?
      `).bind(id).first();

      if (!result) return null;

      return this.mapDbUserToUser(result);
    } catch (error) {
      console.error('Error al obtener usuario por ID:', error);
      return null;
    }
  }

  // Obtener usuario por email
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const result = await this.db.prepare(`
        SELECT * FROM users WHERE email = ?
      `).bind(email).first();

      if (!result) return null;

      return this.mapDbUserToUser(result);
    } catch (error) {
      console.error('Error al obtener usuario por email:', error);
      return null;
    }
  }

  // Obtener usuario por proveedor social
  async getUserBySocialProvider(provider: AuthProvider, providerId: string): Promise<User | null> {
    try {
      const result = await this.db.prepare(`
        SELECT * FROM users WHERE auth_provider = ? AND auth_provider_id = ?
      `).bind(provider, providerId).first();

      if (!result) return null;

      return this.mapDbUserToUser(result);
    } catch (error) {
      console.error('Error al obtener usuario por proveedor social:', error);
      return null;
    }
  }

  // Obtener entidad legal por ID de usuario
  async getLegalEntityByUserId(userId: string): Promise<LegalEntity | null> {
    try {
      const result = await this.db.prepare(`
        SELECT * FROM legal_entities WHERE user_id = ?
      `).bind(userId).first();

      if (!result) return null;

      return this.mapDbLegalEntityToLegalEntity(result);
    } catch (error) {
      console.error('Error al obtener entidad legal:', error);
      return null;
    }
  }

  // Mapear resultado de base de datos a objeto User
  private mapDbUserToUser(dbUser: any): User {
    return {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      phone: dbUser.phone,
      userType: dbUser.user_type,
      authProvider: dbUser.auth_provider,
      authProviderId: dbUser.auth_provider_id,
      entityType: dbUser.entity_type,
      createdAt: new Date(dbUser.created_at),
      updatedAt: new Date(dbUser.updated_at)
    };
  }

  // Mapear resultado de base de datos a objeto LegalEntity
  private mapDbLegalEntityToLegalEntity(dbLegalEntity: any): LegalEntity {
    return {
      id: dbLegalEntity.id,
      userId: dbLegalEntity.user_id,
      companyName: dbLegalEntity.company_name,
      taxId: dbLegalEntity.tax_id,
      address: dbLegalEntity.address,
      postalCode: dbLegalEntity.postal_code,
      city: dbLegalEntity.city,
      province: dbLegalEntity.province,
      country: dbLegalEntity.country,
      logoUrl: dbLegalEntity.logo_url,
      createdAt: new Date(dbLegalEntity.created_at),
      updatedAt: new Date(dbLegalEntity.updated_at)
    };
  }
}
