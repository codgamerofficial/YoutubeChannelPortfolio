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
import { BlurView } from 'expo-blur';
import { Search, Filter, Play, Eye, Calendar } from 'lucide-react-native';
import VideoPlayer from '@/components/VideoPlayer';
import { useYouTubeData } from '@/hooks/useYouTubeData';
import { youtubeApi } from '@/services/youtubeApi';

const { width } = Dimensions.get('window');

export default function VideosScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showPlayer, setShowPlayer] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState('');
  const { videos, loading, error } = useYouTubeData();

  const categories = ['All', 'Tutorials', 'Reviews', 'Live Streams', 'Shorts'];

  // Transform YouTube API data to match component expectations
  const transformedVideos = videos.map(video => ({
    id: video.id,
    title: video.title,
    thumbnail: video.thumbnails.medium?.url || video.thumbnails.default.url,
    views: youtubeApi.formatNumber(video.viewCount),
    duration: video.duration,
    uploadDate: new Date(video.publishedAt).toLocaleDateString(),
    category: 'All', // You can implement category detection based on title/description
  }));

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePlayVideo = (videoId: string) => {
    setSelectedVideoId(videoId);
    setShowPlayer(true);
  };
  const renderVideoItem = ({ item, index }) => (
    <TouchableOpacity 
      style={styles.videoItem}
      onPress={() => handlePlayVideo(item.id)}>
      <View style={styles.thumbnailContainer}>
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        <BlurView intensity={20} style={styles.durationBadge}>
          <Text style={styles.duration}>{item.duration}</Text>
        </BlurView>
        <View style={styles.playOverlay}>
          <Play size={24} color="#fff" fill="#fff" />
        </View>
      </View>
      
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.videoMeta}>
          <View style={styles.metaItem}>
            <Eye size={14} color="#666" />
            <Text style={styles.metaText}>{item.views} views</Text>
          </View>
          <View style={styles.metaItem}>
            <Calendar size={14} color="#666" />
            <Text style={styles.metaText}>{item.uploadDate}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF0000" />
        <Text style={styles.loadingText}>Loading your videos...</Text>
      </View>
    );
  }
  return (
    <>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>All Videos</Text>
          <Text style={styles.videoCount}>{filteredVideos.length} videos</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search videos..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#FF0000" />
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
                selectedCategory === category && styles.selectedCategoryChip,
              ]}
              onPress={() => setSelectedCategory(category)}>
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === category && styles.selectedCategoryChipText,
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
          numColumns={2}
          columnWrapperStyle={styles.row}
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
  videoCount: {
    fontSize: 16,
    fontFamily: 'FiraCode-Regular',
    color: '#666',
    marginTop: 5,
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
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Regular',
    color: '#333',
  },
  filterButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryContent: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedCategoryChip: {
    backgroundColor: '#FF0000',
    borderColor: '#FF0000',
  },
  categoryChipText: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontWeight: '600',
    color: '#666',
  },
  selectedCategoryChipText: {
    color: '#fff',
  },
  videosList: {
    paddingHorizontal: 15,
  },
  row: {
    justifyContent: 'space-between',
  },
  videoItem: {
    width: (width - 40) / 2,
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
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  duration: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  playOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoInfo: {
    padding: 12,
  },
  videoTitle: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    lineHeight: 18,
  },
  videoMeta: {
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'FiraCode-Light',
    color: '#666',
    marginLeft: 4,
  },
});