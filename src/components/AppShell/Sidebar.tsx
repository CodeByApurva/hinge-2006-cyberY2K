import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import Avatar from '../common/Avatar';
import './AppShell.css';

const navItems = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/discover', label: 'Discover', icon: '🔍' },
  { path: '/matches', label: 'Matches', icon: '💕' },
  { path: '/chat', label: 'Messages', icon: '💬' },
  { path: '/profile/user-self', label: 'My Profile', icon: '👤' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function Sidebar() {
  const { user } = useAuth();
  const { getUnreadCount, matches, conversations } = useApp();
  const location = useLocation();
  const unreadCount = getUnreadCount();

  const totalUnreadMessages = conversations.reduce((total, conv) => {
    return total + conv.messages.filter(m => !m.read && m.senderId !== 'user-self').length;
  }, 0);

  return (
    <aside className="sidebar">
      {/* User Profile Mini Card */}
      <div className="sidebar__profile">
        <Avatar name={user?.displayName || 'User'} size={48} status={user?.status} showStatus />
        <div className="sidebar__profile-info">
          <div className="sidebar__profile-name">{user?.displayName}</div>
          <div className="sidebar__profile-status">
            <span className={`status-dot status-dot--${(user?.status || 'offline').toLowerCase()}`} />
            {user?.status}
          </div>
        </div>
      </div>

      <div className="xp-divider" />

      {/* Navigation */}
      <nav className="sidebar__nav">
        <div className="sidebar__nav-header">
          <span className="sidebar__nav-header-icon">📂</span>
          Navigation
        </div>
        {navItems.map(item => {
          const isActive = item.path === '/' 
            ? location.pathname === '/' 
            : location.pathname.startsWith(item.path);
          
          let badge: number | null = null;
          if (item.path === '/matches') badge = matches.length;
          if (item.path === '/chat' && totalUnreadMessages > 0) badge = totalUnreadMessages;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`sidebar__nav-item ${isActive ? 'sidebar__nav-item--active' : ''}`}
            >
              <span className="sidebar__nav-icon">{item.icon}</span>
              <span className="sidebar__nav-label">{item.label}</span>
              {badge !== null && badge > 0 && (
                <span className="sidebar__nav-badge">{badge}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="xp-divider" />

      {/* Quick Links */}
      <div className="sidebar__section">
        <div className="sidebar__nav-header">
          <span className="sidebar__nav-header-icon">⭐</span>
          Quick Links
        </div>
        <NavLink to="/behind-the-design" className={`sidebar__nav-item ${location.pathname === '/behind-the-design' ? 'sidebar__nav-item--active' : ''}`}>
          <span className="sidebar__nav-icon">📖</span>
          <span className="sidebar__nav-label">Behind the Design</span>
        </NavLink>
      </div>

      {/* Notification area */}
      {unreadCount > 0 && (
        <>
          <div className="xp-divider" />
          <div className="sidebar__notifications">
            <span className="sidebar__notif-icon">🔔</span>
            <span>{unreadCount} new notification{unreadCount > 1 ? 's' : ''}</span>
          </div>
        </>
      )}

      {/* Bottom branding */}
      <div className="sidebar__footer">
        <div className="sidebar__footer-logo">
          <svg width="20" height="20" viewBox="0 0 32 32">
            <defs>
              <linearGradient id="sbg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6FC3FF" />
                <stop offset="55%" stopColor="#2F7BFF" />
                <stop offset="100%" stopColor="#23E7FF" />
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="7" fill="url(#sbg)" />
            <text x="16" y="23" textAnchor="middle" fontFamily="Orbitron,Rajdhani,sans-serif" fontWeight="700" fontSize="18" fill="white">H</text>
          </svg>
        </div>
        <span className="sidebar__footer-text">Hinge 2006</span>
      </div>
    </aside>
  );
}
