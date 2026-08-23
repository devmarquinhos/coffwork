import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
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
import { useAuthStore } from "../../src/store/useAuthStore";
import { favoriteService } from "../../src/services/favoriteService";
import { coffeeService } from "../../src/services/coffeeService";
import { CoffeeShopDetails } from "../../src/types/coffee";
import { ReviewModal } from "../../src/components/ReviewModal";
import { ReviewFormState } from "../../src/types/review";

export default function CoffeeDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();

  const [coffeeData, setCoffeeData] = useState<CoffeeShopDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

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

  const handleReviewSubmit = (reviewData: ReviewFormState) => {
    console.log("Aqui enviaremos para o backend:", reviewData);
    alert("Avaliação concluída!");
    // O próximo passo será conectar o serviço aqui!
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
        source={{ uri: coffeeData.coverImageUrl }}
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
            <View>
              <Text style={styles.title}>{coffeeData.name}</Text>
              <View style={styles.locationContainer}>
                <MapPin color={COLORS.darkBrown} size={14} />
                <Text style={styles.location}>{coffeeData.location}</Text>
              </View>
            </View>
            <View style={styles.scoreBadge}>
              <Star
                color={COLORS.mediumBrown}
                size={18}
                fill={COLORS.mediumBrown}
              />
              <Text style={styles.scoreText}>{coffeeData.score}</Text>
            </View>
          </View>

          <View style={styles.tagsContainer}>
            {coffeeData.hasWifi !== false && (
              <View style={styles.tag}>
                <Wifi color={COLORS.darkBrown} size={16} />
                <Text style={styles.tagText}>Wi-Fi Rápido</Text>
              </View>
            )}
            {coffeeData.hasPowerOutlets !== false && (
              <View style={styles.tag}>
                <Plug color={COLORS.darkBrown} size={16} />
                <Text style={styles.tagText}>Tomadas</Text>
              </View>
            )}
          </View>

          <Text style={styles.sectionTitle}>Visão Geral</Text>
          <Text style={styles.description}>
            {coffeeData.shortDescription || "Nenhuma descrição disponível."}
          </Text>

          <Text style={styles.sectionTitle}>Avaliações Contextuais</Text>
          <View style={styles.placeholderReview}>
            <Text style={{ color: COLORS.mediumBrown }}>
              As notas detalhadas entrarão aqui.
            </Text>
          </View>
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
        coffeeName={coffeeData.name}
        onSubmit={handleReviewSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  heroImage: { width: "100%", height: 450, position: "absolute", top: 0 },
  topBar: {
    position: "absolute",
    top: 50,
    left: 24,
    right: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 10,
  },
  iconButton: {
    backgroundColor: COLORS.cream,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: { flex: 1 },
  transparentSpacer: { height: 350 },
  sheetContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    minHeight: 600,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 4,
  },
  locationContainer: { flexDirection: "row", alignItems: "center", gap: 4 },
  location: { fontSize: 14, color: COLORS.darkBrown },
  scoreBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.cream,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 4,
  },
  scoreText: { fontSize: 16, fontWeight: "bold", color: COLORS.darkBrown },
  tagsContainer: { flexDirection: "row", gap: 12, marginBottom: 24 },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(65, 45, 21, 0.2)",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  tagText: { color: COLORS.darkBrown, fontWeight: "600", fontSize: 13 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: COLORS.darkBrown,
    lineHeight: 24,
    marginBottom: 32,
  },
  placeholderReview: {
    height: 100,
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  footer: {
    padding: 24,
    paddingBottom: 34,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  primaryButton: {
    backgroundColor: COLORS.mediumBrown,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
  },
  primaryButtonText: { color: COLORS.cream, fontSize: 16, fontWeight: "bold" },
});
