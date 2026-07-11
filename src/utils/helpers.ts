import { EMOTICONS } from './constants';

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

export function formatDateTime(dateStr: string): string {
  return `${formatDate(dateStr)} ${formatTime(dateStr)}`;
}

export function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateStr);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function replaceEmoticons(text: string): string {
  let result = text;
  Object.entries(EMOTICONS).forEach(([code, emoji]) => {
    result = result.replaceAll(code, emoji);
  });
  return result;
}

export function calculateCompatibility(interests1: string[], interests2: string[], goal1: string, goal2: string, city1: string, city2: string): number {
  let score = 0;
  const maxScore = 100;

  // Shared interests (up to 40 points)
  const sharedInterests = interests1.filter(i => interests2.includes(i));
  const interestScore = Math.min(40, (sharedInterests.length / Math.max(interests1.length, interests2.length)) * 60);
  score += interestScore;

  // Relationship goal match (30 points)
  if (goal1 === goal2) {
    score += 30;
  } else if (
    (goal1 === 'Long-term Relationship' && goal2 === 'Marriage') ||
    (goal1 === 'Marriage' && goal2 === 'Long-term Relationship')
  ) {
    score += 20;
  } else if (goal1 === 'Not Sure Yet' || goal2 === 'Not Sure Yet') {
    score += 10;
  }

  // Location proximity (20 points)
  if (city1 === city2) {
    score += 20;
  } else {
    const state1 = city1.split(', ')[1];
    const state2 = city2.split(', ')[1];
    if (state1 === state2) score += 10;
  }

  // Base compatibility (10 points)
  score += 10;

  return Math.min(maxScore, Math.round(score));
}

export function getSharedInterests(interests1: string[], interests2: string[]): string[] {
  return interests1.filter(i => interests2.includes(i));
}

export function generateConversationStarter(user1Interests: string[], user2Interests: string[], user2City: string, user2Profession: string): string {
  const shared = getSharedInterests(user1Interests, user2Interests);

  if (shared.length > 0) {
    const interest = shared[Math.floor(Math.random() * shared.length)];
    const templates = [
      `Hey! I noticed we both love ${interest}. What got you into it?`,
      `Your profile caught my eye! ${interest} fan here too. 😊`,
      `I love that you mentioned ${interest} in your profile. Tell me more!`,
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  const fallbacks = [
    `I see you're from ${user2City}! What's your favorite spot there?`,
    `Fellow ${user2Profession}! How do you like the field?`,
    `We seem to have a lot in common! What are you up to this weekend?`,
    `Your profile really stood out to me. I'd love to get to know you better!`,
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

export function detectFakeProfile(user: { aboutMe: string; photos: string[]; interests: string[]; profileViews: number }): { isSafe: boolean; confidence: number; reasons: string[] } {
  const reasons: string[] = [];
  let confidence = 95;

  if (user.aboutMe.length < 20) {
    confidence -= 15;
    reasons.push('Very short bio');
  }
  if (user.photos.length < 2) {
    confidence -= 10;
    reasons.push('Limited photos');
  }
  if (user.interests.length < 3) {
    confidence -= 10;
    reasons.push('Few listed interests');
  }

  return {
    isSafe: confidence >= 70,
    confidence,
    reasons: reasons.length > 0 ? reasons : ['Profile looks authentic!'],
  };
}

export function getAvatarColor(name: string): string {
  const colors = ['#2F7BFF', '#23E7FF', '#4CFFC4', '#B79CFF', '#6FC3FF', '#FF7A93', '#FFC65C', '#6C8CFF'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}

export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}
