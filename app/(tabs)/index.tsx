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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { Play, Users, Eye, ThumbsUp, Share } from 'lucide-react-native';
import FunkyBackground from '@/components/FunkyBackground';
import FeaturedVideoCard from '@/components/FeaturedVideoCard';
import { useYouTubeData } from '@/hooks/useYouTubeData';
import { youtubeApi } from '@/services/youtubeApi';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const [refreshing, setRefreshing] = React.useState(false);
  const { channelStats, videos, loading, error, refetch } = useYouTubeData();
  const fadeAnim = useSharedValue(0);
  const scaleAnim = useSharedValue(0.9);

  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 1000 });
    scaleAnim.value = withTiming(1, { duration: 800 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ scale: scaleAnim.value }],
    };
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, [refetch]);

  // Get featured videos (latest 3 videos)
  const featuredVideos = videos.slice(0, 3).map(video => ({
    id: video.id,
    title: video.title,
    thumbnail: video.thumbnails.medium?.url || video.thumbnails.default.url,
    views: youtubeApi.formatNumber(video.viewCount),
    duration: video.duration,
    uploadDate: new Date(video.publishedAt).toLocaleDateString(),
  }));

  if (loading && !channelStats) {
    return (
      <View style={styles.loadingContainer}>
        <FunkyBackground />
        <ActivityIndicator size="large" color="#FF0000" />
        <Text style={styles.loadingText}>Loading your channel data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <FunkyBackground />
        <Text style={styles.errorText}>Unable to load channel data</Text>
        <Text style={styles.errorSubtext}>Using demo data for now</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <FunkyBackground />
      {/* Hero Section */}
      <LinearGradient
        colors={['#FF0000', '#CC0000', '#990000']}
        style={styles.heroSection}>
        <Animated.View style={[styles.heroContent, animatedStyle]}>
          {/* Channel Avatar */}
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=300' }}
              style={styles.avatar}
            />
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓</Text>
            </View>
          </View>

          {/* Channel Info */}
          <Text style={styles.channelName}>
            {channelStats?.title || 'UCIMBMaomkNyX5uJjO9VVN1A'}
          </Text>
          <Text style={styles.channelHandle}>@YourAwesomeChannel</Text>

          {/* Subscriber Count */}
          <View style={styles.subscriberContainer}>
            <Users size={20} color="#fff" />
            <Text style={styles.subscriberCount}>
              {channelStats ? youtubeApi.formatNumber(channelStats.subscriberCount) : '1.5K'} Subscribers
            </Text>
          </View>

          {/* Channel Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Eye size={16} color="#fff" />
              <Text style={styles.statText}>
                {channelStats ? youtubeApi.formatNumber(channelStats.viewCount) : '25K'} Views
              </Text>
            </View>
            <View style={styles.statItem}>
              <Play size={16} color="#fff" />
              <Text style={styles.statText}>
                {channelStats ? channelStats.videoCount : '45'} Videos
              </Text>
            </View>
            <View style={styles.statItem}>
              <ThumbsUp size={16} color="#fff" />
              <Text style={styles.statText}>98% Liked</Text>
            </View>
          </View>
        </Animated.View>
      </LinearGradient>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Play size={20} color="#FF0000" />
          <Text style={styles.actionText}>Latest Video</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Share size={20} color="#FF0000" />
          <Text style={styles.actionText}>Share Channel</Text>
        </TouchableOpacity>
      </View>

      {/* Featured Videos Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Featured Videos</Text>
        
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
        <Text style={styles.sectionTitle}>🚀 Channel Highlights</Text>
        <View style={styles.highlightsGrid}>
          <View style={styles.highlightCard}>
            <Text style={styles.highlightNumber}>
              {channelStats ? youtubeApi.formatNumber(channelStats.viewCount) : '25K'}+
            </Text>
            <Text style={styles.highlightLabel}>Total Views</Text>
          </View>
          <View style={styles.highlightCard}>
            <Text style={styles.highlightNumber}>
              {channelStats ? youtubeApi.formatNumber(channelStats.subscriberCount) : '1.5K'}+
            </Text>
            <Text style={styles.highlightLabel}>Subscribers</Text>
          </View>
          <View style={styles.highlightCard}>
            <Text style={styles.highlightNumber}>
              {channelStats ? channelStats.videoCount : '45'}+
            </Text>
            <Text style={styles.highlightLabel}>Videos</Text>
          </View>
          <View style={styles.highlightCard}>
            <Text style={styles.highlightNumber}>2+</Text>
            <Text style={styles.highlightLabel}>Years Creating</Text>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'SpaceGrotesk-SemiBold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorSubtext: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Regular',
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FF0000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-SemiBold',
  },
  heroSection: {
    height: height * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heroContent: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
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
    backgroundColor: '#1DA1F2',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  verifiedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  channelName: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
    letterSpacing: 1,
  },
  channelHandle: {
    fontSize: 16,
    fontFamily: 'FiraCode-Regular',
    color: '#ffcccc',
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  subscriberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  subscriberCount: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontWeight: '600',
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Medium',
    marginLeft: 5,
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontWeight: '600',
    color: '#333',
  },
  sectionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Orbitron-Bold',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  videoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbnailContainer: {
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  duration: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});