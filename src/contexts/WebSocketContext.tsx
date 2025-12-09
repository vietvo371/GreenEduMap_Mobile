import React, { createContext, useContext, useEffect, useState } from 'react';
import WebSocketService from '../services/websocket';
import AsyncStorage from '@react-native-async-storage/async-storage';
import env from '../config/env';

interface WebSocketContextType {
  isConnected: boolean;
  subscribe: (channel: string) => void;
  unsubscribe: (channel: string) => void;
  listen: (channel: string, event: string, callback: (data: any) => void) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initWebSocket = async () => {
      try {
        if (!env.ENABLE_WEBSOCKET) {
          console.log('⚠️ WebSocket disabled in env');
          return;
        }

        const token = await AsyncStorage.getItem('@auth_token');
        if (!token) {
          console.log('⚠️ No auth token, skipping WebSocket');
          return;
        }

        console.log('🚀 Initializing WebSocket...');
        await WebSocketService.connect();
        
        if (mounted) {
          setIsConnected(true);
        }
      } catch (error) {
        console.error('❌ Failed to initialize WebSocket:', error);
      }
    };

    initWebSocket();

    return () => {
      mounted = false;
      WebSocketService.disconnect();
    };
  }, []);

  const subscribe = (channel: string) => {
    WebSocketService.subscribe(channel);
  };

  const unsubscribe = (channel: string) => {
    WebSocketService.unsubscribe(channel);
  };

  const listen = (channel: string, event: string, callback: (data: any) => void) => {
    WebSocketService.listen(channel, event, callback);
  };

  return (
    <WebSocketContext.Provider value={{ isConnected, subscribe, unsubscribe, listen }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
};
