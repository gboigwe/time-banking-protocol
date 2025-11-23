import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, UserProfile, TimeExchange, Skill, Notification } from '@/types';
import { useWallet } from './WalletContext';
import { getUserInfo, getUserBalance, getUserSkillVerification } from '@/lib/stacks';
import toast from 'react-hot-toast';

type AppAction =
  | { type: 'SET_LOADING'; payload: { isLoading: boolean; loadingText?: string } }
  | { type: 'SET_USER'; payload: UserProfile | null }
  | { type: 'SET_EXCHANGES'; payload: TimeExchange[] }
  | { type: 'ADD_EXCHANGE'; payload: TimeExchange }
  | { type: 'UPDATE_EXCHANGE'; payload: TimeExchange }
  | { type: 'SET_SKILLS'; payload: Skill[] }
  | { type: 'ADD_SKILL'; payload: Skill }
  | { type: 'SET_SEARCH_RESULTS'; payload: UserProfile[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'SET_DASHBOARD_STATS'; payload: any }
  | { type: 'RESET_STATE' };

const initialState: AppState = {
  user: null,
  wallet: {
    isConnected: false,
    isLoading: false,
  },
  notifications: {
    notifications: [],
    unreadCount: 0,
  },
  loading: {
    isLoading: false,
  },
  exchanges: [],
  skills: [],
  searchResults: [],
  dashboardStats: null,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'SET_EXCHANGES':
      return {
        ...state,
        exchanges: action.payload,
      };
    case 'ADD_EXCHANGE':
      return {
        ...state,
        exchanges: [...state.exchanges, action.payload],
      };
    case 'UPDATE_EXCHANGE':
      return {
        ...state,
        exchanges: state.exchanges.map(exchange =>
          exchange.id === action.payload.id ? action.payload : exchange
        ),
      };
    case 'SET_SKILLS':
      return {
        ...state,
        skills: action.payload,
      };
    case 'ADD_SKILL':
      return {
        ...state,
        skills: [...state.skills, action.payload],
      };
    case 'SET_SEARCH_RESULTS':
      return {
        ...state,
        searchResults: action.payload,
      };
    case 'ADD_NOTIFICATION':
      const newNotification = action.payload;
      return {
        ...state,
        notifications: {
          notifications: [newNotification, ...state.notifications.notifications],
          unreadCount: state.notifications.unreadCount + 1,
        },
      };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: {
          ...state.notifications,
          notifications: state.notifications.notifications.map(notification =>
            notification.id === action.payload
              ? { ...notification, read: true }
              : notification
          ),
          unreadCount: Math.max(0, state.notifications.unreadCount - 1),
        },
      };
    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: {
          notifications: [],
          unreadCount: 0,
        },
      };
    case 'SET_DASHBOARD_STATS':
      return {
        ...state,
        dashboardStats: action.payload,
      };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Helper functions
  setLoading: (isLoading: boolean, loadingText?: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  loadUserProfile: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { isConnected, address } = useWallet();

  const setLoading = (isLoading: boolean, loadingText?: string) => {
    dispatch({ type: 'SET_LOADING', payload: { isLoading, loadingText } });
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: Date.now(),
      read: false,
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
    
    // Show toast notification
    switch (notification.type) {
      case 'success':
        toast.success(notification.message);
        break;
      case 'error':
        toast.error(notification.message);
        break;
      case 'warning':
        toast.error(notification.message);
        break;
      default:
        toast(notification.message);
        break;
    }
  };

  const loadUserProfile = async () => {
    if (!isConnected || !address) return;

    setLoading(true, 'Loading user profile...');
    
    try {
      const userInfo = await getUserInfo(address);
      if (!userInfo) {
        dispatch({ type: 'SET_USER', payload: null });
        return;
      }

      const timeBalance = await getUserBalance(address);
      
      const userProfile: UserProfile = {
        principal: address,
        displayName: address.substring(0, 10) + '...',
        bio: 'Welcome to TimeBank!',
        skills: [],
        user: {
          ...userInfo,
          timeBalance,
        },
      };

      dispatch({ type: 'SET_USER', payload: userProfile });
    } catch (error) {
      console.error('Error loading user profile:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load user profile',
        read: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshUserData = async () => {
    if (!isConnected || !address) return;

    try {
      const userInfo = await getUserInfo(address);
      const timeBalance = await getUserBalance(address);
      
      if (userInfo && state.user) {
        const updatedUser: UserProfile = {
          ...state.user,
          user: {
            ...userInfo,
            timeBalance,
          },
        };
        dispatch({ type: 'SET_USER', payload: updatedUser });
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  // Load user profile when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      loadUserProfile();
    } else {
      dispatch({ type: 'SET_USER', payload: null });
    }
  }, [isConnected, address]);

  // Reset state when wallet disconnects
  useEffect(() => {
    if (!isConnected) {
      dispatch({ type: 'RESET_STATE' });
    }
  }, [isConnected]);

  const value: AppContextType = {
    state,
    dispatch,
    setLoading,
    addNotification,
    loadUserProfile,
    refreshUserData,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
