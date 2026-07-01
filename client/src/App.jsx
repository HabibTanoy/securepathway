import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ProgressProvider } from './hooks/useProgress';
import { LangProvider } from './hooks/useLang';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import Training from './pages/Training';
import Admin from './pages/Admin';
import Onboarding from './pages/Onboarding';
import Profile from './pages/Profile';

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', fontFamily:'system-ui' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/training" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login"    element={user ? <Navigate to="/training" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/training" /> : <Register />} />
      <Route path="/"         element={<Landing />} />
      <Route path="/training/*" element={<ProtectedRoute><Training /></ProtectedRoute>} />
      <Route path="/onboarding/*" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
      <Route path="/admin/*"  element={<ProtectedRoute roles={['manager','admin']}><Admin /></ProtectedRoute>} />
      <Route path="/profile"  element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="*"         element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LangProvider>
        <AuthProvider>
          <ProgressProvider>
            <AppRoutes />
          </ProgressProvider>
        </AuthProvider>
      </LangProvider>
    </BrowserRouter>
  );
}
