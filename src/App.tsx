import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';

import Home from '@/pages/Home';
import Listings from '@/pages/Listings';
import ListingDetail from '@/pages/ListingDetail';
import CreateListing from '@/pages/CreateListing';
import AIListing from '@/pages/AIListing';
import Automobiles from '@/pages/Automobiles';
import Categories from '@/pages/Categories';
import Favorites from '@/pages/Favorites';
import Profile from '@/pages/Profile';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import NotFound from '@/pages/NotFound';
import Messages from '@/pages/Messages';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/elanlar" element={<Listings />} />
              <Route path="/elanlar/:id" element={<ListingDetail />} />
              <Route path="/mesajlar" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
              <Route path="/mesajlar/:listingId" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
              <Route path="/elan-yerlesdir" element={<ProtectedRoute><CreateListing /></ProtectedRoute>} />
              <Route path="/ai-elan" element={<AIListing />} />
              <Route path="/avtomobiller" element={<Automobiles />} />
              <Route path="/kateqoriyalar" element={<Categories />} />
              <Route path="/favoriler" element={<Favorites />} />
              <Route path="/profil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/profil/elanlarim" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
