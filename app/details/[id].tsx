import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import {
  ArrowLeft,
  Heart,
  Star,
  Wifi,
  Plug,
  MapPin,
} from "lucide-react-native";
import { COLORS } from "../../src/styles/theme";
import { coffeeDetailsStyles as styles } from "../../src/styles/coffeeDetailsStyles";
import { useAuthStore } from "../../src/store/useAuthStore";
import { favoriteService } from "../../src/services/favoriteService";
import { coffeeService } from "../../src/services/coffeeService";
import { reviewService } from "../../src/services/reviewService";
import { CoffeeShopDetails } from "../../src/types/coffee";
import { ReviewFormState, ReviewResponse } from "../../src/types/review";
import { ReviewModal } from "../../src/components/ReviewModal";
import { ReviewList } from "../../src/components/ReviewList";

export default function CoffeeDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();

  const [coffeeData, setCoffeeData] = useState<CoffeeShopDetails | null>(null);
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const fetchReviews = async () => {
    try {
      const data = await reviewService.getReviewsByCoffeeShop(id as string);
      setReviews(data);
    } catch (error) {
      console.log("Erro ao carregar avaliações");
    }
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchCoffeeDetails = async () => {
        if (!id) return;
        setLoading(true);
        try {
          const data = await coffeeService.getById(id as string);
          if (isActive) setCoffeeData(data);
        } catch (error) {
          alert("Não foi possível carregar os detalhes.");
          router.back();
        } finally {
          if (isActive) setLoading(false);
        }
      };

      const checkFavoriteStatus = async () => {
        if (!user || !id) return;
        try {
          const myFavs = await favoriteService.getMyFavorites();
          if (isActive)
            setIsFavorited(myFavs.some((fav) => fav.coffeeShopId === id));
        } catch (error) {}
      };

      fetchCoffeeDetails();
      fetchReviews();
      checkFavoriteStatus();

      return () => {
        isActive = false;
      };
    }, [id, user]),
  );

  const handleFavoriteClick = async () => {
    if (!user) {
      alert("Faça login para salvar!");
      router.push("/login");
      return;
    }
    const coffeeId = id as string;
    const currentState = isFavorited;
    setIsFavorited(!currentState);
    try {
      if (currentState) await favoriteService.removeFavorite(coffeeId);
      else await favoriteService.addFavorite(coffeeId);
    } catch (error) {
      setIsFavorited(currentState);
    }
  };

  const handleReviewSubmit = async (reviewData: ReviewFormState) => {
    try {
      await reviewService.createReview(id as string, reviewData);
      alert("Avaliação publicada com sucesso!");
      setIsReviewModalOpen(false);

      const updatedReviews = await reviewService.getReviewsByCoffeeShop(
        id as string,
      );
      setReviews(updatedReviews);

      if (updatedReviews.length > 0) {
        const sum = updatedReviews.reduce(
          (acc: number, curr: ReviewResponse) =>
            acc + Number(curr.overallRating),
          0,
        );
        const newAverageScore = (sum / updatedReviews.length).toFixed(1);

        setCoffeeData((prev) =>
          prev ? { ...prev, score: newAverageScore } : null,
        );
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Ocorreu um erro ao enviar sua avaliação.";
      alert(errorMessage);
    }
  };

  if (loading || !coffeeData) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={COLORS.mediumBrown} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <Image
        source={{ uri: coffeeData?.coverImageUrl }}
        style={styles.heroImage}
        resizeMode="cover"
      />

      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color={COLORS.black} size={24} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleFavoriteClick}
        >
          <Heart
            color={isFavorited ? COLORS.mediumBrown : COLORS.black}
            fill={isFavorited ? COLORS.mediumBrown : "transparent"}
            size={24}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.transparentSpacer} />
        <View style={styles.sheetContainer}>
          <View style={styles.headerRow}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{coffeeData?.name}</Text>
              <View style={styles.locationContainer}>
                <MapPin color={COLORS.darkBrown} size={14} />
                <Text style={styles.location}>{coffeeData?.location}</Text>
              </View>
            </View>
            <View style={styles.scoreBadge}>
              <Star
                color={COLORS.mediumBrown}
                size={18}
                fill={COLORS.mediumBrown}
              />
              <Text style={styles.scoreText}>{coffeeData?.score}</Text>
            </View>
          </View>

          <View style={styles.tagsContainer}>
            {coffeeData?.hasWifi !== false && (
              <View style={styles.tag}>
                <Wifi color={COLORS.darkBrown} size={16} />
                <Text style={styles.tagText}>Wi-Fi Rápido</Text>
              </View>
            )}
            {coffeeData?.hasPowerOutlets !== false && (
              <View style={styles.tag}>
                <Plug color={COLORS.darkBrown} size={16} />
                <Text style={styles.tagText}>Tomadas</Text>
              </View>
            )}
          </View>

          <Text style={styles.sectionTitle}>Visão Geral</Text>
          <Text style={styles.description}>
            {coffeeData?.shortDescription || "Nenhuma descrição disponível."}
          </Text>

          <Text style={styles.sectionTitle}>Avaliações</Text>

          <ReviewList reviews={reviews} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() =>
            user ? setIsReviewModalOpen(true) : router.push("/login")
          }
        >
          <Text style={styles.primaryButtonText}>Avaliar Experiência</Text>
        </TouchableOpacity>
      </View>

      <ReviewModal
        visible={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        coffeeName={coffeeData?.name}
        onSubmit={handleReviewSubmit}
      />
    </View>
  );
}
