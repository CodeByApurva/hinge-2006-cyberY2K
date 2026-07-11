import React from 'react';
import { getInitials, getAvatarColor } from '../../utils/helpers';

interface AvatarProps {
  name: string;
  size?: number;
  status?: 'Online' | 'Offline' | 'Away' | 'Busy';
  showStatus?: boolean;
}

export default function Avatar({ name, size = 40, status, showStatus = false }: AvatarProps) {
  const bg = getAvatarColor(name);
  const initials = getInitials(name);
  const fontSize = Math.max(10, size * 0.38);

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: Math.max(4, size * 0.2),
          background: `linear-gradient(135deg, ${bg}, ${bg}99)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize,
          fontWeight: 700,
          textShadow: '0 0 6px rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,255,255,0.45)',
          boxShadow: `0 0 ${Math.max(8, size * 0.3)}px -2px ${bg}88, inset 0 1px 0 rgba(255,255,255,0.25)`,
          fontFamily: "'Orbitron', 'Rajdhani', sans-serif",
        }}
      >
        {initials}
      </div>
      {showStatus && status && (
        <div
          className={`status-dot status-dot--${status.toLowerCase()}`}
          style={{
            position: 'absolute',
            bottom: -1,
            right: -1,
            width: Math.max(8, size * 0.22),
            height: Math.max(8, size * 0.22),
            border: '2px solid #0a1424',
          }}
        />
      )}
    </div>
  );
}
