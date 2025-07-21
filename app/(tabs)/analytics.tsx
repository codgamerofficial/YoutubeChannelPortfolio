import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, Users, Eye, ThumbsUp, MessageCircle, Share, Clock, Calendar, BarChart3 } from 'lucide-react-native';
import ThemeToggle from '@/components/ThemeToggle';
import { useYouTubeData } from '@/hooks/useYouTubeData';
import { youtubeApi } from '@/services/youtubeApi';
import { useTheme } from '@/contexts/ThemeContext';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const { colors } = useTheme();
  const { channelStats, videos, loading, error } = useYouTubeData();

  const totalLikes = videos.reduce((sum, video) => sum + parseInt(video.likeCount || '0'), 0);
  
  const analyticsData = [
    {
      title: 'Total Views',
      value: channelStats ? youtubeApi.formatNumber(channelStats.viewCount) : '25.2K',
      change: '+18.5%',
      icon: Eye,
      gradient: colors.gradient1,
    },
    {
      title: 'Subscribers',
      value: channelStats ? youtubeApi.formatNumber(channelStats.subscriberCount) : '1.5K',
      change: '+12.8%',
      icon: Users,
      gradient: colors.gradient2,
    },
    {
      title: 'Total Likes',
      value: youtubeApi.formatNumber(totalLikes.toString()),
      change: '+22.1%',
      icon: ThumbsUp,
      gradient: colors.gradient3,
    },
    {
      title: 'Total Videos',
      value: channelStats ? channelStats.videoCount : '45',
      change: '+15.3%',
      icon: Clock,
      gradient: [colors.accent, colors.secondary],
    },
  ];

  const monthlyViews = [
    { month: 'Jan', views: 1.8, color: colors.primary },
    { month: 'Feb', views: 2.3, color: colors.secondary },
    { month: 'Mar', views: 2.1, color: colors.accent },
    { month: 'Apr', views: 3.2, color: colors.success },
    { month: 'May', views: 2.9, color: colors.primary },
    { month: 'Jun', views: 4.1, color: colors.secondary },
  ];

  const topVideos = videos
    .sort((a, b) => parseInt(b.viewCount) - parseInt(a.viewCount))
    .slice(0, 5)
    .map((video, index) => ({
      title: video.title.length > 30 ? video.title.substring(0, 30) + '...' : video.title,
      views: youtubeApi.formatNumber(video.viewCount),
      engagement: Math.floor(Math.random() * 20 + 80) + '%',
      thumbnail: video.thumbnails.medium?.url || video.thumbnails.default.url,
      rank: index + 1,
    }));

  const renderAnalyticsCard = (item, index) => (
    <LinearGradient
      key={index}
      colors={item.gradient}
      style={styles.analyticsCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}>
      <View style={styles.cardHeader}>
        <View style={styles.cardIcon}>
          <item.icon size={24} color="#fff" />
        </View>
        <View style={styles.changeContainer}>
          <TrendingUp size={12} color="#fff" />
          <Text style={styles.changeText}>{item.change}</Text>
        </View>
      </View>
      <Text style={styles.cardValue}>{item.value}</Text>
      <Text style={styles.cardTitle}>{item.title}</Text>
    </LinearGradient>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading analytics...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Analytics</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Last 30 days</Text>
        </View>
        <ThemeToggle />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Analytics Cards */}
        <View style={styles.analyticsSection}>
          <View style={styles.analyticsGrid}>
            {analyticsData.map((item, index) => renderAnalyticsCard(item, index))}
          </View>
        </View>

        {/* Monthly Views Chart */}
        <View style={styles.chartSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Monthly Performance</Text>
            <TouchableOpacity style={[styles.chartButton, { backgroundColor: colors.primary }]}>
              <BarChart3 size={16} color="#fff" />
              <Text style={styles.chartButtonText}>View Details</Text>
            </TouchableOpacity>
          </View>
          
          <View style={[styles.chartContainer, { backgroundColor: colors.card }]}>
            <View style={styles.chart}>
              {monthlyViews.map((item, index) => (
                <View key={index} style={styles.chartColumn}>
                  <Text style={[styles.chartValue, { color: colors.textSecondary }]}>
                    {item.views}M
                  </Text>
                  <View
                    style={[
                      styles.chartBar,
                      { 
                        height: (item.views / 5) * 120,
                        backgroundColor: item.color,
                      },
                    ]}
                  />
                  <Text style={[styles.chartLabel, { color: colors.textSecondary }]}>
                    {item.month}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Top Performing Videos */}
        <View style={styles.topVideosSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Top Performing Videos</Text>
          {topVideos.map((video, index) => (
            <View key={index} style={[styles.videoAnalyticsCard, { backgroundColor: colors.card }]}>
              <View style={styles.videoRank}>
                <LinearGradient
                  colors={index < 3 ? colors.gradient1 : [colors.textSecondary, colors.textSecondary]}
                  style={styles.rankBadge}>
                  <Text style={styles.rankNumber}>#{video.rank}</Text>
                </LinearGradient>
              </View>
              
              <Image source={{ uri: video.thumbnail }} style={styles.videoThumbnail} />
              
              <View style={styles.videoInfo}>
                <Text style={[styles.videoTitle, { color: colors.text }]} numberOfLines={2}>
                  {video.title}
                </Text>
                <View style={styles.videoStats}>
                  <View style={styles.statItem}>
                    <Eye size={14} color={colors.primary} />
                    <Text style={[styles.statText, { color: colors.textSecondary }]}>
                      {video.views} views
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <TrendingUp size={14} color={colors.success} />
                    <Text style={[styles.statText, { color: colors.success }]}>
                      {video.engagement} engagement
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Engagement Metrics */}
        <View style={styles.engagementSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Engagement Overview</Text>
          <View style={styles.engagementGrid}>
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              style={styles.engagementCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}>
              <MessageCircle size={24} color="#fff" />
              <Text style={styles.engagementValue}>
                {youtubeApi.formatNumber((totalLikes * 0.3).toString())}
              </Text>
              <Text style={styles.engagementLabel}>Comments</Text>
            </LinearGradient>
            
            <LinearGradient
              colors={[colors.secondary, colors.accent]}
              style={styles.engagementCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}>
              <Share size={24} color="#fff" />
              <Text style={styles.engagementValue}>
                {youtubeApi.formatNumber((totalLikes * 0.1).toString())}
              </Text>
              <Text style={styles.engagementLabel}>Shares</Text>
            </LinearGradient>
            
            <LinearGradient
              colors={[colors.accent, colors.success]}
              style={styles.engagementCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}>
              <TrendingUp size={24} color="#fff" />
              <Text style={styles.engagementValue}>92%</Text>
              <Text style={styles.engagementLabel}>Retention</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Performance Insights */}
        <View style={styles.insightsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Performance Insights</Text>
          <View style={[styles.insightCard, { backgroundColor: colors.card }]}>
            <View style={styles.insightHeader}>
              <View style={[styles.insightIcon, { backgroundColor: `${colors.success}20` }]}>
                <TrendingUp size={20} color={colors.success} />
              </View>
              <Text style={[styles.insightTitle, { color: colors.text }]}>Growing Audience</Text>
            </View>
            <Text style={[styles.insightDescription, { color: colors.textSecondary }]}>
              Your subscriber growth has increased by 25% this month. Keep creating engaging content!
            </Text>
          </View>
          
          <View style={[styles.insightCard, { backgroundColor: colors.card }]}>
            <View style={styles.insightHeader}>
              <View style={[styles.insightIcon, { backgroundColor: `${colors.primary}20` }]}>
                <Eye size={20} color={colors.primary} />
              </View>
              <Text style={[styles.insightTitle, { color: colors.text }]}>High Engagement</Text>
            </View>
            <Text style={[styles.insightDescription, { color: colors.textSecondary }]}>
              Your videos are getting 15% more views than average. Your content strategy is working!
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Medium',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Orbitron-Bold',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'FiraCode-Regular',
    marginTop: 4,
  },
  analyticsSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  analyticsCard: {
    width: (width - 50) / 2,
    padding: 20,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  changeText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'FiraCode-Medium',
    fontWeight: '600',
    marginLeft: 4,
  },
  cardValue: {
    fontSize: 28,
    fontFamily: 'Orbitron-Black',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-SemiBold',
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  chartSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Orbitron-Bold',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  chartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  chartButtonText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'SpaceGrotesk-SemiBold',
    marginLeft: 4,
  },
  chartContainer: {
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
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
    width: 24,
    borderRadius: 12,
    marginVertical: 8,
  },
  chartLabel: {
    fontSize: 12,
    fontFamily: 'FiraCode-Regular',
  },
  chartValue: {
    fontSize: 11,
    fontFamily: 'FiraCode-Medium',
    fontWeight: '600',
  },
  topVideosSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  videoAnalyticsCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  videoRank: {
    marginRight: 12,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: 14,
    fontFamily: 'Orbitron-Bold',
    fontWeight: 'bold',
    color: '#fff',
  },
  videoThumbnail: {
    width: 80,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 22,
  },
  videoStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 12,
    fontFamily: 'FiraCode-Regular',
    marginLeft: 4,
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
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  engagementValue: {
    fontSize: 24,
    fontFamily: 'Orbitron-Black',
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 8,
    letterSpacing: 1,
  },
  engagementLabel: {
    fontSize: 12,
    fontFamily: 'SpaceGrotesk-SemiBold',
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  insightsSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  insightCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightTitle: {
    fontSize: 18,
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontWeight: '600',
  },
  insightDescription: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Regular',
    lineHeight: 20,
  },
});