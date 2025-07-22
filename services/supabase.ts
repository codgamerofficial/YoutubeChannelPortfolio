import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://demo-project.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbW8tcHJvamVjdCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjQ1MTkyMDAwLCJleHAiOjE5NjA3NjgwMDB9.demo-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'openid profile email https://www.googleapis.com/auth/youtube.readonly',
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
      },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Google OAuth error:', error);
    throw error;
  }
};

// Database types
export interface UserProfile {
  id: string;
  email: string;
  youtube_channel_id?: string;
  youtube_api_key?: string;
  google_access_token?: string;
  google_refresh_token?: string;
  youtube_channel_title?: string;
  youtube_channel_thumbnail?: string;
  created_at: string;
  updated_at: string;
}

export interface ChannelAnalytics {
  id: string;
  user_id: string;
  channel_id: string;
  subscribers: number;
  views: number;
  videos: number;
  engagement_rate: number;
  growth_rate: number;
  analyzed_at: string;
}