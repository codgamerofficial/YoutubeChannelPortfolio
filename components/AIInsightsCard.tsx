import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, Lightbulb, Target, Zap, ChevronRight } from 'lucide-react-native';
import { AIInsight } from '@/services/aiAnalytics';
import { useTheme } from '@/contexts/ThemeContext';

interface AIInsightsCardProps {
  insights: AIInsight[];
  onInsightPress?: (insight: AIInsight) => void;
}

export default function AIInsightsCard({ insights, onInsightPress }: AIInsightsCardProps) {
  const { colors } = useTheme();

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'growth':
        return TrendingUp;
      case 'content':
        return Lightbulb;
      case 'engagement':
        return Target;
      case 'optimization':
        return Zap;
      default:
        return Lightbulb;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return colors.error;
      case 'medium':
        return colors.warning;
      case 'low':
        return colors.success;
      default:
        return colors.primary;
    }
  };

  const getTypeGradient = (type: string) => {
    switch (type) {
      case 'growth':
        return [colors.primary, colors.secondary];
      case 'content':
        return [colors.secondary, colors.accent];
      case 'engagement':
        return [colors.accent, colors.success];
      case 'optimization':
        return [colors.success, colors.primary];
      default:
        return colors.gradient1;
    }
  };

  if (insights.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.card }]}>
        <Lightbulb size={40} color={colors.textSecondary} />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>
          No Insights Available
        </Text>
        <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
          Connect your YouTube channel to get AI-powered insights
        </Text>
      </View>
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {insights.map((insight, index) => {
        const IconComponent = getInsightIcon(insight.type);
        const priorityColor = getPriorityColor(insight.priority);
        const gradient = getTypeGradient(insight.type);

        return (
          <TouchableOpacity
            key={insight.id}
            style={[styles.insightCard, { backgroundColor: colors.card }]}
            onPress={() => onInsightPress?.(insight)}>
            <LinearGradient
              colors={gradient}
              style={styles.iconContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}>
              <IconComponent size={24} color="#fff" />
            </LinearGradient>

            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={[styles.insightTitle, { color: colors.text }]} numberOfLines={2}>
                  {insight.title}
                </Text>
                <View style={[styles.priorityBadge, { backgroundColor: `${priorityColor}20` }]}>
                  <Text style={[styles.priorityText, { color: priorityColor }]}>
                    {insight.priority.toUpperCase()}
                  </Text>
                </View>
              </View>

              <Text style={[styles.insightDescription, { color: colors.textSecondary }]} numberOfLines={3}>
                {insight.description}
              </Text>

              <View style={styles.cardFooter}>
                <View style={styles.impactContainer}>
                  <Text style={[styles.impactLabel, { color: colors.textSecondary }]}>
                    Impact Score
                  </Text>
                  <Text style={[styles.impactScore, { color: colors.primary }]}>
                    {insight.impact_score}/100
                  </Text>
                </View>
                <ChevronRight size={16} color={colors.textSecondary} />
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  insightCard: {
    width: 280,
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
    lineHeight: 22,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontFamily: 'FiraCode-Medium',
    fontWeight: '600',
  },
  insightDescription: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Regular',
    lineHeight: 20,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  impactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  impactLabel: {
    fontSize: 12,
    fontFamily: 'FiraCode-Regular',
    marginRight: 8,
  },
  impactScore: {
    fontSize: 14,
    fontFamily: 'FiraCode-Medium',
    fontWeight: '600',
  },
});