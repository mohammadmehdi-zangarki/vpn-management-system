import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Clipboard,
  ToastAndroid,
  Platform,
} from 'react-native';
import { getConfigs, getConfigsByCategory } from '../api/api';
import NativeVPNService from '../services/NativeVPNService';

function ServerListScreen({ route }) {
  const { categoryId, categoryName } = route.params;
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connectedId, setConnectedId] = useState(null);

  useEffect(() => {
    fetchConfigs();
  }, [categoryId]);

  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const data = categoryId 
        ? await getConfigsByCategory(categoryId)
        : await getConfigs();
      setConfigs(data.filter(c => c.is_active === 1));
    } catch (error) {
      Alert.alert('خطا', 'خطا در دریافت سرورها. لطفاً اتصال اینترنت خود را بررسی کنید.');
    }
    setLoading(false);
  };

  const showToast = (message) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('', message);
    }
  };

  const handleConnect = async (config) => {
    try {
      // اتصال به VPN با استفاده از Native Module
      const result = await NativeVPNService.connect(config.config_url);
      
      if (result.success) {
        setConnectedId(config.id);
        Alert.alert(
          'اتصال موفق',
          'به سرور متصل شدید. اکنون ترافیک شما از این سرور عبور می‌کند.',
          [{ text: 'باشه' }]
        );
      } else {
        Alert.alert('خطا', result.error || 'خطا در اتصال به سرور');
      }
    } catch (error) {
      Alert.alert('خطا', 'خطا در اتصال به سرور. لطفاً دوباره تلاش کنید.');
    }
  };

  const handleDisconnect = async () => {
    try {
      const result = await NativeVPNService.disconnect();
      if (result.success) {
        setConnectedId(null);
        showToast('اتصال قطع شد');
      }
    } catch (error) {
      Alert.alert('خطا', 'خطا در قطع اتصال');
    }
  };

  const handleCopyConfig = (configUrl) => {
    Clipboard.setString(configUrl);
    showToast('لینک کانفیگ کپی شد');
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>در حال بارگذاری...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>{categoryName}</Text>
          <Text style={styles.subtitle}>
            {configs.length} سرور موجود
          </Text>

          {connectedId && (
            <TouchableOpacity
              style={styles.disconnectButton}
              onPress={handleDisconnect}
            >
              <Text style={styles.disconnectButtonText}>قطع اتصال</Text>
            </TouchableOpacity>
          )}

          {configs.map((config) => (
            <View key={config.id} style={styles.serverCard}>
              <View style={styles.serverHeader}>
                <Text style={styles.serverName}>{config.name}</Text>
                {connectedId === config.id && (
                  <View style={styles.connectedBadge}>
                    <Text style={styles.connectedBadgeText}>متصل</Text>
                  </View>
                )}
              </View>
              
              {config.category_name && (
                <Text style={styles.serverCategory}>{config.category_name}</Text>
              )}

              <View style={styles.configUrlContainer}>
                <Text style={styles.configUrlLabel}>لینک کانفیگ:</Text>
                <Text style={styles.configUrl} numberOfLines={1}>
                  {config.config_url}
                </Text>
              </View>

              <View style={styles.buttonContainer}>
                {connectedId === config.id ? (
                  <TouchableOpacity
                    style={[styles.button, styles.connectedButton]}
                    onPress={handleDisconnect}
                  >
                    <Text style={styles.buttonText}>قطع اتصال</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.button, styles.connectButton]}
                    onPress={() => handleConnect(config)}
                    disabled={connectedId !== null}
                  >
                    <Text style={styles.buttonText}>اتصال</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity
                  style={[styles.button, styles.copyButton]}
                  onPress={() => handleCopyConfig(config.config_url)}
                >
                  <Text style={styles.buttonText}>کپی لینک</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {configs.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>سروری در این دسته‌بندی یافت نشد</Text>
              <TouchableOpacity style={styles.refreshButton} onPress={fetchConfigs}>
                <Text style={styles.refreshButtonText}>تلاش مجدد</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'right',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
    textAlign: 'right',
  },
  disconnectButton: {
    backgroundColor: '#ef4444',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  disconnectButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  serverCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serverName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
    flex: 1,
  },
  serverCategory: {
    fontSize: 14,
    color: '#2563eb',
    marginBottom: 8,
    textAlign: 'right',
  },
  connectedBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  connectedBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  configUrlContainer: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  configUrlLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
    textAlign: 'right',
  },
  configUrl: {
    fontSize: 12,
    color: '#1f2937',
    fontFamily: 'monospace',
    textAlign: 'left',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  connectButton: {
    backgroundColor: '#2563eb',
  },
  connectedButton: {
    backgroundColor: '#ef4444',
  },
  copyButton: {
    backgroundColor: '#6b7280',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
  },
  refreshButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ServerListScreen;

