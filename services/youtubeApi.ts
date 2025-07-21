// YouTube Data API service
import axios from 'axios';

const YOUTUBE_API_KEY = 'AIzaSyAd1-0fm4LkYBw_EjJGhrStZadW-htIIcs';
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

  private isApiKeyConfigured(): boolean {
    return YOUTUBE_API_KEY !== 'YOUR_YOUTUBE_API_KEY' && YOUTUBE_API_KEY.length > 10;
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
          id: CHANNEL_ID,
          key: YOUTUBE_API_KEY,
        },
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
          id: CHANNEL_ID,
          key: YOUTUBE_API_KEY,
        },
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
          key: YOUTUBE_API_KEY,
        },
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
          key: YOUTUBE_API_KEY,
        },
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
}

export const youtubeApi = new YouTubeApiService();