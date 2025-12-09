import Pusher from 'pusher-js/react-native';
import Echo from 'laravel-echo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import env from '../config/env';

// Make Pusher available globally for Laravel Echo
(window as any).Pusher = Pusher;

const getEchoConfig = () => ({
  broadcaster: 'reverb',
  key: env.REVERB_APP_KEY,
  wsHost: env.REVERB_HOST,
  wsPort: env.REVERB_PORT,
  wssPort: env.REVERB_PORT,
  forceTLS: env.REVERB_SCHEME === 'https',
  enabledTransports: ['ws', 'wss'],
  authEndpoint: `${env.API_URL}/broadcasting/auth`,
  auth: {
    headers: {} as any,
  },
});

class WebSocketService {
  private echo: Echo<any> | null = null;
  private pusher: Pusher | null = null;
  private channels: Map<string, any> = new Map();
  private isConnected: boolean = false;

  async connect() {
    if (this.echo) {
      console.log('⚠️ WebSocket already connected');
      return this.echo;
    }

    try {
      // Get auth token
      const token = await AsyncStorage.getItem('@auth_token');
      console.log('🔑 Token found:', token ? `${token.substring(0, 20)}...` : 'No token');
      
      const config = getEchoConfig();
      
      if (token) {
        config.auth.headers = {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        };
      }

      // Initialize Laravel Echo
      this.echo = new Echo(config);
      
      console.log('✅ Laravel Echo created successfully');
      
      // Get Pusher instance for connection events
      this.pusher = (this.echo as any)?.connector?.pusher;
      
      if (!this.pusher) {
        console.error('❌ Pusher instance not available');
        return this.echo;
      }
      
      console.log('🚀 Pusher instance obtained');
      
      // Bind connection events
      this.pusher.connection.bind('connected', () => {
        console.log('✅ WebSocket connected');
        this.isConnected = true;
      });

      this.pusher.connection.bind('disconnected', () => {
        console.log('❌ WebSocket disconnected');
        this.isConnected = false;
      });

      this.pusher.connection.bind('error', (err: any) => {
        console.error('❌ WebSocket error:', err);
        this.isConnected = false;
      });

      return this.echo;
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      throw error;
    }
  }

  disconnect() {
    if (this.echo) {
      this.echo.disconnect();
      this.echo = null;
      this.pusher = null;
      this.channels.clear();
      this.isConnected = false;
      console.log('🔌 WebSocket disconnected');
    }
  }

  subscribe(channelName: string) {
    if (!this.echo) {
      throw new Error('WebSocket not connected');
    }

    if (this.channels.has(channelName)) {
      return this.channels.get(channelName);
    }

    console.log(`📡 Subscribing to ${channelName}...`);
    
    const channel = channelName.startsWith('private-')
      ? this.echo.private(channelName.replace('private-', ''))
      : this.echo.channel(channelName);
    
    this.channels.set(channelName, channel);
    console.log(`✅ Subscribed to ${channelName}`);
    
    return channel;
  }

  unsubscribe(channelName: string) {
    if (this.channels.has(channelName) && this.echo) {
      this.echo.leave(channelName.replace('private-', ''));
      this.channels.delete(channelName);
    }
  }

  listen(channelName: string, eventName: string, callback: (data: any) => void) {
    const channel = this.channels.get(channelName);
    if (!channel) {
      throw new Error(`Channel ${channelName} not subscribed`);
    }

    channel.listen(eventName, callback);
    console.log(`👂 Listening to ${eventName} on ${channelName}`);
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

export default new WebSocketService();
