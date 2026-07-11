import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { useTheme } from '../../contexts/ThemeContext';
import { APP_VERSION } from '../../utils/constants';
import './AppShell.css';

export default function StatusBar() {
  const { user } = useAuth();
  const { users, matches } = useApp();
  const { theme } = useTheme();

  return (
    <div className="statusbar">
      <div className="statusbar__section statusbar__section--main">
        <span className="status-dot status-dot--online" style={{ width: 6, height: 6 }} />
        <span>Connected — {users.length} members online</span>
      </div>
      <div className="statusbar__section">
        <span>♥ {matches.length} matches</span>
      </div>
      <div className="statusbar__section">
        <span>◈ Theme: {theme === 'xp' ? 'Ion Blue' : 'Chrome Platinum'}</span>
      </div>
      <div className="statusbar__section">
        <span>v{APP_VERSION}</span>
      </div>
      <div className="statusbar__section statusbar__section--user">
        <span>◉ {user?.displayName}</span>
      </div>
    </div>
  );
}
