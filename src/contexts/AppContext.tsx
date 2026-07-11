import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User, Conversation, Message, Interest, Notification } from '../utils/types';
import { sampleUsers, sampleConversations, sampleNotifications, initialInterests } from '../mockData/users';
import { generateId, getCurrentTimestamp } from '../utils/helpers';
import { CURRENT_USER_ID } from '../utils/constants';

interface AppContextType {
  users: User[];
  conversations: Conversation[];
  notifications: Notification[];
  sentInterests: string[];
  receivedInterests: string[];
  matches: string[];
  skippedUsers: string[];
  
  getUserById: (id: string) => User | undefined;
  expressInterest: (userId: string) => boolean;
  skipUser: (userId: string) => void;
  isMatch: (userId: string) => boolean;
  getConversation: (userId: string) => Conversation | undefined;
  sendMessage: (userId: string, text: string, type?: Message['type']) => void;
  markNotificationsRead: () => void;
  getUnreadCount: () => number;
  getUnreadMessageCount: (conversationId: string) => number;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [users] = useState<User[]>(sampleUsers);
  const [conversations, setConversations] = useState<Conversation[]>(sampleConversations);
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  const [sentInterests, setSentInterests] = useState<string[]>(initialInterests.sentInterests);
  const [receivedInterests] = useState<string[]>(initialInterests.receivedInterests);
  const [matches, setMatches] = useState<string[]>(initialInterests.matches);
  const [skippedUsers, setSkippedUsers] = useState<string[]>(initialInterests.skippedUsers);

  const getUserById = useCallback((id: string): User | undefined => {
    return users.find(u => u.id === id);
  }, [users]);

  const expressInterest = useCallback((userId: string): boolean => {
    if (sentInterests.includes(userId)) return false;
    
    setSentInterests(prev => [...prev, userId]);
    
    // Check if it's a mutual match
    if (receivedInterests.includes(userId)) {
      setMatches(prev => [...prev, userId]);
      const user = users.find(u => u.id === userId);
      if (user) {
        const newNotif: Notification = {
          id: generateId(),
          type: 'match',
          title: 'New Match! 🎉',
          text: `You and ${user.displayName} are a match! Send a message to start chatting.`,
          timestamp: getCurrentTimestamp(),
          read: false,
          relatedUserId: userId,
        };
        setNotifications(prev => [newNotif, ...prev]);
      }
      return true; // It's a match!
    }
    return false;
  }, [sentInterests, receivedInterests, users]);

  const skipUser = useCallback((userId: string) => {
    setSkippedUsers(prev => [...prev, userId]);
  }, []);

  const isMatch = useCallback((userId: string): boolean => {
    return matches.includes(userId);
  }, [matches]);

  const getConversation = useCallback((userId: string): Conversation | undefined => {
    return conversations.find(c => c.participants.includes(userId) && c.participants.includes(CURRENT_USER_ID));
  }, [conversations]);

  const sendMessage = useCallback((userId: string, text: string, type: Message['type'] = 'text') => {
    const existingConv = conversations.find(
      c => c.participants.includes(userId) && c.participants.includes(CURRENT_USER_ID)
    );

    const newMsg: Message = {
      id: generateId(),
      conversationId: existingConv?.id || generateId(),
      senderId: CURRENT_USER_ID,
      text,
      timestamp: getCurrentTimestamp(),
      type,
      read: true,
    };

    if (existingConv) {
      setConversations(prev =>
        prev.map(c =>
          c.id === existingConv.id
            ? { ...c, messages: [...c.messages, newMsg], lastActivity: getCurrentTimestamp() }
            : c
        )
      );
    } else {
      const newConv: Conversation = {
        id: newMsg.conversationId,
        participants: [CURRENT_USER_ID, userId],
        messages: [newMsg],
        lastActivity: getCurrentTimestamp(),
      };
      setConversations(prev => [...prev, newConv]);
    }

    // Simulate auto-reply after 2-3 seconds
    setTimeout(() => {
      const user = users.find(u => u.id === userId);
      if (!user) return;
      
      const replies = [
        "That's awesome! Tell me more 😊",
        "Haha, I love that! 😄",
        "Really? That's so cool!",
        "I totally agree! We should hang out sometime.",
        "Interesting! I've always wanted to try that.",
        `That reminds me of this place in ${user.city}...`,
        "You have great taste! :D",
        "LOL that's hilarious 😆",
      ];
      
      const autoReply: Message = {
        id: generateId(),
        conversationId: existingConv?.id || newMsg.conversationId,
        senderId: userId,
        text: type === 'buzz' ? "Hey! Don't buzz me! 😜" : replies[Math.floor(Math.random() * replies.length)],
        timestamp: getCurrentTimestamp(),
        type: 'text',
        read: false,
      };

      setConversations(prev =>
        prev.map(c =>
          c.id === (existingConv?.id || newMsg.conversationId)
            ? { ...c, messages: [...c.messages, autoReply], lastActivity: getCurrentTimestamp() }
            : c
        )
      );
    }, 2000 + Math.random() * 3000);
  }, [conversations, users]);

  const markNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const getUnreadCount = useCallback((): number => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const getUnreadMessageCount = useCallback((conversationId: string): number => {
    const conv = conversations.find(c => c.id === conversationId);
    if (!conv) return 0;
    return conv.messages.filter(m => !m.read && m.senderId !== CURRENT_USER_ID).length;
  }, [conversations]);

  return (
    <AppContext.Provider
      value={{
        users,
        conversations,
        notifications,
        sentInterests,
        receivedInterests,
        matches,
        skippedUsers,
        getUserById,
        expressInterest,
        skipUser,
        isMatch,
        getConversation,
        sendMessage,
        markNotificationsRead,
        getUnreadCount,
        getUnreadMessageCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
