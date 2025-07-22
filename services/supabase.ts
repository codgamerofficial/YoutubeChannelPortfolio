import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

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

// Google OAuth configuration
export const googleAuthConfig = {
  clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || 'your-google-client-id',
  scopes: [
    'openid',
    'profile',
    'email',
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/youtube.channel-memberships.creator'
  ],
  additionalParameters: {},
  customParameters: {
    prompt: 'select_account',
  },
};

export const signInWithGoogle = async () => {
  try {
    const redirectUrl = AuthSession.makeRedirectUri({
      useProxy: true,
    });

    const authUrl = `https://accounts.google.com/oauth/authorize?` +
      `client_id=${googleAuthConfig.clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUrl)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(googleAuthConfig.scopes.join(' '))}&` +
      `access_type=offline&` +
      `prompt=select_account`;

    const result = await AuthSession.startAsync({
      authUrl,
      returnUrl: redirectUrl,
    });

    if (result.type === 'success' && result.params.code) {
      // Exchange code for tokens
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: googleAuthConfig.clientId,
          client_secret: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_SECRET || '',
          code: result.params.code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUrl,
        }),
      });

      const tokens = await tokenResponse.json();
      
      if (tokens.access_token) {
        // Get user info from Google
        const userInfoResponse = await fetch(
          `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokens.access_token}`
        );
        const userInfo = await userInfoResponse.json();

        // Get YouTube channel info
        const channelResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true&access_token=${tokens.access_token}`
        );
        const channelData = await channelResponse.json();

        return {
          user: userInfo,
          tokens,
          channel: channelData.items?.[0] || null,
        };
      }
    }
    
    return null;
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