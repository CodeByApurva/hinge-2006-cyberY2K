/* ---- Types for Hinge 2006 ---- */

export interface User {
  id: string;
  username: string;
  password: string;
  displayName: string;
  age: number;
  gender: 'Male' | 'Female';
  city: string;
  state: string;
  profession: string;
  company: string;
  education: string;
  aboutMe: string;
  interests: string[];
  music: string[];
  movies: string[];
  books: string[];
  relationshipGoal: 'Long-term Relationship' | 'Something Casual' | 'Marriage' | 'Friendship' | 'Not Sure Yet';
  testimonials: Testimonial[];
  photos: string[];
  avatar: string;
  status: 'Online' | 'Offline' | 'Away' | 'Busy';
  statusMessage: string;
  lastActive: string;
  joinDate: string;
  profileViews: number;
  isFake?: boolean;
}

export interface Testimonial {
  from: string;
  fromId: string;
  text: string;
  date: string;
}

export interface Match {
  userId: string;
  matchedAt: string;
  lastMessage?: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: string;
  type: 'text' | 'buzz' | 'system';
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  messages: Message[];
  lastActivity: string;
}

export interface Interest {
  fromUserId: string;
  toUserId: string;
  timestamp: string;
}

export interface FilterOptions {
  ageMin: number;
  ageMax: number;
  city: string;
  profession: string;
  education: string;
  interest: string;
  relationshipGoal: string;
}

export interface Notification {
  id: string;
  type: 'match' | 'message' | 'view' | 'interest' | 'system';
  title: string;
  text: string;
  timestamp: string;
  read: boolean;
  relatedUserId?: string;
}

export type ThemeType = 'xp' | 'vista';
