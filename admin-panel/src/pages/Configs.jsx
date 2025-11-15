import { useState, useEffect } from 'react';
import { getConfigs, getCategories, createConfig, updateConfig, deleteConfig } from '../api/api';

function Configs() {
  const [configs, setConfigs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    config_url: '',
    category_id: '',
    is_active: true
  });

  useEffect(() => {
    fetchConfigs();
    fetchCategories();
  }, []);

  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const response = await getConfigs();
      setConfigs(response.data.configs);
    } catch (error) {
      console.error('Error fetching configs:', error);
      alert('خطا در دریافت کانفیگ‌ها');
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = {
        ...formData,
        category_id: formData.category_id ? parseInt(formData.category_id) : null
      };
      
      if (editingConfig) {
        await updateConfig(editingConfig.id, data);
        alert('کانفیگ با موفقیت ویرایش شد');
      } else {
        await createConfig(data);
        alert('کانفیگ با موفقیت ایجاد شد');
      }
      
      setShowModal(false);
      setFormData({ name: '', config_url: '', category_id: '', is_active: true });
      setEditingConfig(null);
      fetchConfigs();
    } catch (error) {
      console.error('Error saving config:', error);
      alert('خطا در ذخیره کانفیگ');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('آیا مطمئن هستید که می‌خواهید این کانفیگ را حذف کنید؟')) {
      return;
    }
    
    setLoading(true);
    try {
      await deleteConfig(id);
      alert('کانفیگ با موفقیت حذف شد');
      fetchConfigs();
    } catch (error) {
      console.error('Error deleting config:', error);
      alert('خطا در حذف کانفیگ');
    }
    setLoading(false);
  };

  const handleEdit = (config) => {
    setEditingConfig(config);
    setFormData({
      name: config.name,
      config_url: config.config_url,
      category_id: config.category_id || '',
      is_active: config.is_active === 1
    });
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingConfig(null);
    setFormData({ name: '', config_url: '', category_id: '', is_active: true });
    setShowModal(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">مدیریت کانفیگ‌ها</h2>
        <button
          onClick={handleAddNew}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + افزودن کانفیگ جدید
        </button>
      </div>

      {loading && !showModal && (
        <div className="text-center py-8">
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">نام</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">دسته‌بندی</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">لینک کانفیگ</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">وضعیت</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {configs.map((config) => (
              <tr key={config.id}>
                <td className="px-6 py-4 whitespace-nowrap">{config.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    {config.category_name || 'بدون دسته‌بندی'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-xs truncate text-sm text-gray-600" title={config.config_url}>
                    {config.config_url}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded text-sm ${
                    config.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {config.is_active ? 'فعال' : 'غیرفعال'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2 space-x-reverse">
                    <button
                      onClick={() => handleEdit(config)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ویرایش
                    </button>
                    <button
                      onClick={() => handleDelete(config.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {configs.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">هنوز کانفیگی ایجاد نشده است</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">
              {editingConfig ? 'ویرایش کانفیگ' : 'افزودن کانفیگ جدید'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">نام کانفیگ</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">لینک کانفیگ (vless://...)</label>
                <textarea
                  value={formData.config_url}
                  onChange={(e) => setFormData({ ...formData, config_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="vless://..."
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">دسته‌بندی</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">بدون دسته‌بندی</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="ml-2 w-4 h-4"
                  />
                  <span className="text-gray-700">فعال</span>
                </label>
              </div>
              
              <div className="flex space-x-2 space-x-reverse">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  {loading ? 'در حال ذخیره...' : 'ذخیره'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingConfig(null);
                    setFormData({ name: '', config_url: '', category_id: '', is_active: true });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Configs;

