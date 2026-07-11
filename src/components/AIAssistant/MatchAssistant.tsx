import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { User } from '../../utils/types';
import { calculateCompatibility, generateConversationStarter, detectFakeProfile, getSharedInterests } from '../../utils/helpers';
import './MatchAssistant.css';

interface MatchAssistantProps {
  targetUser?: User;
  onSendStarter?: (text: string) => void;
}

export default function MatchAssistant({ targetUser, onSendStarter }: MatchAssistantProps) {
  const { user: currentUser } = useApp().getUserById('user-self') ? { user: useApp().getUserById('user-self') } : { user: null };
  const realCurrentUser = useApp().users.find(u => u.id === 'user-self') || currentUser;
  const [isOpen, setIsOpen] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState<'compatibility' | 'starter' | 'detector'>('compatibility');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (targetUser) {
      setIsAnalyzing(true);
      const timer = setTimeout(() => {
        setIsAnalyzing(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [targetUser]);

  if (!isOpen || !targetUser || !realCurrentUser) return null;

  const compatibilityScore = calculateCompatibility(
    realCurrentUser.interests,
    targetUser.interests,
    realCurrentUser.relationshipGoal,
    targetUser.relationshipGoal,
    realCurrentUser.city,
    targetUser.city
  );

  const starterText = generateConversationStarter(
    realCurrentUser.interests,
    targetUser.interests,
    targetUser.city,
    targetUser.profession
  );

  const fakeAnalysis = detectFakeProfile({
    aboutMe: targetUser.aboutMe,
    photos: targetUser.photos,
    interests: targetUser.interests,
    profileViews: targetUser.profileViews
  });

  const sharedInterests = getSharedInterests(realCurrentUser.interests, targetUser.interests);

  const getStatusColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 50) return 'text-primary';
    return 'text-danger';
  };

  return (
    <div className={`match-assistant-window xp-window ${minimized ? 'match-assistant-window--minimized' : ''}`}>
      <div className="xp-window__titlebar" onClick={() => setMinimized(!minimized)}>
        <span className="xp-window__titlebar-icon">🤖</span>
        <span className="xp-window__titlebar-text">NEURAL MATCH ENGINE // v2.0</span>
        <div className="xp-window__controls" onClick={(e) => e.stopPropagation()}>
          <button className="xp-window__control-btn" onClick={() => setMinimized(!minimized)}>
            {minimized ? '▫️' : '_'}
          </button>
          <button className="xp-window__control-btn xp-window__control-btn--close" onClick={() => setIsOpen(false)}>
            ✕
          </button>
        </div>
      </div>

      {!minimized && (
        <div className="match-assistant-body">
          <div className="assistant-speech-bubble">
            <div className="assistant-speech-bubble__arrow" />
            <div className="assistant-speech-bubble__content">
              {isAnalyzing ? (
                <div className="xp-loading">
                  <div className="xp-loading__spinner" />
                  <span>Analyzing profile data...</span>
                </div>
              ) : activeTab === 'compatibility' ? (
                <div>
                  <strong>Compatibility Analysis for {targetUser.displayName}:</strong>
                  <div className="mt-8">
                    <span className="text-bold">Match Score: </span>
                    <span className={`text-bold ${getStatusColor(compatibilityScore)}`}>{compatibilityScore}%</span>
                  </div>
                  <div className="xp-progress mt-8">
                    <div className="xp-progress__bar" style={{ width: `${compatibilityScore}%` }} />
                  </div>
                  <div className="mt-8 text-small">
                    {sharedInterests.length > 0 ? (
                      <div>You both share interest in: <strong>{sharedInterests.join(', ')}</strong>.</div>
                    ) : (
                      <div>No direct shared interests, but relationship goals are {targetUser.relationshipGoal === realCurrentUser.relationshipGoal ? 'aligned!' : 'compatible.'}</div>
                    )}
                  </div>
                </div>
              ) : activeTab === 'starter' ? (
                <div>
                  <strong>AI Generated Icebreaker:</strong>
                  <p className="mt-8 italic-quote">"{starterText}"</p>
                  {onSendStarter && (
                    <button 
                      className="xp-btn xp-btn--primary xp-btn--large w-full mt-12"
                      onClick={() => onSendStarter(starterText)}
                    >
                      Copy to MSN Messenger Chat
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  <strong>Security Analysis:</strong>
                  <div className="mt-8">
                    <strong>Trust Score:</strong> <span className={fakeAnalysis.isSafe ? 'text-success' : 'text-danger'}>{fakeAnalysis.confidence}%</span>
                  </div>
                  <div className="mt-8 text-small">
                    <strong>Analysis Details:</strong>
                    <ul className="mt-4 list-styled">
                      {fakeAnalysis.reasons.map((reason, index) => (
                        <li key={index}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="assistant-clippy-area">
            <div className="assistant-tabs">
              <button 
                className={`assistant-tab-btn ${activeTab === 'compatibility' ? 'active' : ''}`}
                onClick={() => setActiveTab('compatibility')}
                title="Compatibility"
              >
                ◈ SCORE
              </button>
              <button 
                className={`assistant-tab-btn ${activeTab === 'starter' ? 'active' : ''}`}
                onClick={() => setActiveTab('starter')}
                title="Conversation Starter"
              >
                ◇ STARTER
              </button>
              <button 
                className={`assistant-tab-btn ${activeTab === 'detector' ? 'active' : ''}`}
                onClick={() => setActiveTab('detector')}
                title="Fake Detector"
              >
                ⛊ TRUST
              </button>
            </div>
            <div className="assistant-avatar-pixel">
              {/* Retro Robot Avatar using ASCII/CSS */}
              <div className="retro-bot">
                <div className="retro-bot-antenna" />
                <div className="retro-bot-head">
                  <div className="retro-bot-eye left"><div className="retro-bot-pupil" /></div>
                  <div className="retro-bot-eye right"><div className="retro-bot-pupil" /></div>
                  <div className="retro-bot-mouth" />
                </div>
                <div className="retro-bot-neck" />
                <div className="retro-bot-body">
                  <div className="retro-bot-heart">❤️</div>
                </div>
              </div>
              <div className="assistant-name">NEURAL CORE</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
