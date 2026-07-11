import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import Avatar from '../../components/common/Avatar';
import { formatTime, replaceEmoticons } from '../../utils/helpers';
import { EMOTICONS } from '../../utils/constants';
import './Chat.css';

export default function Chat() {
  const [searchParams] = useSearchParams();
  const targetUserId = searchParams.get('userId');
  const { conversations, getUserById, sendMessage, matches } = useApp();
  const navigate = useNavigate();

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmoticons, setShowEmoticons] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get active match user
  const targetUser = targetUserId ? getUserById(targetUserId) : null;
  const conversation = targetUser 
    ? conversations.find(c => c.participants.includes(targetUser.id) && c.participants.includes('user-self'))
    : null;

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages, isTyping]);

  // Simulate typing indicator when auto-reply is preparing
  useEffect(() => {
    if (!conversation || conversation.messages.length === 0) return;
    const lastMsg = conversation.messages[conversation.messages.length - 1];
    if (lastMsg.senderId === 'user-self') {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [conversation?.messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !targetUser) return;

    sendMessage(targetUser.id, inputText);
    setInputText('');
  };

  const handleBuzz = () => {
    if (!targetUser) return;
    sendMessage(targetUser.id, "BUZZ!!!", 'buzz');
    setIsShaking(true);
    
    // Play HTML5 sound block if supported or console log
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {
      console.log('Buzz sound simulation complete');
    }

    setTimeout(() => {
      setIsShaking(false);
    }, 500);
  };

  const insertEmoticon = (symbol: string) => {
    setInputText(prev => prev + ' ' + symbol);
    setShowEmoticons(false);
  };

  // If no chat partner selected, show dashboard overview of active chats
  if (!targetUser) {
    const activeChats = conversations
      .filter(c => c.messages.length > 0)
      .map(c => {
        const otherId = c.participants.find(p => p !== 'user-self') || '';
        const user = getUserById(otherId);
        const lastMsg = c.messages[c.messages.length - 1];
        return { conversation: c, user, lastMsg };
      })
      .filter(chat => !!chat.user);

    return (
      <div className="chat-page chat-dashboard animate-fadeIn">
        <div className="chat-dashboard-container xp-panel">
          <div className="xp-panel__header">
            <span className="xp-panel__header-icon">💬</span>
            MSN Active Conversations
          </div>
          <div className="xp-panel__body">
            {activeChats.length === 0 ? (
              <div className="no-chats-msg text-center p-20">
                <p className="text-bold text-muted">No active chats.</p>
                <p className="mt-8 text-small">Go to your Buddy List and double click on a match to chat!</p>
                <button className="xp-btn mt-12 xp-btn--primary" onClick={() => navigate('/matches')}>
                  Open Buddy List
                </button>
              </div>
            ) : (
              <div className="active-chats-list">
                {activeChats.map(chat => (
                  <div 
                    key={chat.conversation.id} 
                    className="active-chat-row xp-panel"
                    onClick={() => navigate(`/chat?userId=${chat.user!.id}`)}
                  >
                    <Avatar name={chat.user!.displayName} size={36} status={chat.user!.status} showStatus />
                    <div className="active-chat-details">
                      <div className="active-chat-name-row">
                        <strong>{chat.user!.displayName}</strong>
                        <span className="active-chat-time">{formatTime(chat.conversation.lastActivity)}</span>
                      </div>
                      <p className="active-chat-last-msg truncate">
                        {chat.lastMsg.senderId === 'user-self' ? 'You: ' : ''}
                        {chat.lastMsg.type === 'buzz' ? '💥 Sent a BUZZ' : chat.lastMsg.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`chat-page animate-fadeIn ${isShaking ? 'animate-shake' : ''}`}>
      <div className="messenger-chat-window xp-panel">
        {/* Chat window top header */}
        <div className="xp-panel__header chat-window-header">
          <div className="chat-header-user">
            <Avatar name={targetUser.displayName} size={32} status={targetUser.status} showStatus />
            <div className="chat-header-details">
              <span className="chat-header-name">{targetUser.displayName}</span>
              <span className="chat-header-status-msg truncate">
                {targetUser.statusMessage || `Talking in Hinge 2006`}
              </span>
            </div>
          </div>
          <div className="chat-header-actions">
            <button className="xp-btn xp-btn--icon xp-btn--toolbar" onClick={() => navigate(`/profile/${targetUser.id}`)} title="View Scrapbook">👤</button>
            <button className="xp-btn xp-btn--icon xp-btn--toolbar" onClick={handleBuzz} title="Send Buzz Notification">💥 BUZZ!</button>
          </div>
        </div>

        {/* Messaging Logs Pane */}
        <div className="chat-messages-log">
          {conversation?.messages.map((msg) => {
            const isSelf = msg.senderId === 'user-self';
            if (msg.type === 'buzz') {
              return (
                <div key={msg.id} className="buzz-notice-line">
                  ⚡ <strong>{isSelf ? 'You' : targetUser.displayName}</strong> sent a BUZZ!
                </div>
              );
            }
            return (
              <div key={msg.id} className={`chat-bubble-row ${isSelf ? 'bubble-self' : 'bubble-other'}`}>
                <div className="chat-bubble-avatar">
                  <Avatar name={isSelf ? 'Alex Johnson' : targetUser.displayName} size={24} />
                </div>
                <div className="chat-bubble-content-box">
                  <div className="chat-bubble-meta">
                    <span className="bubble-sender">{isSelf ? 'Alex' : targetUser.displayName.split(' ')[0]}</span>
                    <span className="bubble-time">{formatTime(msg.timestamp)}</span>
                  </div>
                  <div className="chat-bubble-text">
                    {replaceEmoticons(msg.text)}
                  </div>
                </div>
              </div>
            );
          })}
          {isTyping && (
            <div className="typing-indicator-line">
              <span className="typing-dot">.</span>
              <span className="typing-dot">.</span>
              <span className="typing-dot">.</span>
              <span>{targetUser.displayName} is typing a message...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Emoticon Popover Panel */}
        {showEmoticons && (
          <div className="emoticon-picker-popover xp-panel">
            <div className="xp-panel__header text-small">Select Emoticon</div>
            <div className="xp-panel__body emoticons-grid">
              {Object.entries(EMOTICONS).map(([code, emoji]) => (
                <button 
                  key={code} 
                  className="emoticon-btn-picker" 
                  title={code}
                  onClick={() => insertEmoticon(code)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat input footer toolbar */}
        <div className="chat-input-toolbar">
          <button className="xp-btn xp-btn--toolbar" onClick={() => setShowEmoticons(!showEmoticons)}>😊 Emoticons</button>
          <button className="xp-btn xp-btn--toolbar" onClick={handleBuzz}>💥 Nudge (Buzz)</button>
          <button className="xp-btn xp-btn--toolbar" onClick={() => alert("Photo sharing requires Dial-Up upgrade.")}>📁 Share Photo</button>
        </div>

        {/* Chat Input form area */}
        <form className="chat-input-form" onSubmit={handleSend}>
          <textarea 
            className="xp-input chat-textarea" 
            placeholder="Type your instant message here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
          />
          <button type="submit" className="xp-btn xp-btn--primary send-message-btn">Send</button>
        </form>
      </div>
    </div>
  );
}
