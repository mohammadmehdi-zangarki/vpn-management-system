import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Categories from './pages/Categories';
import Configs from './pages/Configs';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation */}
        <nav className="bg-blue-600 text-white shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-8 space-x-reverse">
                <h1 className="text-xl font-bold">پنل مدیریت VPN</h1>
                <div className="flex space-x-4 space-x-reverse">
                  <Link 
                    to="/" 
                    className="px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    دسته‌بندی‌ها
                  </Link>
                  <Link 
                    to="/configs" 
                    className="px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    کانفیگ‌ها
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Categories />} />
            <Route path="/configs" element={<Configs />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

