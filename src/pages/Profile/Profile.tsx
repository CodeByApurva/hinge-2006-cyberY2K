import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import Avatar from '../../components/common/Avatar';
import MatchAssistant from '../../components/AIAssistant/MatchAssistant';
import { formatDate } from '../../utils/helpers';
import './Profile.css';

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const { user: authUser } = useAuth();
  const { getUserById, sentInterests, expressInterest, skipUser, isMatch, sendMessage } = useApp();
  const navigate = useNavigate();

  // Determine if viewing own profile
  const isOwnProfile = id === 'user-self' || id === authUser?.id;
  const targetUser = isOwnProfile 
    ? (getUserById('user-self') || authUser) 
    : getUserById(id || '');

  // Photo Album carousel / thumbnail viewer
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);

  // Scrapbook / Testimonial State
  const [newTestimonial, setNewTestimonial] = useState('');
  const [localTestimonials, setLocalTestimonials] = useState(targetUser?.testimonials || []);

  if (!targetUser) {
    return (
      <div className="profile-error xp-panel p-20 text-center m-16">
        <p className="text-bold text-danger">⚠️ Member profile not found!</p>
        <button className="xp-btn mt-12" onClick={() => navigate('/discover')}>Return to Directory</button>
      </div>
    );
  }

  const handleInterest = () => {
    const matched = expressInterest(targetUser.id);
    if (matched) {
      alert(`It's a Match! 🎉 You and ${targetUser.displayName} have mutually expressed interest! You can now chat in MSN Messenger.`);
    } else {
      alert(`Interest expressed! ❤️ Match Assistant will alert you when ${targetUser.displayName} responds.`);
    }
  };

  const handleSkip = () => {
    skipUser(targetUser.id);
    alert(`${targetUser.displayName} hidden from directories.`);
    navigate('/discover');
  };

  const handleAddTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestimonial.trim()) return;

    const testimonialObj = {
      from: authUser?.displayName || 'Alex Johnson',
      fromId: 'user-self',
      text: newTestimonial,
      date: new Date().toISOString(),
    };

    const updated = [testimonialObj, ...localTestimonials];
    setLocalTestimonials(updated);
    setNewTestimonial('');

    // If writing testimonial on another user's profile, update global state
    // For demo, we just update local state component-wide
  };

  const handleStartChat = () => {
    // Navigate to Chat page
    navigate(`/chat?userId=${targetUser.id}`);
  };

  const isInterested = sentInterests.includes(targetUser.id);
  const matched = isMatch(targetUser.id);

  // Simulated fake photos mapping
  const getPhotoUrl = (photoName: string) => {
    // Generate a structured gradient thumbnail representation since we don't have real images
    return `https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=60`;
  };

  return (
    <div className="profile-page animate-fadeIn">
      <div className="profile-layout-container">
        {/* Left Column: Photos & Quick Actions */}
        <div className="profile-column-left">
          <div className="xp-panel mb-12">
            <div className="xp-panel__header">
              <span className="xp-panel__header-icon">📷</span>
              Photo Album
            </div>
            <div className="xp-panel__body album-body">
              <div className="large-photo-display">
                {/* Fallback styling for images */}
                <div className="fake-photo-frame">
                  <div className="avatar-fallback-large">
                    {targetUser.displayName.charAt(0)}
                  </div>
                  <span className="photo-label">Photo {selectedPhotoIdx + 1} of {targetUser.photos.length || 1}</span>
                </div>
              </div>

              {/* Thumbnails list */}
              <div className="thumbnails-strip">
                {targetUser.photos.map((ph, idx) => (
                  <button 
                    key={ph} 
                    className={`thumb-btn ${selectedPhotoIdx === idx ? 'active' : ''}`}
                    onClick={() => setSelectedPhotoIdx(idx)}
                  >
                    <span>Ph {idx + 1}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions Panel */}
          {!isOwnProfile && (
            <div className="xp-panel mb-12">
              <div className="xp-panel__header">
                <span className="xp-panel__header-icon">⚡</span>
                Member Options
              </div>
              <div className="xp-panel__body options-body">
                {matched ? (
                  <button className="xp-btn xp-btn--success w-full mb-8" onClick={handleStartChat}>
                    💬 Start Chat (MSN)
                  </button>
                ) : (
                  <button 
                    className={`xp-btn w-full mb-8 ${isInterested ? '' : 'xp-btn--primary'}`}
                    onClick={handleInterest}
                    disabled={isInterested}
                  >
                    {isInterested ? '❤️ Interest Expressed' : '❤️ Add to Matches'}
                  </button>
                )}
                <button className="xp-btn w-full mb-8" onClick={handleSkip}>
                  ✕ Skip Member
                </button>
                <button 
                  className="xp-btn w-full" 
                  onClick={() => alert(`Reported user ${targetUser.displayName} to site moderators. Thank you!`)}
                >
                  ⚠️ Flag Profile
                </button>
              </div>
            </div>
          )}

          {/* Online Indicators */}
          <div className="xp-panel">
            <div className="xp-panel__header">
              <span className="xp-panel__header-icon">🌐</span>
              Status Monitor
            </div>
            <div className="xp-panel__body">
              <div className="status-indicator-box">
                <span className={`status-dot status-dot--${targetUser.status.toLowerCase()}`} />
                <span className="text-bold">{targetUser.displayName} is {targetUser.status}</span>
              </div>
              {targetUser.statusMessage && (
                <div className="status-msg-box italic-quote">
                  "{targetUser.statusMessage}"
                </div>
              )}
              <div className="text-small text-muted mt-8">
                Last login: {formatDate(targetUser.lastActive)}
              </div>
              <div className="text-small text-muted">
                Member since: {formatDate(targetUser.joinDate)}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Profile details & scrap book */}
        <div className="profile-column-right">
          {/* Main Info */}
          <div className="xp-panel mb-12">
            <div className="xp-panel__header">
              <span className="xp-panel__header-icon">👤</span>
              About {targetUser.displayName}
            </div>
            <div className="xp-panel__body">
              <div className="profile-basic-header">
                <h2>{targetUser.displayName}</h2>
                <span className="badge-age">{targetUser.age} Years Old • {targetUser.gender}</span>
              </div>
              
              <div className="xp-divider" />

              <div className="profile-details-grid">
                <div className="detail-row">
                  <span className="detail-lbl">Current Location:</span>
                  <span className="detail-val">{targetUser.city}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-lbl">Profession:</span>
                  <span className="detail-val">{targetUser.profession} at {targetUser.company || 'Private Firm'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-lbl">Education:</span>
                  <span className="detail-val">{targetUser.education}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-lbl">Looking For:</span>
                  <span className="detail-val text-primary text-bold">{targetUser.relationshipGoal}</span>
                </div>
              </div>

              <div className="xp-divider" />

              <div className="profile-bio-box">
                <h3>Personal Summary:</h3>
                <p className="bio-text">{targetUser.aboutMe}</p>
              </div>
            </div>
          </div>

          {/* Interests & Scrapbook Lists (Music, Movies, Books) */}
          <div className="xp-panel mb-12">
            <div className="xp-panel__header">
              <span className="xp-panel__header-icon">⭐</span>
              Scrapbook & Hobbies
            </div>
            <div className="xp-panel__body">
              <div className="scrapbook-lists">
                <div className="scrapbook-section">
                  <strong>Hobbies & Hobbies:</strong>
                  <div className="hobby-tags">
                    {targetUser.interests.map(i => <span key={i} className="hobby-tag">{i}</span>)}
                  </div>
                </div>

                <div className="xp-divider" />

                <div className="scrapbook-grid">
                  <div className="scrapbook-col">
                    <strong>Favorite Artists / Music:</strong>
                    <ul className="bullet-list-2006">
                      {targetUser.music.map(m => <li key={m}>{m}</li>)}
                    </ul>
                  </div>
                  <div className="scrapbook-col">
                    <strong>Favorite Movies:</strong>
                    <ul className="bullet-list-2006">
                      {targetUser.movies.map(mv => <li key={mv}>{mv}</li>)}
                    </ul>
                  </div>
                  <div className="scrapbook-col">
                    <strong>Favorite Books:</strong>
                    <ul className="bullet-list-2006">
                      {targetUser.books.map(bk => <li key={bk}>{bk}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial scrapbook (MySpace / Orkut inspired comments) */}
          <div className="xp-panel">
            <div className="xp-panel__header">
              <span className="xp-panel__header-icon">💬</span>
              Friend Testimonials / Scrapbook
            </div>
            <div className="xp-panel__body">
              {/* Form to leave testimonial */}
              <form className="testimonial-form mb-12" onSubmit={handleAddTestimonial}>
                <textarea 
                  className="xp-input w-full testimonial-textarea" 
                  rows={2} 
                  placeholder={`Write a testimonial on ${targetUser.displayName}'s profile...`}
                  value={newTestimonial}
                  onChange={(e) => setNewTestimonial(e.target.value)}
                />
                <div className="text-right mt-4">
                  <button type="submit" className="xp-btn xp-btn--primary">Write Testimonial</button>
                </div>
              </form>

              {/* List of testimonials */}
              <div className="testimonials-feed">
                {localTestimonials.length === 0 ? (
                  <p className="text-muted text-center text-small">No testimonials written yet. Be the first!</p>
                ) : (
                  localTestimonials.map((t, idx) => (
                    <div key={idx} className="testimonial-entry xp-panel">
                      <div className="xp-panel__header testimonial-header">
                        <span>From: <strong>{t.from}</strong></span>
                        <span className="testimonial-date">{formatDate(t.date)}</span>
                      </div>
                      <div className="xp-panel__body testimonial-body-text">
                        "{t.text}"
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden AI popup match assistant */}
      {!isOwnProfile && (
        <MatchAssistant 
          targetUser={targetUser} 
          onSendStarter={(text) => {
            alert(`Drafted icebreaker: "${text}" copied! Sending interest.`);
            handleInterest();
          }}
        />
      )}
    </div>
  );
}
