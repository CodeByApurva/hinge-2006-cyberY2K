import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { ThemeProvider } from './contexts/ThemeContext';
import AppShell from './components/AppShell/AppShell';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Discover from './pages/Discover/Discover';
import Profile from './pages/Profile/Profile';
import Matches from './pages/Matches/Matches';
import Chat from './pages/Chat/Chat';
import Settings from './pages/Settings/Settings';
import BehindTheDesign from './pages/BehindTheDesign/BehindTheDesign';
import './styles/global.css';

// Guard component that redirects to login if the user is not authenticated
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
}

// Redirects logged in users away from the login page to the dashboard
function GuestGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  return !isLoggedIn ? <>{children}</> : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <BrowserRouter>
            <Routes>
              {/* Guest Routes */}
              <Route 
                path="/login" 
                element={
                  <GuestGuard>
                    <Login />
                  </GuestGuard>
                } 
              />

              {/* Authenticated Routes with AppShell */}
              <Route 
                path="/" 
                element={
                  <AuthGuard>
                    <AppShell />
                  </AuthGuard>
                }
              >
                <Route index element={<Home />} />
                <Route path="discover" element={<Discover />} />
                <Route path="profile/:id" element={<Profile />} />
                <Route path="matches" element={<Matches />} />
                <Route path="chat" element={<Chat />} />
                <Route path="settings" element={<Settings />} />
                <Route path="behind-the-design" element={<BehindTheDesign />} />
              </Route>

              {/* Catch-all Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
