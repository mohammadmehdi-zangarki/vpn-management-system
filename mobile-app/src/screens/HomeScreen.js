import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  I18nManager,
} from 'react-native';
import { getCategories } from '../api/api';

// Enable RTL for Persian
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

function HomeScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      Alert.alert('خطا', 'خطا در دریافت دسته‌بندی‌ها. لطفاً اتصال اینترنت خود را بررسی کنید.');
    }
    setLoading(false);
  };

  const handleCategoryPress = (category) => {
    navigation.navigate('ServerList', { categoryId: category.id, categoryName: category.name });
  };

  const handleAllServers = () => {
    navigation.navigate('ServerList', { categoryId: null, categoryName: 'همه سرورها' });
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
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>دسته‌بندی سرورها</Text>
        <Text style={styles.subtitle}>یک دسته‌بندی را انتخاب کنید</Text>

        <TouchableOpacity
          style={[styles.categoryCard, styles.allServersCard]}
          onPress={handleAllServers}
        >
          <Text style={styles.categoryName}>همه سرورها</Text>
          <Text style={styles.categoryDescription}>مشاهده تمام سرورهای موجود</Text>
        </TouchableOpacity>

        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryCard}
            onPress={() => handleCategoryPress(category)}
          >
            <Text style={styles.categoryName}>{category.name}</Text>
            {category.description && (
              <Text style={styles.categoryDescription}>{category.description}</Text>
            )}
          </TouchableOpacity>
        ))}

        {categories.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>هنوز دسته‌بندی ایجاد نشده است</Text>
            <TouchableOpacity style={styles.refreshButton} onPress={fetchCategories}>
              <Text style={styles.refreshButtonText}>تلاش مجدد</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
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
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  allServersCard: {
    backgroundColor: '#2563eb',
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
    textAlign: 'right',
  },
  categoryDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'right',
  },
  allServersCard: {
    backgroundColor: '#2563eb',
  },
  allServersCard: {
    backgroundColor: '#2563eb',
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

// Fix duplicate allServersCard
delete styles.allServersCard;
styles.allServersCard = {
  backgroundColor: '#2563eb',
};
styles.categoryName = {
  ...styles.categoryName,
};

export default HomeScreen;

