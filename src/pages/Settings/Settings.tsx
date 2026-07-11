import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { RELATIONSHIP_GOALS } from '../../utils/constants';
import './Settings.css';

type SettingsTab = 'profile' | 'theme' | 'privacy' | 'notifications';

export default function Settings() {
  const { user, updateProfile } = useAuth();
  const { theme, setTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  // Profile Edit State
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [aboutMe, setAboutMe] = useState(user?.aboutMe || '');
  const [profession, setProfession] = useState(user?.profession || '');
  const [city, setCity] = useState(user?.city || '');
  const [relationshipGoal, setRelationshipGoal] = useState(user?.relationshipGoal || 'Long-term Relationship');

  // Music, movies, books
  const [music, setMusic] = useState(user?.music.join(', ') || '');
  const [movies, setMovies] = useState(user?.movies.join(', ') || '');
  const [books, setBooks] = useState(user?.books.join(', ') || '');

  // Privacy States
  const [showOnline, setShowOnline] = useState(true);
  const [profileSearchable, setProfileSearchable] = useState(true);

  // Email notifications
  const [emailOnMatch, setEmailOnMatch] = useState(true);
  const [emailOnMessage, setEmailOnMessage] = useState(true);
  const [emailWeeklyDigest, setEmailWeeklyDigest] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      displayName,
      aboutMe,
      profession,
      city,
      relationshipGoal: relationshipGoal as any,
      music: music.split(',').map(m => m.trim()).filter(Boolean),
      movies: movies.split(',').map(m => m.trim()).filter(Boolean),
      books: books.split(',').map(b => b.trim()).filter(Boolean),
    });
    alert("Control Panel options applied successfully! Your scrapbook has been updated.");
  };

  return (
    <div className="settings-page animate-fadeIn">
      <div className="control-panel-dialog xp-window">
        {/* Title Bar */}
        <div className="xp-window__titlebar">
          <span className="xp-window__titlebar-icon">⚙️</span>
          <span className="xp-window__titlebar-text">Hinge 2006 Control Panel — Internet Options</span>
          <div className="xp-window__controls">
            <button className="xp-window__control-btn">_</button>
            <button className="xp-window__control-btn">□</button>
            <button className="xp-window__control-btn xp-window__control-btn--close">✕</button>
          </div>
        </div>

        {/* Option Tabs */}
        <div className="xp-tabs">
          <button 
            className={`xp-tab ${activeTab === 'profile' ? 'xp-tab--active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Scrapbook Profile
          </button>
          <button 
            className={`xp-tab ${activeTab === 'theme' ? 'xp-tab--active' : ''}`}
            onClick={() => setActiveTab('theme')}
          >
            🎨 Display Themes
          </button>
          <button 
            className={`xp-tab ${activeTab === 'privacy' ? 'xp-tab--active' : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            🔒 Privacy Shield
          </button>
          <button 
            className={`xp-tab ${activeTab === 'notifications' ? 'xp-tab--active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            📬 Email Alerts
          </button>
        </div>

        {/* Tab Body */}
        <div className="control-panel-body xp-panel__body">
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSave} className="settings-form">
              <div className="xp-groupbox">
                <span className="xp-groupbox__label">General Identity Card</span>
                
                <div className="form-settings-row">
                  <label htmlFor="disp-name">Display Name:</label>
                  <input 
                    type="text" 
                    id="disp-name"
                    className="xp-input" 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>

                <div className="form-settings-row mt-8">
                  <label htmlFor="prof">Occupation:</label>
                  <input 
                    type="text" 
                    id="prof"
                    className="xp-input" 
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                  />
                </div>

                <div className="form-settings-row mt-8">
                  <label htmlFor="location">City / Location:</label>
                  <input 
                    type="text" 
                    id="location"
                    className="xp-input" 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>

                <div className="form-settings-row mt-8">
                  <label htmlFor="goal">Goal Profile:</label>
                  <select 
                    id="goal"
                    className="xp-select"
                    value={relationshipGoal}
                    onChange={(e) => setRelationshipGoal(e.target.value as typeof relationshipGoal)}
                  >
                    {RELATIONSHIP_GOALS.map(rg => <option key={rg} value={rg}>{rg}</option>)}
                  </select>
                </div>
              </div>

              <div className="xp-groupbox">
                <span className="xp-groupbox__label">Personal Scrapbook Lists (Comma separated)</span>
                
                <div className="form-settings-row">
                  <label htmlFor="music-list">Favorite Artists:</label>
                  <input 
                    type="text" 
                    id="music-list"
                    className="xp-input" 
                    value={music}
                    onChange={(e) => setMusic(e.target.value)}
                  />
                </div>

                <div className="form-settings-row mt-8">
                  <label htmlFor="movies-list">Favorite Movies:</label>
                  <input 
                    type="text" 
                    id="movies-list"
                    className="xp-input" 
                    value={movies}
                    onChange={(e) => setMovies(e.target.value)}
                  />
                </div>

                <div className="form-settings-row mt-8">
                  <label htmlFor="books-list">Favorite Books:</label>
                  <input 
                    type="text" 
                    id="books-list"
                    className="xp-input" 
                    value={books}
                    onChange={(e) => setBooks(e.target.value)}
                  />
                </div>
              </div>

              <div className="xp-groupbox">
                <span className="xp-groupbox__label">About Me Description</span>
                <textarea 
                  className="xp-input w-full settings-textarea" 
                  rows={3} 
                  value={aboutMe}
                  onChange={(e) => setAboutMe(e.target.value)}
                />
              </div>

              <div className="text-right mt-12">
                <button type="submit" className="xp-btn xp-btn--primary">Apply Settings</button>
              </div>
            </form>
          )}

          {activeTab === 'theme' && (
            <div className="theme-settings-tab">
              <div className="xp-groupbox">
                <span className="xp-groupbox__label">Window Display Themes</span>
                <p className="text-small mb-12">Select your preferred user interface paradigm. Themes will modify the app frame borders and title bar gradients.</p>
                
                <div className="theme-option-selectors">
                  {/* XP Theme Box */}
                  <div 
                    className={`theme-card xp-panel ${theme === 'xp' ? 'theme-card--selected' : ''}`}
                    onClick={() => setTheme('xp')}
                  >
                    <div className="theme-card-preview xp-blue-preview">
                      <div className="preview-titlebar">XP Blue</div>
                    </div>
                    <div className="theme-card-label">
                      <input 
                        type="radio" 
                        id="theme-xp" 
                        name="theme-choice"
                        checked={theme === 'xp'}
                        onChange={() => setTheme('xp')}
                      />
                      <label htmlFor="theme-xp" className="text-bold">Ion Blue (Electric)</label>
                    </div>
                  </div>

                  {/* Vista Theme Box */}
                  <div 
                    className={`theme-card xp-panel ${theme === 'vista' ? 'theme-card--selected' : ''}`}
                    onClick={() => setTheme('vista')}
                  >
                    <div className="theme-card-preview vista-silver-preview">
                      <div className="preview-titlebar">Vista Silver</div>
                    </div>
                    <div className="theme-card-label">
                      <input 
                        type="radio" 
                        id="theme-vista" 
                        name="theme-choice"
                        checked={theme === 'vista'}
                        onChange={() => setTheme('vista')}
                      />
                      <label htmlFor="theme-vista" className="text-bold">Chrome Platinum (Silver)</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="privacy-settings-tab">
              <div className="xp-groupbox">
                <span className="xp-groupbox__label">Privacy Shield Configuration</span>
                
                <div className="checkbox-setting-row">
                  <label className="xp-checkbox">
                    <input 
                      type="checkbox" 
                      checked={showOnline}
                      onChange={(e) => setShowOnline(e.target.checked)}
                    />
                    <span>Show my online status in Buddy Lists</span>
                  </label>
                </div>

                <div className="checkbox-setting-row mt-8">
                  <label className="xp-checkbox">
                    <input 
                      type="checkbox" 
                      checked={profileSearchable}
                      onChange={(e) => setProfileSearchable(e.target.checked)}
                    />
                    <span>Allow other members to discover my profile in the searchable directory</span>
                  </label>
                </div>
              </div>

              <div className="xp-groupbox">
                <span className="xp-groupbox__label">MatchBot Assistant Privacy</span>
                <p className="text-small">Hinge utilizes an algorithmic <strong>Match Assistant</strong> to compare profile keywords locally on your machine. No profile statistics leave your computer.</p>
                <div className="checkbox-setting-row mt-8">
                  <label className="xp-checkbox">
                    <input type="checkbox" defaultChecked disabled />
                    <span>Run MatchBot Assistant background scripts locally</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="notifications-settings-tab">
              <div className="xp-groupbox">
                <span className="xp-groupbox__label">Email Alerts (Outbound)</span>
                <p className="text-small mb-12">Since Hinge does not support mobile push notifications, we will email you when matching actions happen.</p>
                
                <div className="checkbox-setting-row">
                  <label className="xp-checkbox">
                    <input 
                      type="checkbox" 
                      checked={emailOnMatch}
                      onChange={(e) => setEmailOnMatch(e.target.checked)}
                    />
                    <span>Email me immediately when a mutual connection (Match) occurs</span>
                  </label>
                </div>

                <div className="checkbox-setting-row mt-8">
                  <label className="xp-checkbox">
                    <input 
                      type="checkbox" 
                      checked={emailOnMessage}
                      onChange={(e) => setEmailOnMessage(e.target.checked)}
                    />
                    <span>Email me when a message is sent while I am offline</span>
                  </label>
                </div>

                <div className="checkbox-setting-row mt-8">
                  <label className="xp-checkbox">
                    <input 
                      type="checkbox" 
                      checked={emailWeeklyDigest}
                      onChange={(e) => setEmailWeeklyDigest(e.target.checked)}
                    />
                    <span>Send weekly digest of who viewed my scrapbook</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dialog footer buttons */}
        <div className="control-panel-footer">
          <button className="xp-btn" onClick={() => alert("Settings discarded.")}>Cancel</button>
          <button className="xp-btn xp-btn--primary" onClick={handleProfileSave}>OK</button>
        </div>
      </div>
    </div>
  );
}
