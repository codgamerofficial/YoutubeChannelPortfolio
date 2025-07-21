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
import VideoPlayer from './VideoPlayer';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { colors } = useTheme();
  const translateY = useSharedValue(50);
  const [showPlayer, setShowPlayer] = React.useState(false);

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

  const handlePlayVideo = () => {
    setShowPlayer(true);
  };
  return (
    <>
      <Animated.View style={[styles.videoCard, animatedStyle, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={handlePlayVideo}>
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
          <Text style={[styles.videoTitle, { color: colors.text }]} numberOfLines={2}>
            {video.title}
          </Text>
          <View style={styles.videoMeta}>
            <Text style={[styles.views, { color: colors.textSecondary }]}>{video.views} views</Text>
            <Text style={[styles.uploadDate, { color: colors.textSecondary }]}>• {video.uploadDate}</Text>
          </View>
        </View>
        </TouchableOpacity>
      </Animated.View>
      
      <VideoPlayer
        videoId={video.id}
        visible={showPlayer}
        onClose={() => setShowPlayer(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  videoCard: {
    borderRadius: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  thumbnailContainer: {
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
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
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  videoInfo: {
    padding: 20,
  },
  videoTitle: {
    fontSize: 17,
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 24,
  },
  videoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  views: {
    fontSize: 14,
    fontFamily: 'FiraCode-Regular',
  },
  uploadDate: {
    fontSize: 14,
    fontFamily: 'FiraCode-Regular',
    marginLeft: 5,
  },
});