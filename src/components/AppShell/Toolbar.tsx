import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import './AppShell.css';

export default function Toolbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Home';
    if (path === '/discover') return 'Discover People';
    if (path.startsWith('/profile')) return 'Profile';
    if (path === '/matches') return 'My Matches';
    if (path.startsWith('/chat')) return 'Messages';
    if (path === '/settings') return 'Settings';
    if (path === '/behind-the-design') return 'Behind the Design';
    return 'Hinge 2006';
  };

  return (
    <div className="toolbar">
      <div className="toolbar__left">
        <button className="xp-btn--toolbar toolbar__nav-btn" onClick={() => navigate(-1)} title="Back">
          ‹ Back
        </button>
        <button className="xp-btn--toolbar toolbar__nav-btn" onClick={() => navigate(1)} title="Forward">
          Forward ›
        </button>
        <div className="toolbar__separator" />
        <button className="xp-btn--toolbar" onClick={() => navigate('/')} title="Home">
          ⌂ Home
        </button>
        <button className="xp-btn--toolbar" onClick={() => navigate('/discover')} title="Discover">
          ⌕ Discover
        </button>
      </div>
      <div className="toolbar__address">
        <span className="toolbar__address-label">Address</span>
        <div className="toolbar__address-bar">
          <span className="toolbar__address-icon">📄</span>
          <span className="toolbar__address-text">hinge2006://app/{getPageTitle().toLowerCase().replace(/ /g, '-')}</span>
        </div>
      </div>
      <div className="toolbar__right">
        <button className="xp-btn--toolbar" onClick={toggleTheme} title={`Switch to ${theme === 'xp' ? 'Chrome Platinum' : 'Ion Blue'} theme`}>
          ◈ Theme
        </button>
        <button className="xp-btn--toolbar" onClick={logout} title="Sign Out">
          ⏻ Sign Out
        </button>
      </div>
    </div>
  );
}
