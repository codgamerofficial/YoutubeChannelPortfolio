import { useState, useEffect } from 'react';
import { youtubeApi, ChannelStats, VideoData } from '@/services/youtubeApi';

export function useYouTubeData() {
  const [channelStats, setChannelStats] = useState<ChannelStats | null>(null);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsData, videosData] = await Promise.all([
        youtubeApi.getChannelStats(),
        youtubeApi.getChannelVideos(50), // Fetch more videos
      ]);

      if (statsData) {
        setChannelStats(statsData);
      }
      setVideos(videosData);
    } catch (err) {
      setError('Failed to fetch YouTube data');
      console.error('Error fetching YouTube data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    channelStats,
    videos,
    loading,
    error,
    refetch: fetchData,
  };
}