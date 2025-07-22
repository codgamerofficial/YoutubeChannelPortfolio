import { supabase } from './supabase';
import { youtubeApi, VideoData, ChannelStats } from './youtubeApi';

export interface AIInsight {
  id: string;
  type: 'growth' | 'content' | 'engagement' | 'optimization';
  title: string;
  description: string;
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
  impact_score: number;
}

export interface ContentSuggestion {
  title: string;
  description: string;
  tags: string[];
  estimated_views: number;
  confidence: number;
}

export class AIAnalyticsService {
  async analyzeChannelPerformance(
    channelStats: ChannelStats,
    videos: VideoData[]
  ): Promise<AIInsight[]> {
    const insights: AIInsight[] = [];

    // Analyze growth trends
    const growthInsight = this.analyzeGrowthTrends(channelStats, videos);
    if (growthInsight) insights.push(growthInsight);

    // Analyze content performance
    const contentInsights = this.analyzeContentPerformance(videos);
    insights.push(...contentInsights);

    // Analyze engagement patterns
    const engagementInsight = this.analyzeEngagementPatterns(videos);
    if (engagementInsight) insights.push(engagementInsight);

    // Analyze upload consistency
    const consistencyInsight = this.analyzeUploadConsistency(videos);
    if (consistencyInsight) insights.push(consistencyInsight);

    return insights;
  }

  private analyzeGrowthTrends(channelStats: ChannelStats, videos: VideoData[]): AIInsight | null {
    const totalViews = parseInt(channelStats.viewCount);
    const subscriberCount = parseInt(channelStats.subscriberCount);
    const videoCount = parseInt(channelStats.videoCount);

    const avgViewsPerVideo = totalViews / videoCount;
    const subscriberToViewRatio = subscriberCount / totalViews;

    if (subscriberToViewRatio < 0.01) {
      return {
        id: 'growth-1',
        type: 'growth',
        title: 'Low Subscriber Conversion',
        description: 'Your subscriber-to-view ratio is below average',
        recommendation: 'Add clear call-to-actions in your videos asking viewers to subscribe. Create engaging content that encourages repeat viewing.',
        priority: 'high',
        impact_score: 85,
      };
    }

    if (avgViewsPerVideo < 100) {
      return {
        id: 'growth-2',
        type: 'growth',
        title: 'Improve Video Reach',
        description: 'Your average views per video could be improved',
        recommendation: 'Focus on SEO optimization, better thumbnails, and more engaging titles to increase video discoverability.',
        priority: 'medium',
        impact_score: 70,
      };
    }

    return null;
  }

  private analyzeContentPerformance(videos: VideoData[]): AIInsight[] {
    const insights: AIInsight[] = [];
    
    if (videos.length === 0) return insights;

    // Sort videos by view count
    const sortedVideos = [...videos].sort((a, b) => parseInt(b.viewCount) - parseInt(a.viewCount));
    const topPerformers = sortedVideos.slice(0, Math.ceil(videos.length * 0.2));
    const avgViews = videos.reduce((sum, video) => sum + parseInt(video.viewCount), 0) / videos.length;

    // Analyze top performers
    const topPerformerAvg = topPerformers.reduce((sum, video) => sum + parseInt(video.viewCount), 0) / topPerformers.length;
    
    if (topPerformerAvg > avgViews * 2) {
      insights.push({
        id: 'content-1',
        type: 'content',
        title: 'Replicate Top Content',
        description: 'Your top 20% of videos perform significantly better than average',
        recommendation: `Analyze your top-performing videos and create similar content. Common themes in your best videos should guide future content strategy.`,
        priority: 'high',
        impact_score: 90,
      });
    }

    // Analyze video length patterns
    const shortVideos = videos.filter(v => this.parseDuration(v.duration) < 300); // < 5 minutes
    const longVideos = videos.filter(v => this.parseDuration(v.duration) > 600); // > 10 minutes

    if (shortVideos.length > 0 && longVideos.length > 0) {
      const shortAvgViews = shortVideos.reduce((sum, v) => sum + parseInt(v.viewCount), 0) / shortVideos.length;
      const longAvgViews = longVideos.reduce((sum, v) => sum + parseInt(v.viewCount), 0) / longVideos.length;

      if (shortAvgViews > longAvgViews * 1.5) {
        insights.push({
          id: 'content-2',
          type: 'content',
          title: 'Shorter Content Performs Better',
          description: 'Your shorter videos get more views on average',
          recommendation: 'Consider creating more concise, focused content. Shorter videos often have better retention rates.',
          priority: 'medium',
          impact_score: 65,
        });
      } else if (longAvgViews > shortAvgViews * 1.5) {
        insights.push({
          id: 'content-3',
          type: 'content',
          title: 'Long-form Content Success',
          description: 'Your longer videos perform better',
          recommendation: 'Your audience prefers in-depth content. Continue creating comprehensive, detailed videos.',
          priority: 'medium',
          impact_score: 65,
        });
      }
    }

    return insights;
  }

