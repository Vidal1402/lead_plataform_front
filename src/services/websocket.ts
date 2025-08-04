import { io, Socket } from 'socket.io-client';
import { LeadGenerationProgress } from '../types/leads';

class WebSocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  connect(token: string) {
    if (this.socket?.connected) return;

    this.socket = io(process.env.REACT_APP_WS_URL || 'http://localhost:5000', {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('🔌 WebSocket conectado');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('🔌 WebSocket desconectado');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Erro na conexão WebSocket:', error);
      this.isConnected = false;
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  startLeadGeneration(filters: any, onProgress: (progress: LeadGenerationProgress) => void) {
    if (!this.socket?.connected) {
      throw new Error('WebSocket não conectado');
    }

    this.socket.emit('start-lead-generation', filters);

    this.socket.on('generation-progress', (progress: LeadGenerationProgress) => {
      onProgress(progress);
    });

    this.socket.on('generation-complete', (progress: LeadGenerationProgress) => {
      onProgress(progress);
    });

    this.socket.on('generation-error', (error: any) => {
      console.error('❌ Erro na geração:', error);
      throw new Error(error.message || 'Erro na geração de leads');
    });
  }

  stopLeadGeneration() {
    if (this.socket?.connected) {
      this.socket.emit('stop-lead-generation');
    }
  }

  getConnectionStatus() {
    return this.isConnected;
  }
}

export const wsService = new WebSocketService();
export default wsService; 