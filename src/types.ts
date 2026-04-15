/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'owner' | 'manager' | 'agent';
export type ChannelType = 'facebook' | 'linkedin' | 'instagram';
export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed';
export type InboxStatus = 'new' | 'in_progress' | 'replied' | 'escalated';
export type ReplyMode = 'manual' | 'assisted' | 'auto';

export interface Stat {
  label: string;
  value: string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  type: 'number' | 'percentage' | 'time' | 'sentiment';
}

export interface Post {
  id: string;
  platform: ChannelType;
  content: string;
  author: string;
  date: string;
  engagement: number;
  impressions: number;
  status: PostStatus;
  imageUrl?: string;
  scheduledAt?: string;
}

export interface Message {
  id: string;
  sender: 'customer' | 'agent' | 'ai';
  senderName: string;
  content: string;
  timestamp: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface Thread {
  id: string;
  platform: ChannelType;
  type: 'comment' | 'message';
  status: InboxStatus;
  customerName: string;
  customerAvatar?: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  mode: ReplyMode;
  confidence?: number;
  intention?: string;
  assignee?: string;
  escalationReason?: string;
}

export interface AiPolicies {
  confidenceThreshold: number;
  maxAutoPerDay: number;
  workingHours: {
    start: string;
    end: string;
    enabled: boolean;
  };
  blockedIntents: string[];
  allowedIntents: string[];
  autoReplyEnabled: boolean;
}

export interface KnowledgeDocument {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: string;
  uploadedBy: string;
  size: string;
}

export interface ModificationLog {
  id: string;
  user: string;
  action: string;
  date: string;
  details: string;
}

export interface Organization {
  id: string;
  name: string;
  logo?: string;
  timezone: string;
  language: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'invited';
  avatar?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface ConnectedChannel {
  id: string;
  platform: ChannelType;
  name: string;
  status: 'connected' | 'disconnected' | 'expired';
  pages: { id: string; name: string; selected: boolean }[];
}

export interface AiInteraction {
  id: string;
  prompt: string;
  response: string;
  timestamp: string;
  type: 'generation' | 'correction' | 'reply' | 'idea';
  context?: {
    documents: string[];
    language: string;
    latency: number; // ms
    cost: 'low' | 'medium' | 'high';
  };
}

export interface Conversation {
  id: string;
  user: string;
  platform: ChannelType;
  lastMessage: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
  status: 'escalated' | 'open' | 'closed';
}
