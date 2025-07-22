import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  Modal,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { Play, Users, Eye, ThumbsUp, Share as ShareIcon, TrendingUp, Calendar, Clock, Settings, LogIn, Brain } from 'lucide-react-native';
import FunkyBackground from '@/components/FunkyBackground';
import FeaturedVideoCard from '@/components/FeaturedVideoCard';
import ThemeToggle from '@/components/ThemeToggle';
import AuthScreen from '@/components/AuthScreen';
import ChannelSetup from '@/components/ChannelSetup';
import AIInsightsCard from '@/components/AIInsightsCard';
import { useYouTubeData } from '@/hooks/useYouTubeData';
import { youtubeApi } from '@/services/youtubeApi';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { aiAnalytics, AIInsight } from '@/services/aiAnalytics';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const { colors } = useTheme();
  const { user, profile } = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);
  const [showAuth, setShowAuth] = React.useState(false);
  const [showSetup, setShowSetup] = React.useState(false);
  const [aiInsights, setAiInsights] = React.useState<AIInsight[]>([]);
  const { channelStats, videos, loading, error, refetch } = useYouTubeData();
  const fadeAnim = useSharedValue(0);
  const scaleAnim = useSharedValue(0.8);
  const scrollY = useSharedValue(0);

  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 1200 });
    scaleAnim.value = withSpring(1, { damping: 15, stiffness: 150 });
  }, []);

  useEffect(() => {
    if (user && profile?.youtube_api_key && profile?.youtube_channel_id) {
      youtubeApi.setCustomCredentials(profile.youtube_api_key, profile.youtube_channel_id);
      generateAIInsights();
    }
  }, [user, profile, channelStats, videos]);

  const generateAIInsights = async () => {
    if (channelStats && videos.length > 0) {
      try {
        const insights = await aiAnalytics.analyzeChannelPerformance(channelStats, videos);
        setAiInsights(insights);
        
        if (user) {
          await aiAnalytics.saveAnalytics(user.id, channelStats.title, insights);
        }
      } catch (error) {
        console.error('Error generating AI insights:', error);
      }
    }
  };
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 100], [1, 0.8]);
    const scale = interpolate(scrollY.value, [0, 100], [1, 0.95]);
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ scale: scaleAnim.value }],
    };
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch().then(() => {
      if (user && profile?.youtube_api_key) {
        generateAIInsights();
      }
    }).finally(() => setRefreshing(false));
  }, [refetch]);

  const handleShareChannel = async () => {
    try {
      const channelUrl = `https://youtube.com/channel/${profile?.youtube_channel_id || 'UCIMBMaomkNyX5uJjO9VVN1A'}`;
      const message = `Check out my YouTube channel: ${channelStats?.title || 'My Channel'}\n${channelUrl}`;
      
      await Share.share({
        message,
        url: channelUrl,
        title: channelStats?.title || 'My YouTube Channel',
      });
    } catch (error) {
      console.error('Error sharing channel:', error);
    }
  };

  const handleAuthComplete = () => {
    setShowAuth(false);
    if (!profile?.youtube_api_key) {
      setShowSetup(true);
    }
  };

  const handleSetupComplete = () => {
    setShowSetup(false);
    refetch();
  };
  const featuredVideos = videos.slice(0, 3).map(video => ({
    id: video.id,
    title: video.title,
    thumbnail: video.thumbnails.medium?.url || video.thumbnails.default.url,
    views: youtubeApi.formatNumber(video.viewCount),
    duration: video.duration,
    uploadDate: new Date(video.publishedAt).toLocaleDateString(),
  }));

  const quickStats = [
    {
      icon: Users,
      label: 'Subscribers',
      value: channelStats ? youtubeApi.formatNumber(channelStats.subscriberCount) : '1.5K',
      change: '+12.5%',
      color: colors.primary,
    },
    {
      icon: Eye,
      label: 'Total Views',
      value: channelStats ? youtubeApi.formatNumber(channelStats.viewCount) : '25K',
      change: '+18.2%',
      color: colors.secondary,
    },
    {
      icon: Play,
      label: 'Videos',
      value: channelStats ? channelStats.videoCount : '45',
      change: '+8.1%',
      color: colors.accent,
    },
  ];

  if (loading && !channelStats) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <FunkyBackground />
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading your channel data...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FunkyBackground />
      
      {/* Header with Theme Toggle */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Dashboard</Text>
          {user && (
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              Welcome back, {user.email?.split('@')[0]}
            </Text>
          )}
        </View>
        <View style={styles.headerActions}>
          {!user ? (
            <TouchableOpacity
              style={[styles.authButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowAuth(true)}>
              <LogIn size={16} color="#fff" />
              <Text style={styles.authButtonText}>Sign In</Text>
            </TouchableOpacity>
          ) : !profile?.youtube_api_key ? (
            <TouchableOpacity
              style={[styles.setupButton, { backgroundColor: colors.secondary }]}
              onPress={() => setShowSetup(true)}>
              <Settings size={16} color="#fff" />
              <Text style={styles.setupButtonText}>Setup</Text>
            </TouchableOpacity>
          ) : null}
          <ThemeToggle />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        onScroll={(event) => {
          scrollY.value = event.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}>
        
        {/* Hero Section */}
        <Animated.View style={[headerAnimatedStyle]}>
          <LinearGradient
            colors={colors.gradient1}
            style={styles.heroSection}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}>
            <Animated.View style={[styles.heroContent, animatedStyle]}>
              {/* Channel Avatar */}
              <View style={styles.avatarContainer}>
                <Image
                  source={{ 
                    uri: channelStats?.thumbnails?.high?.url || 
                         'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=300' 
                  }}
                  style={styles.avatar}
                />
                <View style={[styles.verifiedBadge, { backgroundColor: colors.success }]}>
                  <Text style={styles.verifiedText}>✓</Text>
                </View>
              </View>

              {/* Channel Info */}
              <Text style={styles.channelName}>
                {channelStats?.title || 'Your YouTube Channel'}
              </Text>
              <Text style={styles.channelHandle}>@YourAwesomeChannel</Text>

              {/* Main Subscriber Count */}
              <View style={styles.subscriberContainer}>
                <Users size={24} color="#fff" />
                <Text style={styles.subscriberCount}>
                  {channelStats ? youtubeApi.formatNumber(channelStats.subscriberCount) : '1.5K'}
                </Text>
                <Text style={styles.subscriberLabel}>Subscribers</Text>
              </View>
            </Animated.View>
          </LinearGradient>
        </Animated.View>

        {/* AI Insights Section */}
        {user && profile?.youtube_api_key && (
          <View style={styles.aiSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.aiSectionTitle}>
                <Brain size={24} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.text, marginLeft: 8 }]}>
                  AI Insights
                </Text>
              </View>
            </View>
            <AIInsightsCard insights={aiInsights} />
          </View>
        )}

        {/* Quick Stats Cards */}
        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Stats</Text>
          <View style={styles.statsGrid}>
            {quickStats.map((stat, index) => (
              <View key={index} style={[styles.statCard, { backgroundColor: colors.card }]}>
                <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                  <stat.icon size={24} color={stat.color} />
                </View>
                <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
                <View style={styles.statChange}>
                  <TrendingUp size={12} color={colors.success} />
                  <Text style={[styles.changeText, { color: colors.success }]}>{stat.change}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primary }]}>
              <Play size={20} color="#fff" />
              <Text style={styles.actionText}>Latest Video</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.secondary }]}>
              <ShareIcon size={20} color="#fff" />
              <Text style={styles.actionText}>Share Channel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.secondary }]}
              onPress={handleShareChannel}>
              <ShareIcon size={20} color="#fff" />
              <Text style={styles.actionText}>Share Channel</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Featured Videos Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Videos</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {featuredVideos.map((video, index) => (
            <FeaturedVideoCard
              key={video.id}
              video={video}
              index={index}
            />
          ))}
        </View>

        {/* Channel Highlights */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>🚀 Channel Highlights</Text>
          <View style={styles.highlightsGrid}>
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              style={styles.highlightCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}>
              <Text style={styles.highlightNumber}>
                {channelStats ? youtubeApi.formatNumber(channelStats.viewCount) : '25K'}+
              </Text>
              <Text style={styles.highlightLabel}>Total Views</Text>
            </LinearGradient>
            
            <LinearGradient
              colors={[colors.secondary, colors.accent]}
              style={styles.highlightCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}>
              <Text style={styles.highlightNumber}>
                {channelStats ? youtubeApi.formatNumber(channelStats.subscriberCount) : '1.5K'}+
              </Text>
              <Text style={styles.highlightLabel}>Subscribers</Text>
            </LinearGradient>
            
            <LinearGradient
              colors={[colors.accent, colors.success]}
              style={styles.highlightCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}>
              <Text style={styles.highlightNumber}>
                {channelStats ? channelStats.videoCount : '45'}+
              </Text>
              <Text style={styles.highlightLabel}>Videos</Text>
            </LinearGradient>
            
            <LinearGradient
              colors={[colors.success, colors.primary]}
              style={styles.highlightCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}>
              <Text style={styles.highlightNumber}>2+</Text>
              <Text style={styles.highlightLabel}>Years Creating</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
          <View style={[styles.activityCard, { backgroundColor: colors.card }]}>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: `${colors.success}20` }]}>
                <TrendingUp size={16} color={colors.success} />
              </View>
              <View style={styles.activityContent}>
                <Text style={[styles.activityTitle, { color: colors.text }]}>Channel Growth</Text>
                <Text style={[styles.activityDescription, { color: colors.textSecondary }]}>
                  +{channelStats ? Math.floor(parseInt(channelStats.subscriberCount) * 0.1) : '150'} new subscribers this month
                </Text>
              </View>
              <Text style={[styles.activityTime, { color: colors.textSecondary }]}>2h ago</Text>
            </View>
            
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: `${colors.primary}20` }]}>
                <Play size={16} color={colors.primary} />
              </View>
              <View style={styles.activityContent}>
                <Text style={[styles.activityTitle, { color: colors.text }]}>New Video Published</Text>
                <Text style={[styles.activityDescription, { color: colors.textSecondary }]}>
                  Latest video is performing well
                </Text>
              </View>
              <Text style={[styles.activityTime, { color: colors.textSecondary }]}>1d ago</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Auth Modal */}
      <Modal
        visible={showAuth}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAuth(false)}>
        <AuthScreen onClose={handleAuthComplete} />
      </Modal>

      {/* Setup Modal */}
      <Modal
        visible={showSetup}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setShowSetup(false)}>
        <ChannelSetup onComplete={handleSetupComplete} />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Orbitron-Bold',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: 'FiraCode-Regular',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 12,
  },
  authButtonText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'SpaceGrotesk-SemiBold',
    marginLeft: 4,
  },
  setupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 12,
  },
  setupButtonText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'SpaceGrotesk-SemiBold',
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Medium',
  },
  heroSection: {
    height: height * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 24,
  },
  heroContent: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  verifiedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  channelName: {
    fontSize: 26,
    fontWeight: 'bold',
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1.2,
  },
  channelHandle: {
    fontSize: 16,
    fontFamily: 'FiraCode-Regular',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  subscriberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    backdropFilter: 'blur(10px)',
  },
  subscriberCount: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Orbitron-Black',
    fontWeight: 'bold',
    marginLeft: 8,
    marginRight: 8,
    letterSpacing: 1,
  },
  subscriberLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Medium',
  },
  statsSection: {
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Orbitron-Bold',
    fontWeight: 'bold',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  aiSection: {
    paddingVertical: 20,
  },
  aiSectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Orbitron-Black',
    fontWeight: 'bold',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'SpaceGrotesk-Medium',
    marginBottom: 8,
  },
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 12,
    fontFamily: 'FiraCode-Medium',
    marginLeft: 4,
    fontWeight: '600',
  },
  actionsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontWeight: '600',
    color: '#fff',
  },
  sectionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontWeight: '600',
  },
  highlightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  highlightCard: {
    width: (width - 50) / 2,
    padding: 20,
    borderRadius: 20,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  highlightNumber: {
    fontSize: 28,
    fontFamily: 'Orbitron-Black',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: 1,
  },
  highlightLabel: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-SemiBold',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  activityCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontWeight: '600',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Regular',
    lineHeight: 20,
  },
  activityTime: {
    fontSize: 12,
    fontFamily: 'FiraCode-Regular',
  },
});