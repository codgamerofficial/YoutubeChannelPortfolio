// YouTube Data API service
import axios from 'axios';

const YOUTUBE_API_KEY = 'YOUR_YOUTUBE_API_KEY';
const CHANNEL_ID = 'UCIMBMaomkNyX5uJjO9VVN1A';

// Fallback data when API is not configured
const FALLBACK_CHANNEL_STATS: ChannelStats = {
  subscriberCount: '1500',
  viewCount: '25200',
  videoCount: '45',
  title: 'Your YouTube Channel',
  description: 'Welcome to my YouTube channel! Configure your API key to see real stats.',
  thumbnails: {
    default: { url: 'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=88&h=88&fit=crop' },
    medium: { url: 'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=240&h=240&fit=crop' },
    high: { url: 'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop' },
  },
};

const FALLBACK_VIDEOS: VideoData[] = [
  {
    id: 'demo1',
    title: 'Getting Started with React Native',
    description: 'Learn the basics of React Native development',
    thumbnails: {
      default: { url: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=120&h=90&fit=crop' },
      medium: { url: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=320&h=180&fit=crop' },
      high: { url: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=480&h=360&fit=crop' },
    },
    publishedAt: '2024-01-15T10:00:00Z',
    viewCount: '1250',
    likeCount: '89',
    duration: '12:34',
  },
  {
    id: 'demo2',
    title: 'Advanced JavaScript Tips',
    description: 'Pro tips for JavaScript developers',
    thumbnails: {
      default: { url: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=120&h=90&fit=crop' },
      medium: { url: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=320&h=180&fit=crop' },
      high: { url: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=480&h=360&fit=crop' },
    },
    publishedAt: '2024-01-10T14:30:00Z',
    viewCount: '2100',
    likeCount: '156',
    duration: '8:45',
  },
  {
    id: 'demo3',
    title: 'Building Mobile Apps with Expo',
    description: 'Complete guide to Expo development',
    thumbnails: {
      default: { url: 'https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg?auto=compress&cs=tinysrgb&w=120&h=90&fit=crop' },
      medium: { url: 'https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg?auto=compress&cs=tinysrgb&w=320&h=180&fit=crop' },
      high: { url: 'https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg?auto=compress&cs=tinysrgb&w=480&h=360&fit=crop' },
    },
    publishedAt: '2024-01-05T09:15:00Z',
    viewCount: '3400',
    likeCount: '234',
    duration: '15:22',
  },
  {
    id: 'demo4',
    title: 'Modern Web Development Trends',
    description: 'Latest trends in web development',
    thumbnails: {
      default: { url: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=120&h=90&fit=crop' },
      medium: { url: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=320&h=180&fit=crop' },
      high: { url: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=480&h=360&fit=crop' },
    },
    publishedAt: '2024-01-20T16:00:00Z',
    viewCount: '1890',
    likeCount: '142',
    duration: '10:15',
  },
  {
    id: 'demo5',
    title: 'API Integration Best Practices',
    description: 'How to integrate APIs effectively',
    thumbnails: {
      default: { url: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=120&h=90&fit=crop' },
      medium: { url: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=320&h=180&fit=crop' },
      high: { url: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=480&h=360&fit=crop' },
    },
    publishedAt: '2024-01-12T11:30:00Z',
    viewCount: '1650',
    likeCount: '98',
    duration: '14:20',
  },
];

export interface ChannelStats {
  subscriberCount: string;
  viewCount: string;
  videoCount: string;
  title: string;
  description: string;
  thumbnails: {
    default: { url: string };
    medium: { url: string };
    high: { url: string };
  };
}

export interface VideoData {
  id: string;
  title: string;
  description: string;
  thumbnails: {
    default: { url: string };
    medium: { url: string };
    high: { url: string };
  };
  publishedAt: string;
  viewCount: string;
  likeCount: string;
  duration: string;
}

export class YouTubeApiService {
  private baseUrl = 'https://www.googleapis.com/youtube/v3';
  private customApiKey: string | null = null;
  private customChannelId: string | null = null;
  private googleAccessToken: string | null = null;

  setCustomCredentials(apiKey: string, channelId: string) {
    this.customApiKey = apiKey;
    this.customChannelId = channelId;
  }

  setGoogleAccessToken(accessToken: string) {
    this.googleAccessToken = accessToken;
  }

  private getApiKey(): string {
    if (this.googleAccessToken) {
      return this.googleAccessToken;
    }
    return this.customApiKey || YOUTUBE_API_KEY;
  }

  private getAuthHeaders(): Record<string, string> {
    if (this.googleAccessToken) {
      return {
        'Authorization': `Bearer ${this.googleAccessToken}`,
      };
    }
    return {};
  }

  private getChannelId(): string {
    return this.customChannelId || CHANNEL_ID;
  }

  private isApiKeyConfigured(): boolean {
    if (this.googleAccessToken) {
      return true;
    }
    const apiKey = this.getApiKey();
    return apiKey !== 'YOUR_YOUTUBE_API_KEY' && apiKey.length > 10;
  }

  async getMyChannel(): Promise<ChannelStats | null> {
    if (!this.googleAccessToken) {
      return this.getChannelStats();
    }

    try {
      const response = await axios.get(`${this.baseUrl}/channels`, {
        params: {
          part: 'snippet,statistics',
          mine: true,
        },
        headers: this.getAuthHeaders(),
      });

      if (response.data.items && response.data.items.length > 0) {
        const channel = response.data.items[0];
        return {
          subscriberCount: channel.statistics.subscriberCount,
          viewCount: channel.statistics.viewCount,
          videoCount: channel.statistics.videoCount,
          title: channel.snippet.title,
          description: channel.snippet.description,
          thumbnails: channel.snippet.thumbnails,
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching my channel:', error);
      return this.getChannelStats();
    }
  }

  async getChannelStats(): Promise<ChannelStats | null> {
    if (!this.isApiKeyConfigured()) {
      console.log('YouTube API key not configured, using fallback data');
      return FALLBACK_CHANNEL_STATS;
    }

    try {
      const response = await axios.get(`${this.baseUrl}/channels`, {
        params: {
          part: 'snippet,statistics', 
          ...(this.googleAccessToken ? { mine: true } : { id: this.getChannelId() }),
          ...(this.googleAccessToken ? {} : { key: this.getApiKey() }),
        },
        headers: this.getAuthHeaders(),
      });

      if (response.data.items && response.data.items.length > 0) {
        const channel = response.data.items[0];
        return {
          subscriberCount: channel.statistics.subscriberCount,
          viewCount: channel.statistics.viewCount,
          videoCount: channel.statistics.videoCount,
          title: channel.snippet.title,
          description: channel.snippet.description,
          thumbnails: channel.snippet.thumbnails,
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching channel stats:', error);
      return FALLBACK_CHANNEL_STATS;
    }
  }

  async getChannelVideos(maxResults: number = 10): Promise<VideoData[]> {
    if (!this.isApiKeyConfigured()) {
      console.log('YouTube API key not configured, using fallback data');
      return FALLBACK_VIDEOS.slice(0, maxResults);
    }

    try {
      // First, get the uploads playlist ID
      const channelResponse = await axios.get(`${this.baseUrl}/channels`, {
        params: {
          part: 'contentDetails',
          ...(this.googleAccessToken ? { mine: true } : { id: this.getChannelId() }),
          ...(this.googleAccessToken ? {} : { key: this.getApiKey() }),
        },
        headers: this.getAuthHeaders(),
      });

      if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
        return [];
      }

      const uploadsPlaylistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;

      // Get videos from uploads playlist
      const playlistResponse = await axios.get(`${this.baseUrl}/playlistItems`, {
        params: {
          part: 'snippet',
          playlistId: uploadsPlaylistId,
          maxResults,
          ...(this.googleAccessToken ? {} : { key: this.getApiKey() }),
        },
        headers: this.getAuthHeaders(),
      });

      if (!playlistResponse.data.items) {
        return [];
      }

      // Get video statistics and details
      const videoIds = playlistResponse.data.items.map((item: any) => item.snippet.resourceId.videoId).join(',');
      
      const videosResponse = await axios.get(`${this.baseUrl}/videos`, {
        params: {
          part: 'snippet,statistics,contentDetails',
          id: videoIds,
          ...(this.googleAccessToken ? {} : { key: this.getApiKey() }),
        },
        headers: this.getAuthHeaders(),
      });

      return videosResponse.data.items.map((video: any) => ({
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnails: video.snippet.thumbnails,
        publishedAt: video.snippet.publishedAt,
        viewCount: video.statistics.viewCount || '0',
        likeCount: video.statistics.likeCount || '0',
        duration: this.formatDuration(video.contentDetails.duration),
      }));
    } catch (error) {
      console.error('Error fetching channel videos:', error);
      return FALLBACK_VIDEOS.slice(0, maxResults);
    }
  }

  private formatDuration(duration: string): string {
    // Convert ISO 8601 duration (PT4M13S) to readable format (4:13)
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return '0:00';

    const hours = parseInt(match[1]?.replace('H', '') || '0');
    const minutes = parseInt(match[2]?.replace('M', '') || '0');
    const seconds = parseInt(match[3]?.replace('S', '') || '0');

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  formatNumber(num: string): string {
    const number = parseInt(num);
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + 'M';
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + 'K';
    }
    return number.toString();
  }

  async searchChannelByHandle(handle: string): Promise<string | null> {
    if (!this.isApiKeyConfigured()) {
      return null;
    }

    try {
      const response = await axios.get(`${this.baseUrl}/search`, {
        params: {
          part: 'snippet',
          q: handle,
          type: 'channel',
          maxResults: 1,
          key: this.getApiKey(),
        },
      });

      if (response.data.items && response.data.items.length > 0) {
        return response.data.items[0].snippet.channelId;
      }
      return null;
    } catch (error) {
      console.error('Error searching channel:', error);
      return null;
    }
  }
}

export const youtubeApi = new YouTubeApiService();