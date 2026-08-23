import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Star, User } from "lucide-react-native";
import { COLORS } from "../styles/theme";
import { reviewListStyles as styles } from "../styles/reviewListStyles";
import { ReviewResponse } from "../types/review";

const CONTEXT_LABELS: Record<string, string> = {
  STUDY: "Estudar",
  REMOTE_WORK: "Trabalhar",
  SOCIAL: "Social",
  COFFEE_TASTING: "Café Especial",
};

interface ReviewListProps {
  reviews: ReviewResponse[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Nenhuma avaliação ainda. Seja o primeiro a compartilhar sua
          experiência!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {reviews.map((review) => {
        const date = new Date(review.createdAt).toLocaleDateString("pt-BR");

        return (
          <View key={review.id.toString()} style={styles.card}>
            <View style={styles.header}>
              <View style={styles.userInfo}>
                <View style={styles.avatar}>
                  <User color={COLORS.mediumBrown} size={16} />
                </View>
                <View>
                  <Text style={styles.userName}>{review.userName}</Text>
                  <Text style={styles.date}>{date}</Text>
                </View>
              </View>

              <View style={styles.ratingBadge}>
                <Star color={COLORS.white} size={12} fill={COLORS.white} />
                <Text style={styles.ratingText}>{review.overallRating}</Text>
              </View>
            </View>

            <View style={styles.contextPill}>
              <Text style={styles.contextText}>
                {CONTEXT_LABELS[review.context] || review.context}
              </Text>
            </View>

            {review.comment ? (
              <Text style={styles.comment}>{review.comment}</Text>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}
