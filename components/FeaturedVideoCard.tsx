import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Play } from 'lucide-react-native';

interface FeaturedVideoCardProps {
  video: {
    id: string;
    title: string;
    thumbnail: string;
    views: string;
    duration: string;
    uploadDate: string;
  };
  index: number;
}

export default function FeaturedVideoCard({ video, index }: FeaturedVideoCardProps) {
  const translateY = useSharedValue(50);

  useEffect(() => {
    translateY.value = withTiming(0, {
      duration: 600 + index * 200,
    });
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <Animated.View style={[styles.videoCard, animatedStyle]}>
      <TouchableOpacity>
        <View style={styles.thumbnailContainer}>
          <Image source={{ uri: video.thumbnail }} style={styles.thumbnail} />
          <BlurView intensity={20} style={styles.durationBadge}>
            <Text style={styles.duration}>{video.duration}</Text>
          </BlurView>
          <View style={styles.playOverlay}>
            <Play size={30} color="#fff" fill="#fff" />
          </View>
        </View>
        
        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle} numberOfLines={2}>
            {video.title}
          </Text>
          <View style={styles.videoMeta}>
            <Text style={styles.views}>{video.views} views</Text>
            <Text style={styles.uploadDate}>• {video.uploadDate}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
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
  playOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -15 }, { translateY: -15 }],
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoInfo: {
    padding: 15,
  },
  videoTitle: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    lineHeight: 22,
  },
  videoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  views: {
    fontSize: 14,
    fontFamily: 'FiraCode-Regular',
    color: '#666',
  },
  uploadDate: {
    fontSize: 14,
    fontFamily: 'FiraCode-Regular',
    color: '#666',
    marginLeft: 5,
  },
});