  private analyzeEngagementPatterns(videos: VideoData[]): AIInsight | null {
    if (videos.length === 0) return null;

    const totalLikes = videos.reduce((sum, video) => sum + parseInt(video.likeCount || '0'), 0);
    const totalViews = videos.reduce((sum, video) => sum + parseInt(video.viewCount), 0);
    const engagementRate = (totalLikes / totalViews) * 100;

    if (engagementRate < 2) {
      return {
        id: 'engagement-1',
        type: 'engagement',
        title: 'Low Engagement Rate',
        description: `Your engagement rate is ${engagementRate.toFixed(2)}%, which is below the 2-4% benchmark`,
        recommendation: 'Encourage more interaction by asking questions, creating polls, and responding to comments. End videos with clear calls-to-action.',
        priority: 'high',
        impact_score: 80,
      };
    }

    if (engagementRate > 5) {
      return {
        id: 'engagement-2',
        type: 'engagement',
        title: 'Excellent Engagement',
        description: `Your ${engagementRate.toFixed(2)}% engagement rate is excellent!`,
        recommendation: 'Keep doing what you\'re doing! Your audience is highly engaged. Consider leveraging this engagement for community building.',
        priority: 'low',
        impact_score: 95,
      };
    }

    return null;
  }

  private analyzeUploadConsistency(videos: VideoData[]): AIInsight | null {
    if (videos.length < 5) return null;

    const uploadDates = videos.map(v => new Date(v.publishedAt)).sort((a, b) => b.getTime() - a.getTime());
    const intervals: number[] = [];

    for (let i = 0; i < uploadDates.length - 1; i++) {
      const daysDiff = (uploadDates[i].getTime() - uploadDates[i + 1].getTime()) / (1000 * 60 * 60 * 24);
      intervals.push(daysDiff);
    }

    const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    const consistency = intervals.reduce((sum, interval) => sum + Math.abs(interval - avgInterval), 0) / intervals.length;

    if (consistency > 7) {
      return {
        id: 'consistency-1',
        type: 'optimization',
        title: 'Inconsistent Upload Schedule',
        description: 'Your upload schedule varies significantly',
        recommendation: 'Establish a consistent upload schedule. Regular uploads help build audience expectations and improve algorithm performance.',
        priority: 'medium',
        impact_score: 70,
      };
    }

    return null;
  }

  async generateContentSuggestions(
    channelStats: ChannelStats,
    videos: VideoData[]
  ): Promise<ContentSuggestion[]> {
    const suggestions: ContentSuggestion[] = [];

    // Analyze successful content patterns
    const topVideos = videos
      .sort((a, b) => parseInt(b.viewCount) - parseInt(a.viewCount))
      .slice(0, 5);

    // Generate suggestions based on top performers
    if (topVideos.length > 0) {
      suggestions.push({
        title: 'Tutorial Series Based on Top Content',
        description: 'Create a multi-part series expanding on your most successful video topics',
        tags: ['tutorial', 'series', 'educational'],
        estimated_views: Math.floor(parseInt(topVideos[0].viewCount) * 0.7),
        confidence: 85,
      });

      suggestions.push({
        title: 'Behind the Scenes Content',
        description: 'Show your creative process and setup to build stronger audience connection',
        tags: ['behind-the-scenes', 'personal', 'vlog'],
        estimated_views: Math.floor(parseInt(topVideos[0].viewCount) * 0.4),
        confidence: 70,
      });
    }

    // Trending topic suggestions
    suggestions.push({
      title: 'Current Trends Analysis',
      description: 'Create content around trending topics in your niche',
      tags: ['trending', 'analysis', 'current'],
      estimated_views: Math.floor(parseInt(channelStats.viewCount) / parseInt(channelStats.videoCount) * 1.2),
      confidence: 60,
    });

    suggestions.push({
      title: 'Q&A with Your Audience',
      description: 'Answer common questions from your comments and community',
      tags: ['qa', 'community', 'interactive'],
      estimated_views: Math.floor(parseInt(channelStats.viewCount) / parseInt(channelStats.videoCount) * 0.8),
      confidence: 75,
    });

    return suggestions;
  }

  private parseDuration(duration: string): number {
    const parts = duration.split(':').map(Number);
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 0;
  }

  async saveAnalytics(userId: string, channelId: string, insights: AIInsight[]) {
    try {
      const { error } = await supabase
        .from('channel_analytics')
        .upsert({
          user_id: userId,
          channel_id: channelId,
          insights: JSON.stringify(insights),
          analyzed_at: new Date().toISOString(),
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving analytics:', error);
    }
  }
}

export const aiAnalytics = new AIAnalyticsService();