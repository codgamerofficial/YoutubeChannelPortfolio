import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, Users, Eye, ThumbsUp, MessageCircle, Share, Clock } from 'lucide-react-native';
import { useYouTubeData } from '@/hooks/useYouTubeData';
import { youtubeApi } from '@/services/youtubeApi';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const { channelStats, videos, loading, error } = useYouTubeData();

  // Calculate total likes from all videos
  const totalLikes = videos.reduce((sum, video) => sum + parseInt(video.likeCount || '0'), 0);
  
  const analyticsData = [
    {
      title: 'Total Views',
      value: channelStats ? youtubeApi.formatNumber(channelStats.viewCount) : '25.2K',
      change: '+18.5%',
      icon: Eye,
      color: '#4F46E5',
      gradient: ['#4F46E5', '#7C3AED'],
    },
    {
      title: 'Subscribers',
      value: channelStats ? youtubeApi.formatNumber(channelStats.subscriberCount) : '1.5K',
      change: '+12.8%',
      icon: Users,
      color: '#059669',
      gradient: ['#059669', '#10B981'],
    },
    {
      title: 'Total Likes',
      value: youtubeApi.formatNumber(totalLikes.toString()),
      change: '+22.1%',
      icon: ThumbsUp,
      color: '#DC2626',
      gradient: ['#DC2626', '#EF4444'],
    },
    {
      title: 'Total Videos',
      value: channelStats ? channelStats.videoCount : '45',
      change: '+15.3%',
      icon: Clock,
      color: '#D97706',
      gradient: ['#D97706', '#F59E0B'],
    },
  ];

  const monthlyViews = [
    { month: 'Jan', views: 1.8 },
    { month: 'Feb', views: 2.3 },
    { month: 'Mar', views: 2.1 },
    { month: 'Apr', views: 3.2 },
    { month: 'May', views: 2.9 },
    { month: 'Jun', views: 4.1 },
  ];

  // Get top 3 videos by view count
  const topVideos = videos
    .sort((a, b) => parseInt(b.viewCount) - parseInt(a.viewCount))
    .slice(0, 3)
    .map((video, index) => ({
      title: video.title.length > 25 ? video.title.substring(0, 25) + '...' : video.title,
      views: youtubeApi.formatNumber(video.viewCount),
      engagement: '95%', // You can calculate this based on likes/views ratio
      thumbnail: video.thumbnails.medium?.url || video.thumbnails.default.url,
    }));

  const renderAnalyticsCard = (item, index) => (
    <LinearGradient
      key={index}
      colors={item.gradient}
      style={styles.analyticsCard}>
      <View style={styles.cardHeader}>
        <item.icon size={24} color="#fff" />
        <Text style={styles.changeText}>{item.change}</Text>
      </View>
      <Text style={styles.cardValue}>{item.value}</Text>
      <Text style={styles.cardTitle}>{item.title}</Text>
    </LinearGradient>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF0000" />
        <Text style={styles.loadingText}>Loading analytics...</Text>
      </View>
    );
  }
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
        <Text style={styles.headerSubtitle}>Last 30 days</Text>
      </View>

      {/* Analytics Cards */}
      <View style={styles.analyticsGrid}>
        {analyticsData.map((item, index) => renderAnalyticsCard(item, index))}
      </View>

      {/* Monthly Views Chart */}
      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>Monthly Views</Text>
        <View style={styles.chartContainer}>
          <View style={styles.chart}>
            {monthlyViews.map((item, index) => (
              <View key={index} style={styles.chartColumn}>
                <View
                  style={[
                    styles.chartBar,
                    { height: (item.views / 6.5) * 120 },
                  ]}
                />
                <Text style={styles.chartLabel}>{item.month}</Text>
                <Text style={styles.chartValue}>{item.views}M</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Top Performing Videos */}
      <View style={styles.topVideosSection}>
        <Text style={styles.sectionTitle}>Top Performing Videos</Text>
        {topVideos.map((video, index) => (
          <View key={index} style={styles.videoAnalyticsCard}>
            <Image source={{ uri: video.thumbnail }} style={styles.videoThumbnail} />
            <View style={styles.videoInfo}>
              <Text style={styles.videoTitle} numberOfLines={1}>
                {video.title}
              </Text>
              <View style={styles.videoStats}>
                <View style={styles.statItem}>
                  <Eye size={14} color="#666" />
                  <Text style={styles.statText}>{video.views} views</Text>
                </View>
                <View style={styles.statItem}>
                  <TrendingUp size={14} color="#059669" />
                  <Text style={[styles.statText, { color: '#059669' }]}>
                    {video.engagement} engagement
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.videoRank}>
              <Text style={styles.rankNumber}>#{index + 1}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Engagement Metrics */}
      <View style={styles.engagementSection}>
        <Text style={styles.sectionTitle}>Engagement Overview</Text>
        <View style={styles.engagementGrid}>
          <View style={styles.engagementCard}>
            <MessageCircle size={20} color="#4F46E5" />
            <Text style={styles.engagementValue}>{youtubeApi.formatNumber(totalLikes.toString())}</Text>
            <Text style={styles.engagementLabel}>Comments</Text>
          </View>
          <View style={styles.engagementCard}>
            <Share size={20} color="#DC2626" />
            <Text style={styles.engagementValue}>{youtubeApi.formatNumber(totalLikes.toString())}</Text>
            <Text style={styles.engagementLabel}>Shares</Text>
          </View>
          <View style={styles.engagementCard}>
            <TrendingUp size={20} color="#059669" />
            <Text style={styles.engagementValue}>92%</Text>
            <Text style={styles.engagementLabel}>Retention</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Medium',
    color: '#666',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Orbitron-Bold',
    fontWeight: 'bold',
    color: '#333',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'FiraCode-Regular',
    color: '#666',
    marginTop: 5,
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  analyticsCard: {
    width: (width - 40) / 2,
    padding: 20,
    borderRadius: 16,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  changeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  cardValue: {
    fontSize: 24,
    fontFamily: 'Orbitron-Black',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    letterSpacing: 1,
  },
  cardTitle: {
    fontSize: 12,
    fontFamily: 'SpaceGrotesk-Medium',
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  chartSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Orbitron-Bold',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 160,
  },
  chartColumn: {
    alignItems: 'center',
    flex: 1,
  },
  chartBar: {
    backgroundColor: '#FF0000',
    width: 30,
    borderRadius: 4,
    marginBottom: 10,
  },
  chartLabel: {
    fontSize: 12,
    fontFamily: 'FiraCode-Regular',
    color: '#666',
    marginBottom: 2,
  },
  chartValue: {
    fontSize: 10,
    fontFamily: 'FiraCode-Light',
    color: '#999',
  },
  topVideosSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  videoAnalyticsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  videoThumbnail: {
    width: 60,
    height: 45,
    borderRadius: 8,
    marginRight: 12,
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  videoStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  statText: {
    fontSize: 12,
    fontFamily: 'FiraCode-Regular',
    color: '#666',
    marginLeft: 4,
  },
  videoRank: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: 16,
    fontFamily: 'Orbitron-Bold',
    fontWeight: 'bold',
    color: '#333',
  },
  engagementSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  engagementGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  engagementCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  engagementValue: {
    fontSize: 20,
    fontFamily: 'Orbitron-Black',
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 8,
  },
  engagementLabel: {
    fontSize: 12,
    fontFamily: 'SpaceGrotesk-Medium',
    color: '#666',
  },
});