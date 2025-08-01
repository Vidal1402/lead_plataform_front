// Tipos de usuário
export interface User {
  _id: string;
  name: string;
  email: string;
  credits: number;
  createdAt: string;
  updatedAt: string;
}

// Tipos de lead
export interface Lead {
  _id: string;
  nome: string;
  email: string;
  telefone?: string;
  idade: number;
  cidade: string;
  estado: string;
  pais: string;
  nicho: string;
  score: number;
  dataInsercao: string;
}

// Tipos de filtros
export interface LeadFilters {
  nicho: string;
  cidade?: string;
  estado?: string;
  pais?: string;
  idadeMin?: number;
  idadeMax?: number;
  includePhone?: boolean;
  includeEmail?: boolean;
  includeWebsite?: boolean;
  limit?: number;
}

// Tipos de histórico de busca
export interface SearchHistory {
  filters: LeadFilters;
  date: string;
  totalLeads: number;
  creditsUsed: number;
}

// Tipos de pacotes
export interface Package {
  id: string;
  name: string;
  credits: number;
  price: number;
  priceId: number;
  popular: boolean;
}

// Tipos de pagamento
export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created: number;
  credits: string;
  package: string;
}

// Tipos de estatísticas
export interface LeadStats {
  totalLeads: number;
  avgAge: number;
  avgScore: number;
  topNichos: Array<{
    _id: string;
    count: number;
  }>;
}

// Tipos de resposta da API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: {
    message: string;
  };
}

// Tipos de formulários
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ProfileForm {
  name: string;
  email: string;
}

export interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Tipos de nichos disponíveis
export const NICHOS = [
  'estetica',
  'petshop',
  'advocacia',
  'medicina',
  'educacao',
  'tecnologia',
  'financas',
  'imoveis',
  'automoveis',
  'beleza',
  'fitness',
  'gastronomia',
  'moda',
  'turismo',
  'outros'
] as const;

export type Nicho = typeof NICHOS[number];

// Tipos de estados brasileiros
export const ESTADOS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
] as const;

export type Estado = typeof ESTADOS[number]; 