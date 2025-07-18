export interface User {
  principal: string;
  joinedAt: number;
  totalHoursGiven: number;
  totalHoursReceived: number;
  reputationScore: number;
  isActive: boolean;
  timeBalance: number;
}

export interface Skill {
  name: string;
  category: string;
  minReputation: number;
  verificationRequired: boolean;
}

export interface UserSkill {
  skill: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: number;
  rating: number;
}

export interface TimeExchange {
  id: number;
  provider: string;
  receiver: string;
  skill: string;
  hours: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  createdAt: number;
  completedAt?: number;
}

export interface ExchangeLimits {
  minHours: number;
  maxHours: number;
  initialCredits: number;
}

export interface UserProfile {
  principal: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
  skills: UserSkill[];
  user: User;
}

export interface ContractCallOptions {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: any[];
  network: string;
}

export interface WalletState {
  isConnected: boolean;
  address?: string;
  userData?: any;
  isLoading: boolean;
  error?: string;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  actionUrl?: string;
}

export interface LoadingState {
  isLoading: boolean;
  loadingText?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface FilterOptions {
  skill?: string;
  category?: string;
  minRating?: number;
  maxHours?: number;
  minHours?: number;
  availability?: 'available' | 'busy' | 'offline';
}

export interface SearchFilters {
  query: string;
  filters: FilterOptions;
  sortBy: 'recent' | 'rating' | 'hours' | 'reputation';
  sortOrder: 'asc' | 'desc';
}

export interface ExchangeFormData {
  skill: string;
  hours: number;
  receiver: string;
  description?: string;
}

export interface SkillFormData {
  name: string;
  category: string;
  description?: string;
  portfolioUrl?: string;
}

export interface UserRegistrationData {
  displayName: string;
  bio?: string;
  avatar?: string;
  skills: string[];
}

export interface DashboardStats {
  totalUsers: number;
  totalExchanges: number;
  totalHoursExchanged: number;
  activeExchanges: number;
  completedExchanges: number;
  topSkills: { skill: string; count: number }[];
  recentActivity: any[];
}

export interface AppState {
  user: UserProfile | null;
  wallet: WalletState;
  notifications: NotificationState;
  loading: LoadingState;
  exchanges: TimeExchange[];
  skills: Skill[];
  searchResults: UserProfile[];
  dashboardStats: DashboardStats | null;
}
