import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './lib/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import Home from './pages/Home';
import Compose from './pages/Compose';
import BouquetBuilder from './pages/BouquetBuilder';
import Finish from './pages/Finish';
import Gift from './pages/Gift';
import Preview from './pages/Preview';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Flowers from './pages/Flowers';
import NotFound from './pages/NotFound';

// Routes that render full-screen with no marketing chrome.
const BARE_ROUTES = ['/gift', '/preview'];

function Shell({ children }) {
  const { pathname } = useLocation();
  const bare = BARE_ROUTES.some((r) => pathname.startsWith(r));
  if (bare) return children;
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Shell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/compose" element={<Compose />} />
          <Route path="/compose/bouquet" element={<BouquetBuilder />} />
          <Route path="/compose/finish" element={<Finish />} />
          <Route path="/gift" element={<Gift />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/flowers" element={<Flowers />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Shell>
    </AuthProvider>
  );
}
