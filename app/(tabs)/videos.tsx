import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Search, Filter, Play, Eye, Calendar, TrendingUp, Grid2x2 as Grid, List } from 'lucide-react-native';
import VideoPlayer from '@/components/VideoPlayer';
import ThemeToggle from '@/components/ThemeToggle';
import { useYouTubeData } from '@/hooks/useYouTubeData';
import { youtubeApi } from '@/services/youtubeApi';
import { useTheme } from '@/contexts/ThemeContext';

const { width } = Dimensions.get('window');

export default function VideosScreen() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showPlayer, setShowPlayer] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { videos, loading, error } = useYouTubeData();

  const categories = ['All', 'Tutorials', 'Reviews', 'Live Streams', 'Shorts'];

  const transformedVideos = videos.map(video => ({
    id: video.id,
    title: video.title,
    thumbnail: video.thumbnails.medium?.url || video.thumbnails.default.url,
    views: youtubeApi.formatNumber(video.viewCount),
    duration: video.duration,
    uploadDate: new Date(video.publishedAt).toLocaleDateString(),
    category: 'All',
  }));

  const filteredVideos = transformedVideos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePlayVideo = (videoId: string) => {
    setSelectedVideoId(videoId);
    setShowPlayer(true);
  };

  const renderVideoItem = ({ item, index }) => {
    if (viewMode === 'list') {
      return (
        <TouchableOpacity 
          style={[styles.listVideoItem, { backgroundColor: colors.card }]}
          onPress={() => handlePlayVideo(item.id)}>
          <Image source={{ uri: item.thumbnail }} style={styles.listThumbnail} />
          <View style={styles.listVideoInfo}>
            <Text style={[styles.listVideoTitle, { color: colors.text }]} numberOfLines={2}>
              {item.title}
            </Text>
            <View style={styles.listVideoMeta}>
              <View style={styles.metaItem}>
                <Eye size={14} color={colors.textSecondary} />
                <Text style={[styles.metaText, { color: colors.textSecondary }]}>{item.views} views</Text>
              </View>
              <View style={styles.metaItem}>
                <Calendar size={14} color={colors.textSecondary} />
                <Text style={[styles.metaText, { color: colors.textSecondary }]}>{item.uploadDate}</Text>
              </View>
            </View>
          </View>
          <View style={styles.listPlayButton}>
            <Play size={20} color={colors.primary} />
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity 
        style={[styles.videoItem, { backgroundColor: colors.card }]}
        onPress={() => handlePlayVideo(item.id)}>
        <View style={styles.thumbnailContainer}>
          <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
          <BlurView intensity={20} style={styles.durationBadge}>
            <Text style={styles.duration}>{item.duration}</Text>
          </BlurView>
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.playOverlay}>
            <Play size={24} color="#fff" fill="#fff" />
          </LinearGradient>
        </View>
        
        <View style={styles.videoInfo}>
          <Text style={[styles.videoTitle, { color: colors.text }]} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.videoMeta}>
            <View style={styles.metaItem}>
              <Eye size={14} color={colors.textSecondary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>{item.views} views</Text>
            </View>
            <View style={styles.metaItem}>
              <Calendar size={14} color={colors.textSecondary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>{item.uploadDate}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading your videos...</Text>
      </View>
    );
  }

  return (
    <>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.surface }]}>
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>All Videos</Text>
            <Text style={[styles.videoCount, { color: colors.textSecondary }]}>
              {filteredVideos.length} videos
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={[styles.viewModeButton, { backgroundColor: colors.card }]}
              onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
              {viewMode === 'grid' ? (
                <List size={20} color={colors.primary} />
              ) : (
                <Grid size={20} color={colors.primary} />
              )}
            </TouchableOpacity>
            <ThemeToggle />
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: colors.card }]}>
            <Search size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search videos..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.primary }]}>
            <Filter size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
          contentContainerStyle={styles.categoryContent}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                { backgroundColor: colors.card, borderColor: colors.border },
                selectedCategory === category && { 
                  backgroundColor: colors.primary,
                  borderColor: colors.primary 
                },
              ]}
              onPress={() => setSelectedCategory(category)}>
              <Text
                style={[
                  styles.categoryChipText,
                  { color: colors.textSecondary },
                  selectedCategory === category && { color: '#fff' },
                ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Videos List */}
        <FlatList
          data={filteredVideos}
          renderItem={renderVideoItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={viewMode === 'grid' ? 2 : 1}
          key={viewMode}
          columnWrapperStyle={viewMode === 'grid' ? styles.row : null}
          contentContainerStyle={styles.videosList}
          showsVerticalScrollIndicator={false}
        />
      </View>
      
      <VideoPlayer
        videoId={selectedVideoId}
        visible={showPlayer}
        onClose={() => setShowPlayer(false)}
      />
    </>
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
  videoCount: {
    fontSize: 14,
    fontFamily: 'FiraCode-Regular',
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewModeButton: {
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Regular',
  },
  filterButton: {
    padding: 14,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryContent: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryChipText: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontWeight: '600',
  },
  videosList: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  videoItem: {
    width: (width - 40) / 2,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  listVideoItem: {
    flexDirection: 'row',
    borderRadius: 16,
    marginBottom: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  listThumbnail: {
    width: 120,
    height: 68,
    borderRadius: 12,
    marginRight: 12,
  },
  listVideoInfo: {
    flex: 1,
  },
  listVideoTitle: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 22,
  },
  listVideoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listPlayButton: {
    padding: 12,
    borderRadius: 20,
  },
  thumbnailContainer: {
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  duration: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'FiraCode-Medium',
  },
  playOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoInfo: {
    padding: 16,
  },
  videoTitle: {
    fontSize: 15,
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontWeight: '600',
    marginBottom: 10,
    lineHeight: 20,
  },
  videoMeta: {
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'FiraCode-Regular',
    marginLeft: 6,
  },
});