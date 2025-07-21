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
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Globe, Mail, MessageCircle, Instagram, Twitter, Linkedin, MapPin, Calendar, Award, Users, CirclePlay as PlayCircle, Star, Heart } from 'lucide-react-native';
import ThemeToggle from '@/components/ThemeToggle';
import { useYouTubeData } from '@/hooks/useYouTubeData';
import { youtubeApi } from '@/services/youtubeApi';
import { useTheme } from '@/contexts/ThemeContext';

const { width } = Dimensions.get('window');

export default function AboutScreen() {
  const { colors } = useTheme();
  const { channelStats, videos, loading, error } = useYouTubeData();

  const socialLinks = [
    { icon: Globe, label: 'Website', url: 'https://yourwebsite.com', color: colors.primary },
    { icon: Mail, label: 'Email', url: 'mailto:contact@youremail.com', color: colors.secondary },
    { icon: Instagram, label: 'Instagram', url: 'https://instagram.com/yourusername', color: '#E1306C' },
    { icon: Twitter, label: 'Twitter', url: 'https://twitter.com/yourusername', color: '#1DA1F2' },
    { icon: Linkedin, label: 'LinkedIn', url: 'https://linkedin.com/in/yourusername', color: '#0077B5' },
  ];

  const milestones = [
    { 
      year: '2022', 
      title: 'Channel Started', 
      description: 'Began my journey creating content',
      icon: PlayCircle,
      color: colors.primary,
    },
    { 
      year: '2023', 
      title: 'First Milestone', 
      description: 'Reached my first subscriber milestone',
      icon: Users,
      color: colors.secondary,
    },
    { 
      year: '2024', 
      title: `${channelStats ? youtubeApi.formatNumber(channelStats.subscriberCount) : '1.5K'} Subscribers`, 
      description: 'Growing community of enthusiasts',
      icon: Heart,
      color: colors.accent,
    },
    { 
      year: '2024', 
      title: `${channelStats ? youtubeApi.formatNumber(channelStats.viewCount) : '25K'} Views`, 
      description: 'Total views milestone achieved',
      icon: Star,
      color: colors.success,
    },
  ];

  const achievements = [
    { 
      icon: Award, 
      title: 'Creator Award', 
      description: 'YouTube Recognition',
      color: colors.primary,
      gradient: colors.gradient1,
    },
    { 
      icon: Users, 
      title: 'Community', 
      description: `${channelStats ? youtubeApi.formatNumber(channelStats.subscriberCount) : '1.5K'}+ Subscribers`,
      color: colors.secondary,
      gradient: colors.gradient2,
    },
    { 
      icon: PlayCircle, 
      title: 'Content', 
      description: `${channelStats ? channelStats.videoCount : '45'}+ Videos Created`,
      color: colors.accent,
      gradient: colors.gradient3,
    },
  ];

  const handleSocialLink = (url) => {
    Linking.openURL(url);
  };

  const channelThumbnail = channelStats?.thumbnails?.high?.url || 
    channelStats?.thumbnails?.medium?.url || 
    'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=300';

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Loading channel information...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>About</Text>
        <ThemeToggle />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <LinearGradient
          colors={colors.gradient1}
          style={styles.profileHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: channelThumbnail }}
              style={styles.profileImage}
            />
            <View style={[styles.onlineBadge, { backgroundColor: colors.success }]}>
              <View style={styles.onlineDot} />
            </View>
          </View>
          
          <Text style={styles.name}>
            {channelStats?.title || 'Your Channel Name'}
          </Text>
          <Text style={styles.title}>Content Creator & Educator</Text>
          
          <View style={styles.locationContainer}>
            <MapPin size={16} color="rgba(255,255,255,0.8)" />
            <Text style={styles.location}>Your Location</Text>
          </View>

          <View style={styles.profileStats}>
            <View style={styles.profileStat}>
              <Text style={styles.profileStatNumber}>
                {channelStats ? youtubeApi.formatNumber(channelStats.subscriberCount) : '1.5K'}
              </Text>
              <Text style={styles.profileStatLabel}>Followers</Text>
            </View>
            <View style={styles.profileStat}>
              <Text style={styles.profileStatNumber}>
                {channelStats ? youtubeApi.formatNumber(channelStats.viewCount) : '25K'}
              </Text>
              <Text style={styles.profileStatLabel}>Views</Text>
            </View>
            <View style={styles.profileStat}>
              <Text style={styles.profileStatNumber}>
                {channelStats ? channelStats.videoCount : '45'}
              </Text>
              <Text style={styles.profileStatLabel}>Videos</Text>
            </View>
          </View>
        </LinearGradient>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About Me</Text>
          <View style={[styles.aboutCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.aboutText, { color: colors.textSecondary }]}>
              {channelStats?.description || 
              `Welcome to my YouTube channel! I'm passionate about creating content and love sharing my discoveries with the community. 
              Here you'll find engaging videos, tutorials, and insights about various topics.`}
              {'\n\n'}
              I'm constantly exploring new ideas and sharing my journey with fellow content enthusiasts. 
              For collaborations, tech discussions, or just to say hello, feel free to reach out!
            </Text>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Achievements</Text>
          <View style={styles.achievementsContainer}>
            {achievements.map((achievement, index) => (
              <LinearGradient
                key={index}
                colors={achievement.gradient}
                style={styles.achievementCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}>
                <View style={styles.achievementIcon}>
                  <achievement.icon size={28} color="#fff" />
                </View>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>{achievement.description}</Text>
              </LinearGradient>
            ))}
          </View>
        </View>

        {/* Social Links */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Connect With Me</Text>
          <View style={styles.socialContainer}>
            {socialLinks.map((social, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.socialButton, { backgroundColor: colors.card, borderColor: social.color }]}
                onPress={() => handleSocialLink(social.url)}>
                <View style={[styles.socialIcon, { backgroundColor: `${social.color}20` }]}>
                  <social.icon size={20} color={social.color} />
                </View>
                <Text style={[styles.socialLabel, { color: colors.text }]}>
                  {social.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Channel Journey */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>My Journey</Text>
          <View style={styles.timelineContainer}>
            {milestones.map((milestone, index) => (
              <View key={index} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <LinearGradient
                    colors={[milestone.color, `${milestone.color}80`]}
                    style={styles.timelineIcon}>
                    <milestone.icon size={20} color="#fff" />
                  </LinearGradient>
                  {index < milestones.length - 1 && (
                    <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />
                  )}
                </View>
                
                <View style={[styles.timelineContent, { backgroundColor: colors.card }]}>
                  <View style={styles.timelineHeader}>
                    <Text style={[styles.milestoneTitle, { color: colors.text }]}>
                      {milestone.title}
                    </Text>
                    <Text style={[styles.timelineYear, { color: colors.textSecondary }]}>
                      {milestone.year}
                    </Text>
                  </View>
                  <Text style={[styles.milestoneDescription, { color: colors.textSecondary }]}>
                    {milestone.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Get In Touch</Text>
          <LinearGradient
            colors={colors.gradient2}
            style={styles.contactContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}>
            <Text style={styles.contactText}>
              Ready to collaborate or just want to say hello? I'd love to hear from you!
            </Text>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => handleSocialLink('mailto:contact@youremail.com')}>
              <Mail size={20} color={colors.primary} />
              <Text style={[styles.contactButtonText, { color: colors.primary }]}>
                Send Message
              </Text>
            </TouchableOpacity>
          </LinearGradient>
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
  profileHeader: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 24,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 26,
    fontFamily: 'Orbitron-Bold',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: 1,
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Medium',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  location: {
    fontSize: 14,
    fontFamily: 'FiraCode-Regular',
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 6,
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  profileStat: {
    alignItems: 'center',
  },
  profileStatNumber: {
    fontSize: 20,
    fontFamily: 'Orbitron-Black',
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  profileStatLabel: {
    fontSize: 12,
    fontFamily: 'SpaceGrotesk-Medium',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Orbitron-Bold',
    fontWeight: 'bold',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  aboutCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  aboutText: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Regular',
    lineHeight: 24,
  },
  achievementsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  achievementCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  achievementIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 6,
  },
  achievementDescription: {
    fontSize: 12,
    fontFamily: 'SpaceGrotesk-Regular',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 16,
  },
  socialContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  socialIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  socialLabel: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontWeight: '600',
  },
  timelineContainer: {
    paddingLeft: 10,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 8,
  },
  timelineContent: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  milestoneTitle: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontWeight: 'bold',
    flex: 1,
  },
  timelineYear: {
    fontSize: 12,
    fontFamily: 'FiraCode-Medium',
    fontWeight: '600',
  },
  milestoneDescription: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Regular',
    lineHeight: 20,
  },
  contactContainer: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  contactText: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Regular',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  contactButtonText: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontWeight: '600',
    marginLeft: 8,
  },
});