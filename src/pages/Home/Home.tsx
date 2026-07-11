import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import Avatar from '../../components/common/Avatar';
import { formatDate } from '../../utils/helpers';
import './Home.css';

export default function Home() {
  const { user } = useAuth();
  const { users, matches, notifications, conversations } = useApp();
  const navigate = useNavigate();

  // Get 3 random suggested matches (excluding self)
  const suggested = users
    .filter(u => u.id !== 'user-self')
    .slice(0, 3);

  // Get active conversations count
  const activeChats = conversations.filter(c => c.messages.length > 0).length;

  return (
    <div className="home-page animate-fadeIn">
      {/* Top Banner resembling old Yahoo/MSN dashboard */}
      <div className="home-banner xp-panel">
        <div className="home-banner__content">
          <div className="home-banner__welcome">
            <h2>Welcome back, {user?.displayName}!</h2>
            <p>Today is {formatDate(new Date().toISOString())}. You have {notifications.filter(n => !n.read).length} unread updates.</p>
          </div>
          <div className="home-banner__stats">
            <div className="stat-box">
              <span className="stat-box__val">{matches.length}</span>
              <span className="stat-box__lbl">Matches</span>
            </div>
            <div className="stat-box">
              <span className="stat-box__val">{activeChats}</span>
              <span className="stat-box__lbl">Chats</span>
            </div>
            <div className="stat-box">
              <span className="stat-box__val">{user?.profileViews || 0}</span>
              <span className="stat-box__lbl">Profile Views</span>
            </div>
          </div>
        </div>
      </div>

      <div className="home-grid">
        {/* Left Column: Recent Activity & Suggested Matches */}
        <div className="home-grid__main">
          {/* Suggested Matches Section */}
          <div className="xp-panel mb-12">
            <div className="xp-panel__header">
              <span className="xp-panel__header-icon">💝</span>
              Suggested Matches for You
            </div>
            <div className="xp-panel__body">
              <div className="suggested-matches-list">
                {suggested.map(su => (
                  <div key={su.id} className="suggested-card xp-panel">
                    <div className="suggested-card__media">
                      <Avatar name={su.displayName} size={70} status={su.status} showStatus />
                    </div>
                    <div className="suggested-card__info">
                      <div className="suggested-card__name" onClick={() => navigate(`/profile/${su.id}`)}>
                        {su.displayName}, {su.age}
                      </div>
                      <div className="suggested-card__desc truncate">{su.profession}</div>
                      <div className="suggested-card__desc truncate">{su.city}</div>
                      <div className="suggested-card__actions">
                        <button 
                          className="xp-btn xp-btn--primary xp-btn--icon"
                          onClick={() => navigate(`/profile/${su.id}`)}
                          title="View Full Profile"
                        >
                          👁️ View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-right mt-8">
                <button className="xp-btn" onClick={() => navigate('/discover')}>
                  Browse Directory ➔
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="xp-panel">
            <div className="xp-panel__header">
              <span className="xp-panel__header-icon">⚡</span>
              Recent Activity Feed
            </div>
            <div className="xp-panel__body p-0">
              <div className="activity-feed">
                {notifications.slice(0, 5).map(notif => (
                  <div key={notif.id} className={`activity-item ${notif.read ? '' : 'activity-item--unread'}`}>
                    <span className="activity-item__icon">
                      {notif.type === 'match' ? '💖' : notif.type === 'message' ? '💬' : notif.type === 'view' ? '👁️' : '🔔'}
                    </span>
                    <div className="activity-item__details">
                      <div className="activity-item__title">{notif.title}</div>
                      <div className="activity-item__text">{notif.text}</div>
                      <div className="activity-item__time">{formatDate(notif.timestamp)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: System Announcements & Quick Links */}
        <div className="home-grid__side">
          {/* Hinge Inbox Assistant Quick Tips */}
          <div className="xp-panel mb-12 bg-yellow-tint">
            <div className="xp-panel__header">
              <span className="xp-panel__header-icon">🤖</span>
              MatchBot Assistant Tip
            </div>
            <div className="xp-panel__body">
              <p className="assistant-tip-text">
                "Hi there! Did you know that listings with full <strong>Music, Movies, and Books</strong> lists receive up to <strong>73% more testimonials</strong>? Update your scrapbook today in Settings!"
              </p>
              <button 
                className="xp-btn xp-btn--primary w-full mt-8"
                onClick={() => navigate('/settings')}
              >
                Go to Control Panel
              </button>
            </div>
          </div>

          {/* System Announcements */}
          <div className="xp-panel mb-12">
            <div className="xp-panel__header">
              <span className="xp-panel__header-icon">📣</span>
              Announcements
            </div>
            <div className="xp-panel__body">
              <div className="announcement-item">
                <span className="announcement-date">Sept 20, 2006</span>
                <h4 className="announcement-title">Windows Vista Support Coming!</h4>
                <p className="announcement-text">We are preparing a brand new Aero theme engine update. Try out the silver preview in the toolbar today!</p>
              </div>
              <div className="xp-divider" />
              <div className="announcement-item">
                <span className="announcement-date">Aug 15, 2006</span>
                <h4 className="announcement-title">Anti-Scam Shield v2.0</h4>
                <p className="announcement-text">Our backend fake profile scoring system has been upgraded to scan user bios automatically to protect the community.</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="xp-panel">
            <div className="xp-panel__header">
              <span className="xp-panel__header-icon">🔗</span>
              Internet Directories
            </div>
            <div className="xp-panel__body">
              <ul className="quick-links-list">
                <li><a href="#myspace" onClick={(e) => { e.preventDefault(); alert("Navigating to MySpace would exit the app."); }}>MySpace.com (Dating Space)</a></li>
                <li><a href="#yahoo" onClick={(e) => { e.preventDefault(); alert("Navigating to Yahoo Personals."); }}>Yahoo! Personals</a></li>
                <li><a href="#orkut" onClick={(e) => { e.preventDefault(); alert("Opening Orkut communities."); }}>Orkut Communities</a></li>
                <li><a href="#msn" onClick={(e) => { e.preventDefault(); alert("MSN Web Messenger."); }}>MSN Messenger Web Login</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
