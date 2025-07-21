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
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Search, Filter, Play, Eye, Calendar } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function VideosScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Tutorials', 'Reviews', 'Live Streams', 'Shorts'];

  const videos = [
    {
      id: 1,
      title: 'My Ultimate Tech Setup Tour 2024',
      thumbnail: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=400',
      views: '2.3K',
      duration: '12:45',
      uploadDate: '3 days ago',
      category: 'Reviews',
    },
    {
      id: 2,
      title: 'Coding My Dream Project from Scratch',
      thumbnail: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400',
      views: '1.8K',
      duration: '18:30',
      uploadDate: '1 week ago',
      category: 'Tutorials',
    },
    {
      id: 3,
      title: 'Quick Tips: Productivity Hacks',
      thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400',
      views: '1.2K',
      duration: '8:15',
      uploadDate: '2 weeks ago',
      category: 'Shorts',
    },
    {
      id: 4,
      title: 'Live Stream: Building Something Cool',
      thumbnail: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=400',
      views: '950',
      duration: '1:45:30',
      uploadDate: '2 weeks ago',
      category: 'Live Streams',
    },
    {
      id: 5,
      title: 'Tech Review: Game Changer Device',
      thumbnail: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=400',
      views: '1.5K',
      duration: '15:20',
      uploadDate: '1 month ago',
      category: 'Reviews',
    },
    {
      id: 6,
      title: 'Behind the Scenes: My Creative Process',
      thumbnail: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=400',
      views: '800',
      duration: '10:45',
      uploadDate: '1 month ago',
      category: 'Tutorials',
    },
  ];

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderVideoItem = ({ item, index }) => (
    <TouchableOpacity style={styles.videoItem}>
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
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 50,
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
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 10,
    fontFamily: 'SpaceGrotesk-Medium',
    color: '#666',
    fontWeight: '500',
  },
});