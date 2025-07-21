import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Globe, Mail, MessageCircle, Instagram, Twitter, Linkedin, MapPin, Calendar, Award, Users, CirclePlay as PlayCircle } from 'lucide-react-native';
import { useYouTubeData } from '@/hooks/useYouTubeData';
import { youtubeApi } from '@/services/youtubeApi';

export default function AboutScreen() {
  const { channelStats, videos, loading, error } = useYouTubeData();

  const socialLinks = [
    { icon: Globe, label: 'Website', url: 'https://yourwebsite.com', color: '#4F46E5' },
    { icon: Mail, label: 'Email', url: 'mailto:contact@youremail.com', color: '#DC2626' },
    { icon: Instagram, label: 'Instagram', url: 'https://instagram.com/yourusername', color: '#E1306C' },
    { icon: Twitter, label: 'Twitter', url: 'https://twitter.com/yourusername', color: '#1DA1F2' },
    { icon: Linkedin, label: 'LinkedIn', url: 'https://linkedin.com/in/yourusername', color: '#0077B5' },
  ];

  const milestones = [
    { year: '2022', title: 'Channel Started', description: 'Began my journey creating content' },
    { year: '2023', title: 'First Milestone', description: 'Reached my first subscriber milestone' },
    { year: '2024', title: `${channelStats ? youtubeApi.formatNumber(channelStats.subscriberCount) : '1.5K'} Subscribers`, description: 'Growing community of enthusiasts' },
    { year: '2024', title: `${channelStats ? youtubeApi.formatNumber(channelStats.viewCount) : '25K'} Views`, description: 'Total views milestone achieved' },
  ];

  const achievements = [
    { icon: Award, title: 'Creator Award', description: 'YouTube Silver Play Button' },
    { icon: Users, title: 'Community', description: `${channelStats ? youtubeApi.formatNumber(channelStats.subscriberCount) : '1.5K'}+ Subscribers` },
    { icon: PlayCircle, title: 'Content', description: `${channelStats ? channelStats.videoCount : '45'}+ Videos Created` },
  ];

  const handleSocialLink = (url) => {
    Linking.openURL(url);
  };

  // Get channel thumbnail from API data
  const channelThumbnail = channelStats?.thumbnails?.high?.url || 
    channelStats?.thumbnails?.medium?.url || 
    'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=300';

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF0000" />
        <Text style={styles.loadingText}>Loading channel information...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <LinearGradient
        colors={['#FF0000', '#CC0000']}
        style={styles.profileHeader}>
        <Image
          source={{ uri: channelThumbnail }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{channelStats?.title || 'Your Channel Name'}</Text>
        <Text style={styles.title}>Content Creator</Text>
        <View style={styles.locationContainer}>
          <MapPin size={16} color="#ffcccc" />
          <Text style={styles.location}>Your Location</Text>
        </View>
      </LinearGradient>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>
          {channelStats?.description || 
          `Welcome to my YouTube channel! I'm passionate about creating content and love sharing my discoveries with the community. 
          Here you'll find engaging videos, tutorials, and insights about various topics.`}
          {'\n\n'}
          I'm constantly exploring new ideas and sharing my journey with fellow content enthusiasts. 
          For collaborations, tech discussions, or just to say hello, feel free to reach out!
        </Text>
      </View>

      {/* Social Links */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connect With Me</Text>
        <View style={styles.socialContainer}>
          {socialLinks.map((social, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.socialButton, { borderColor: social.color }]}
              onPress={() => handleSocialLink(social.url)}>
              <social.icon size={24} color={social.color} />
              <Text style={[styles.socialLabel, { color: social.color }]}>
                {social.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.achievementsContainer}>
          {achievements.map((achievement, index) => (
            <View key={index} style={styles.achievementCard}>
              <View style={styles.achievementIcon}>
                <achievement.icon size={24} color="#FF0000" />
              </View>
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
              <Text style={styles.achievementDescription}>{achievement.description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Channel Journey */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Channel Journey</Text>
        <View style={styles.timelineContainer}>
          {milestones.map((milestone, index) => (
            <View key={index} style={styles.timelineItem}>
              <View style={styles.timelineYear}>
                <Text style={styles.yearText}>{milestone.year}</Text>
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.milestoneTitle}>{milestone.title}</Text>
                <Text style={styles.milestoneDescription}>{milestone.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Channel Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Channel Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{channelStats ? youtubeApi.formatNumber(channelStats.subscriberCount) : '1.5K'}+</Text>
            <Text style={styles.statLabel}>Subscribers</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{channelStats ? youtubeApi.formatNumber(channelStats.viewCount) : '25K'}+</Text>
            <Text style={styles.statLabel}>Views</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{channelStats ? channelStats.videoCount : '45'}+</Text>
            <Text style={styles.statLabel}>Videos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>2+</Text>
            <Text style={styles.statLabel}>Years</Text>
          </View>
        </View>
      </View>

      {/* Contact */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Get In Touch</Text>
        <View style={styles.contactContainer}>
          <Text style={styles.contactText}>
            For business inquiries, collaborations, or just to say hello, feel free to reach out!
          </Text>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => handleSocialLink('mailto:contact@youremail.com')}>
            <Mail size={20} color="#fff" />
            <Text style={styles.contactButtonText}>Send Email</Text>
          </TouchableOpacity>
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
  profileHeader: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Orbitron-Bold',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    letterSpacing: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Medium',
    color: '#ffcccc',
    marginBottom: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    fontFamily: 'FiraCode-Regular',
    color: '#ffcccc',
    marginLeft: 5,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Orbitron-Bold',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  aboutText: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Regular',
    lineHeight: 24,
    color: '#666',
  },
  socialContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    marginBottom: 10,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  socialLabel: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontWeight: '600',
  },
  achievementsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  achievementCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementIcon: {
    backgroundColor: '#fff0f0',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  achievementTitle: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  achievementDescription: {
    fontSize: 12,
    fontFamily: 'SpaceGrotesk-Regular',
    color: '#666',
    textAlign: 'center',
  },
  timelineContainer: {
    paddingLeft: 10,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineYear: {
    backgroundColor: '#FF0000',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 15,
    alignSelf: 'flex-start',
  },
  yearText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Orbitron-Bold',
    fontWeight: 'bold',
  },
  timelineContent: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  milestoneDescription: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Regular',
    color: '#666',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: '48%',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Orbitron-Black',
    fontWeight: 'bold',
    color: '#FF0000',
    marginBottom: 5,
    letterSpacing: 1,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Medium',
    color: '#666',
  },
  contactContainer: {
    alignItems: 'center',
  },
  contactText: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Regular',
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF0000',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontWeight: '600',
    marginLeft: 8,
  },
});