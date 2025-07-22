import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://your-project.supabase.co';
const supabaseAnonKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types
export interface UserProfile {
  id: string;
  email: string;
  youtube_channel_id?: string;
  youtube_api_key?: string;
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