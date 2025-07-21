import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { X } from 'lucide-react-native';
import * as WebBrowser from 'expo-web-browser';

const { width, height } = Dimensions.get('window');

interface VideoPlayerProps {
  videoId: string;
  visible: boolean;
  onClose: () => void;
}

export default function VideoPlayer({ videoId, visible, onClose }: VideoPlayerProps) {
  const handlePlayVideo = () => {
    // Open YouTube video in browser for better compatibility
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    WebBrowser.openBrowserAsync(youtubeUrl);
    onClose();
  };

  React.useEffect(() => {
    if (visible && videoId) {
      handlePlayVideo();
    }
  }, [visible, videoId]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#333" />
          </TouchableOpacity>
        </View>
        
        <WebView
          source={{ uri: `https://www.youtube.com/embed/${videoId}?autoplay=1` }}
          style={styles.webview}
          allowsFullscreenVideo
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled
          domStorageEnabled
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#000',
  },
  closeButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 8,
  },
  webview: {
    flex: 1,
  },
});