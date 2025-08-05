import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../services/api';
import toast from 'react-hot-toast';

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
      try {
        console.log('🔐 Verificando token com backend...');
        const response = await authApi.getMe();
        setUser(response.data); // Corrigido: dados vêm diretamente em response.data
        setToken(savedToken);
        console.log('✅ Token válido, usuário autenticado');
      } catch (error: any) {
        // ...existing code...
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
const { token, user } = response.data;
if (!token) throw new Error('Token não recebido do servidor');
localStorage.setItem('token', token);
setToken(token);
setUser(user);
console.log('✅ Login realizado com sucesso');
    } catch (error: any) {
      console.error('❌ Erro no login:', error);
      
      let errorMessage = 'Erro ao fazer login';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Erro de conexão. Verifique se o backend está rodando na porta 5000.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    console.log('Chamando register do contexto:', name, email, password); // <-- Adicione aqui
  try {
    // ...existing code...
  } catch (error: any) {
    // ...existing code...
  }
  try {
    const response = await authApi.register(name, email, password);
    console.log('Resposta do backend:', response);
    console.log('response.data:', response.data);
    const { token, user } = response.data;
if (!token) throw new Error('Token não recebido do servidor');
localStorage.setItem('token', token);
setToken(token);
setUser(user);
console.log('✅ Registro realizado com sucesso');
  } catch (error: any) {
    console.error('❌ Erro no registro:', error);

    let errorMessage = 'Erro ao criar conta';

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.code === 'ERR_NETWORK') {
      errorMessage = 'Erro de conexão. Verifique se o backend está rodando na porta 5000.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    // Mostre o erro para o usuário (opcional)
    toast.error(errorMessage);

    // Interrompa a execução após o erro
    return; // <-- Adicione este return
  }
};

  const logout = () => {
    console.log('🚪 Fazendo logout...');
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    console.log('✅ Logout concluído');
  };

  const updateProfile = async (data: { name?: string; email?: string }) => {
    try {
      const response = await authApi.updateProfile(data);
      setUser(response.data.data);
      console.log('✅ Perfil atualizado com sucesso');
    } catch (error: any) {
      console.error('❌ Erro ao atualizar perfil:', error);
      
      let errorMessage = 'Erro ao atualizar perfil';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      throw new Error(errorMessage);
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