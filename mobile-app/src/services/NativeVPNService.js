import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const { V2RayVPN } = NativeModules;

/**
 * Native VPN Service که مستقیماً با Native Module ارتباط برقرار می‌کند
 */
class NativeVPNService {
  constructor() {
    this.isConnected = false;
    this.currentConfig = null;
    
    // راه‌اندازی Event Listener برای تغییرات وضعیت
    if (Platform.OS === 'android' && V2RayVPN) {
      const eventEmitter = new NativeEventEmitter(V2RayVPN);
      eventEmitter.addListener('onVPNStateChanged', (event) => {
        console.log('VPN State Changed:', event);
        this.isConnected = event.isConnected;
      });
    }
  }

  /**
   * درخواست مجوز VPN از کاربر
   */
  async requestVPNPermission() {
    try {
      if (Platform.OS === 'android' && V2RayVPN) {
        return await V2RayVPN.requestVPNPermission();
      }
      return true;
    } catch (error) {
      console.error('Error requesting VPN permission:', error);
      return false;
    }
  }

  /**
   * اتصال به سرور VPN با استفاده از کانفیگ
   * @param {string} configUrl - لینک کانفیگ vless://...
   * @returns {Promise<{success: boolean, message?: string, error?: string}>}
   */
  async connect(configUrl) {
    try {
      console.log('Connecting to VPN with config:', configUrl);
      
      if (Platform.OS !== 'android' || !V2RayVPN) {
        // برای iOS یا در صورت عدم وجود Native Module
        console.warn('Native VPN module not available. Using simulation mode.');
        return this.simulateConnection(configUrl);
      }

      // درخواست مجوز VPN
      const hasPermission = await this.requestVPNPermission();
      if (!hasPermission) {
        return {
          success: false,
          error: 'مجوز VPN داده نشده است. لطفاً مجوز را تایید کنید.'
        };
      }

      // اتصال به VPN
      const result = await V2RayVPN.connect(configUrl);
      
      if (result.success) {
        this.isConnected = true;
        this.currentConfig = configUrl;
        console.log('VPN Connected successfully');
      }
      
      return result;
      
    } catch (error) {
      console.error('Error connecting to VPN:', error);
      return {
        success: false,
        error: error.message || 'خطا در اتصال به سرور'
      };
    }
  }

  /**
   * قطع اتصال VPN
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async disconnect() {
    try {
      console.log('Disconnecting VPN');
      
      if (Platform.OS !== 'android' || !V2RayVPN) {
        this.isConnected = false;
        this.currentConfig = null;
        return { success: true };
      }

      const result = await V2RayVPN.disconnect();
      
      if (result.success) {
        this.isConnected = false;
        this.currentConfig = null;
        console.log('VPN Disconnected successfully');
      }
      
      return result;
      
    } catch (error) {
      console.error('Error disconnecting VPN:', error);
      return {
        success: false,
        error: error.message || 'خطا در قطع اتصال'
      };
    }
  }

  /**
   * دریافت وضعیت اتصال
   * @returns {Promise<{isConnected: boolean, config?: string}>}
   */
  async getConnectionStatus() {
    try {
      if (Platform.OS !== 'android' || !V2RayVPN) {
        return {
          isConnected: this.isConnected,
          config: this.currentConfig
        };
      }

      return await V2RayVPN.getConnectionStatus();
    } catch (error) {
      console.error('Error getting connection status:', error);
      return {
        isConnected: false,
        config: null
      };
    }
  }

  /**
   * شبیه‌سازی اتصال (برای تست بدون Native Module)
   */
  async simulateConnection(configUrl) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isConnected = true;
        this.currentConfig = configUrl;
        resolve({
          success: true,
          message: 'به سرور متصل شدید (حالت شبیه‌سازی)'
        });
      }, 1000);
    });
  }
}

export default new NativeVPNService();

