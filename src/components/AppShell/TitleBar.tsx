import React, { useState, useEffect } from 'react';
import { APP_NAME, APP_TAGLINE } from '../../utils/constants';
import { useTheme } from '../../contexts/ThemeContext';
import './AppShell.css';

export default function TitleBar() {
  const { theme } = useTheme();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = time.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return (
    <div className="titlebar">
      <div className="titlebar__left">
        <div className="titlebar__icon">
          <svg width="16" height="16" viewBox="0 0 32 32">
            <defs>
              <linearGradient id="tbg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6FC3FF" />
                <stop offset="55%" stopColor="#2F7BFF" />
                <stop offset="100%" stopColor="#23E7FF" />
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="7" fill="url(#tbg)" />
            <text x="16" y="23" textAnchor="middle" fontFamily="Orbitron,Rajdhani,sans-serif" fontWeight="700" fontSize="18" fill="white">H</text>
          </svg>
        </div>
        <span className="titlebar__text">
          {APP_NAME} — {APP_TAGLINE}
        </span>
      </div>
      <div className="titlebar__center">
        <span className="titlebar__clock">{formattedTime}</span>
        <span className="titlebar__theme-badge">{theme === 'xp' ? '◈ ION BLUE' : '◈ CHROME PLATINUM'}</span>
      </div>
      <div className="titlebar__controls">
        <button className="titlebar__btn titlebar__btn--minimize" title="Minimize">—</button>
        <button className="titlebar__btn titlebar__btn--maximize" title="Maximize">□</button>
        <button className="titlebar__btn titlebar__btn--close" title="Close">✕</button>
      </div>
    </div>
  );
}
