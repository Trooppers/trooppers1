export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  isLegalEntity: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LegalEntity {
  id: string;
  userId: string;
  companyName: string;
  taxId: string;
  address: string;
  phone: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  isLegalEntity: boolean;
  companyName?: string;
  taxId?: string;
  address?: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SocialLoginData {
  provider: 'google' | 'apple' | 'facebook';
  token: string;
}
