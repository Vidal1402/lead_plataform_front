import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const AuthDebug: React.FC = () => {
  const { user, token, loading } = useAuth();

  return (
    <div className="fixed top-4 left-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border text-xs">
      <h3 className="font-semibold mb-2">Auth Debug</h3>
      <div className="space-y-1">
        <div>Loading: {loading ? '✅ Sim' : '❌ Não'}</div>
        <div>Token: {token ? '✅ Presente' : '❌ Ausente'}</div>
        <div>User: {user ? '✅ Logado' : '❌ Não logado'}</div>
        {user && (
          <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded">
            <div>Nome: {user.name}</div>
            <div>Email: {user.email}</div>
            <div>Créditos: {user.credits}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthDebug; 