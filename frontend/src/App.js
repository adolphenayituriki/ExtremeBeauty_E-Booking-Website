import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingButtons from './components/FloatingButtons';
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Booking from './pages/Booking';
import Contact from './pages/Contact';
import Tracking from './pages/Tracking';
import { AuthProvider, useAuth } from './context/AdminAuthContext';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import BookingsAdmin from './pages/admin/BookingsAdmin';
import ContactsAdmin from './pages/admin/ContactsAdmin';
import ServicesAdmin from './pages/admin/ServicesAdmin';
import ContentAdmin from './pages/admin/ContentAdmin';
import AdminsAdmin from './pages/admin/AdminsAdmin';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }
  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

const OwnerRoute = ({ children }) => {
  const { admin, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }
  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }
  if (admin.role !== 'superadmin') {
    return <Navigate to="/admin" replace />;
  }
  return children;
};

const PublicNavbar = () => {
  const { pathname } = useLocation();
  if (pathname.startsWith('/admin')) return null;
  return <Navbar />;
};

const PublicFooter = () => {
  const { pathname } = useLocation();
  if (pathname.startsWith('/admin')) return null;
  return <Footer />;
};

const PublicFloating = () => {
  const { pathname } = useLocation();
  if (pathname.startsWith('/admin')) return null;
  return <FloatingButtons />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <ScrollToTop />
          <PublicNavbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/tracking" element={<Tracking />} />

              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="bookings" element={<BookingsAdmin />} />
                <Route path="contacts" element={<ContactsAdmin />} />
                <Route path="services" element={<ServicesAdmin />} />
                <Route path="content" element={<ContentAdmin />} />
                <Route path="admins" element={<OwnerRoute><AdminsAdmin /></OwnerRoute>} />
              </Route>
            </Routes>
          </main>
          <PublicFooter />
          <PublicFloating />
          <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
