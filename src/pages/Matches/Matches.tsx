import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import Avatar from '../../components/common/Avatar';
import { formatDate } from '../../utils/helpers';
import './Matches.css';

export default function Matches() {
  const { matches, getUserById } = useApp();
  const navigate = useNavigate();

  const matchUsers = matches
    .map(id => getUserById(id))
    .filter((u): u is NonNullable<typeof u> => !!u);

  const onlineMatches = matchUsers.filter(u => u.status !== 'Offline');
  const offlineMatches = matchUsers.filter(u => u.status === 'Offline');

  return (
    <div className="matches-page animate-fadeIn">
      <div className="messenger-window xp-panel">
        <div className="xp-panel__header messenger-header">
          <div className="messenger-header__brand">
            <span>👥</span>
            Hinge Messenger Buddy List
          </div>
          <div className="messenger-header__stats">
            {onlineMatches.length} / {matchUsers.length} Online
          </div>
        </div>

        <div className="xp-panel__body messenger-body">
          {matchUsers.length === 0 ? (
            <div className="no-matches-view text-center p-20">
              <p className="text-bold text-muted">Your Buddy List is empty.</p>
              <p className="mt-8 text-small">Browse the Directory and click "Interested" on profiles to build matches!</p>
              <button className="xp-btn mt-12 xp-btn--primary" onClick={() => navigate('/discover')}>
                Search Directory
              </button>
            </div>
          ) : (
            <div className="messenger-buddies-list">
              
              {/* Online Buddies Section */}
              <div className="buddy-group">
                <div className="buddy-group-header">
                  <span>▼ Matches Online ({onlineMatches.length})</span>
                </div>
                <div className="buddy-group-content">
                  {onlineMatches.length === 0 ? (
                    <div className="empty-group-text">No matches currently online.</div>
                  ) : (
                    onlineMatches.map(u => (
                      <div key={u.id} className="buddy-row" onClick={() => navigate(`/profile/${u.id}`)}>
                        <Avatar name={u.displayName} size={28} status={u.status} showStatus />
                        <div className="buddy-info">
                          <div className="buddy-name-row">
                            <span className="buddy-name">{u.displayName}</span>
                            <span className="buddy-age">({u.age})</span>
                          </div>
                          <div className="buddy-status-message truncate">
                            {u.statusMessage || `Active in ${u.city}`}
                          </div>
                        </div>
                        <button 
                          className="xp-btn xp-btn--primary send-msg-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/chat?userId=${u.id}`);
                          }}
                        >
                          💬 Chat
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="xp-divider" />

              {/* Offline Buddies Section */}
              <div className="buddy-group">
                <div className="buddy-group-header">
                  <span>▼ Offline ({offlineMatches.length})</span>
                </div>
                <div className="buddy-group-content">
                  {offlineMatches.length === 0 ? (
                    <div className="empty-group-text">All matches are online!</div>
                  ) : (
                    offlineMatches.map(u => (
                      <div key={u.id} className="buddy-row buddy-row--offline" onClick={() => navigate(`/profile/${u.id}`)}>
                        <Avatar name={u.displayName} size={28} status={u.status} showStatus />
                        <div className="buddy-info">
                          <div className="buddy-name-row">
                            <span className="buddy-name">{u.displayName}</span>
                            <span className="buddy-age">({u.age})</span>
                          </div>
                          <div className="buddy-status-message truncate">
                            Offline — Last Active: {formatDate(u.lastActive)}
                          </div>
                        </div>
                        <button 
                          className="xp-btn send-msg-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/chat?userId=${u.id}`);
                          }}
                        >
                          💬 Send Offline Msg
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
        
        {/* MSN Bottom Search */}
        <div className="messenger-footer xp-panel__header">
          <input 
            type="text" 
            className="xp-input footer-search" 
            placeholder="Search buddies..." 
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              // Simulated instant buddy filtering alert
            }}
          />
          <button className="xp-btn" onClick={() => alert("Invite friends feature is under construction.")}>
            + Add Contact
          </button>
        </div>
      </div>
    </div>
  );
}
