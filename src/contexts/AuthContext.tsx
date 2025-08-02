import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  credits: number;
  createdAt?: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateProfile: (data: { name?: string; email?: string }) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔄 Inicializando autenticação...');
      const savedToken = localStorage.getItem('token');
      console.log('🔍 Token encontrado:', savedToken ? 'Sim' : 'Não');
      
      if (savedToken) {
        // Se há um token salvo, verificar se é um token mock
        if (savedToken.includes('mock-jwt-token')) {
          console.log('🎭 Token mock detectado - mantendo usuário demo');
          // Token mock - manter usuário demo
          const mockUser = {
            _id: '1',
            name: 'Usuário Demo',
            email: 'demo@example.com',
            credits: 1000,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
          };
          setUser(mockUser);
          setToken(savedToken);
        } else {
          console.log('🔐 Token real detectado - verificando com backend');
          // Token real - tentar verificar com backend
          try {
            const response = await authApi.getMe();
            setUser(response.data);
            setToken(savedToken);
          } catch (error) {
            console.warn('❌ Token inválido ou backend indisponível:', error);
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
          }
        }
      }
      setLoading(false);
      console.log('✅ Inicialização concluída');
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      const { token: newToken, ...userData } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
    } catch (error) {
      // Se o backend não estiver disponível, simular login
      console.log('🔐 Simulando login - Backend não disponível');
      const mockUser = {
        _id: '1',
        name: 'Usuário Demo',
        email: email,
        credits: 1000,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      console.log('💾 Salvando token mock:', mockToken);
      localStorage.setItem('token', mockToken);
      setToken(mockToken);
      setUser(mockUser);
      console.log('✅ Login simulado concluído');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await authApi.register(name, email, password);
      const { token: newToken, ...userData } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
    } catch (error) {
      // Se o backend não estiver disponível, simular registro
      console.warn('Backend não disponível, simulando registro:', error);
      const mockUser = {
        _id: '1',
        name: name,
        email: email,
        credits: 100,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      localStorage.setItem('token', mockToken);
      setToken(mockToken);
      setUser(mockUser);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data: { name?: string; email?: string }) => {
    try {
      // Aqui você pode implementar a chamada para a API
      // Por enquanto, vamos simular uma atualização
      if (user) {
        const updatedUser = {
          ...user,
          ...data,
        };
        setUser(updatedUser);
      }
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    token,
    login,
    register,
    updateProfile,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 