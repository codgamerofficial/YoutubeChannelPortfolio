import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Youtube, Key, Search, CheckCircle } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { youtubeApi } from '@/services/youtubeApi';

interface ChannelSetupProps {
  onComplete: () => void;
}

export default function ChannelSetup({ onComplete }: ChannelSetupProps) {
  const { colors } = useTheme();
  const { updateProfile } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [channelHandle, setChannelHandle] = useState('');
  const [channelId, setChannelId] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleSearchChannel = async () => {
    if (!channelHandle.trim()) {
      Alert.alert('Error', 'Please enter a channel handle or name');
      return;
    }

    setLoading(true);
    try {
      const foundChannelId = await youtubeApi.searchChannelByHandle(channelHandle);
      if (foundChannelId) {
        setChannelId(foundChannelId);
        setStep(3);
      } else {
        Alert.alert('Channel Not Found', 'Could not find a channel with that handle. Please try a different search term.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to search for channel');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSetup = async () => {
    if (!apiKey.trim() || !channelId.trim()) {
      Alert.alert('Error', 'Please complete all steps');
      return;
    }

    setLoading(true);
    try {
      await updateProfile({
        youtube_api_key: apiKey,
        youtube_channel_id: channelId,
      });
      
      // Set the credentials in the YouTube API service
      youtubeApi.setCustomCredentials(apiKey, channelId);
      
      Alert.alert('Success', 'Channel setup completed!', [
        { text: 'OK', onPress: onComplete }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save setup');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        Step 1: YouTube API Key
      </Text>
      <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>
        To analyze your channel, we need your YouTube API key. This allows us to fetch your channel data securely.
      </Text>
      
      <View style={[styles.inputContainer, { backgroundColor: colors.card }]}>
        <Key size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Enter your YouTube API key"
          placeholderTextColor={colors.textSecondary}
          value={apiKey}
          onChangeText={setApiKey}
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={[styles.helpButton, { backgroundColor: colors.surface }]}
        onPress={() => Alert.alert(
          'How to get API Key',
          '1. Go to Google Cloud Console\n2. Create a new project\n3. Enable YouTube Data API v3\n4. Create credentials (API Key)\n5. Copy the key here'
        )}>
        <Text style={[styles.helpText, { color: colors.primary }]}>
          How to get API Key?
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.nextButton, { backgroundColor: colors.primary }]}
        onPress={() => setStep(2)}
        disabled={!apiKey.trim()}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        Step 2: Find Your Channel
      </Text>
      <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>
        Enter your channel handle or name to find your channel ID.
      </Text>
      
      <View style={[styles.inputContainer, { backgroundColor: colors.card }]}>
        <Youtube size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="@yourchannel or Channel Name"
          placeholderTextColor={colors.textSecondary}
          value={channelHandle}
          onChangeText={setChannelHandle}
        />
      </View>

      <TouchableOpacity
        style={[styles.searchButton, { backgroundColor: colors.secondary }]}
        onPress={handleSearchChannel}
        disabled={loading || !channelHandle.trim()}>
        <Search size={20} color="#fff" />
        <Text style={styles.searchButtonText}>
          {loading ? 'Searching...' : 'Find Channel'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setStep(1)}>
        <Text style={[styles.backButtonText, { color: colors.textSecondary }]}>
          Back
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <CheckCircle size={60} color={colors.success} style={styles.successIcon} />
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        Setup Complete!
      </Text>
      <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>
        We found your channel and everything is ready. You can now analyze your YouTube channel with AI-powered insights.
      </Text>
      
      <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.summaryTitle, { color: colors.text }]}>Setup Summary:</Text>
        <Text style={[styles.summaryItem, { color: colors.textSecondary }]}>
          ✓ API Key configured
        </Text>
        <Text style={[styles.summaryItem, { color: colors.textSecondary }]}>
          ✓ Channel found: {channelHandle}
        </Text>
        <Text style={[styles.summaryItem, { color: colors.textSecondary }]}>
          ✓ Ready for analysis
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.completeButton, { backgroundColor: colors.success }]}
        onPress={handleSaveSetup}
        disabled={loading}>
        <Text style={styles.completeButtonText}>
          {loading ? 'Saving...' : 'Complete Setup'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setStep(2)}>
        <Text style={[styles.backButtonText, { color: colors.textSecondary }]}>
          Back
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={colors.gradient1}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <Youtube size={40} color="#fff" />
        <Text style={styles.headerTitle}>Channel Setup</Text>
        <Text style={styles.headerSubtitle}>
          Connect your YouTube channel for personalized analytics
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.progressContainer}>
          {[1, 2, 3].map((stepNumber) => (
            <View key={stepNumber} style={styles.progressStep}>
              <View
                style={[
                  styles.progressDot,
                  {
                    backgroundColor: step >= stepNumber ? colors.primary : colors.border,
                  },
                ]}>
                <Text
                  style={[
                    styles.progressNumber,
                    { color: step >= stepNumber ? '#fff' : colors.textSecondary },
                  ]}>
                  {stepNumber}
                </Text>
              </View>
              {stepNumber < 3 && (
                <View
                  style={[
                    styles.progressLine,
                    {
                      backgroundColor: step > stepNumber ? colors.primary : colors.border,
                    },
                  ]}
                />
              )}
            </View>
          ))}
        </View>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Regular',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressNumber: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontWeight: '600',
  },
  progressLine: {
    width: 40,
    height: 2,
    marginHorizontal: 8,
  },
  stepContent: {
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 22,
    fontFamily: 'Orbitron-Bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Regular',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Regular',
  },
  helpButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 30,
  },
  helpText: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontWeight: '600',
  },
  nextButton: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 16,
    minWidth: 120,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontWeight: '600',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontWeight: '600',
    marginLeft: 8,
  },
  backButton: {
    paddingVertical: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Medium',
  },
  successIcon: {
    marginBottom: 20,
  },
  summaryCard: {
    borderRadius: 16,
    padding: 20,
    marginVertical: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontWeight: '600',
    marginBottom: 12,
  },
  summaryItem: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Regular',
    marginBottom: 6,
  },
  completeButton: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontWeight: '600',
  },
});