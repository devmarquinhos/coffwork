import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import {
  ArrowLeft,
  Heart,
  Star,
  Wifi,
  Plug,
  MapPin,
} from "lucide-react-native"; // MapPin importado
import { COLORS } from "../../src/styles/theme";
import { useAuthStore } from "../../src/store/useAuthStore";
import { favoriteService } from "../../src/services/favoriteService";

export default function CoffeeDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();

  const [isFavorited, setIsFavorited] = useState(false);

  const coffeeData = {
    name: "Cravo Camelia",
    score: "4.9",
    description:
      "Um ambiente aconchegante focado em doces artesanais e cafés especiais. Excelente iluminação natural, perfeito para um encontro social ou uma tarde de trabalho tranquilo.",
    image:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800",
    location: "Dias d'Ávila",
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const checkFavoriteStatus = async () => {
        if (!user || !id) return;
        try {
          const myFavs = await favoriteService.getMyFavorites();
          if (isActive) {
            const alreadyFavorited = myFavs.some(
              (fav) => fav.coffeeShopId === id,
            );

            setIsFavorited(alreadyFavorited);
          }
        } catch (error) {
          console.log("Erro ao adicionar cafeteria aos favoritos.", error);
        }
      };

      checkFavoriteStatus();

      return () => {
        isActive = false;
      };
    }, [id, user]),
  );

  const handleFavoriteClick = async () => {
    if (!user) {
      alert("Faça login para salvar suas cafeterias favoritas!");
      router.push("/login");
      return;
    }

    const coffeeId = id as string;
    const currentState = isFavorited;

    setIsFavorited(!currentState);

    try {
      if (currentState) {
        await favoriteService.removeFavorite(coffeeId);
      } else {
        await favoriteService.addFavorite(coffeeId);
      }
    } catch (error) {
      console.log("Erro ao favoritar no detalhe:", error);

      setIsFavorited(currentState);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <Image
        source={{ uri: coffeeData.image }}
        style={styles.heroImage}
        resizeMode="cover"
      />

      {/* header nav buttons */}
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

      {/* scroll view */}
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.transparentSpacer} />

        {/* content */}
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

          {/* tags */}
          <View style={styles.tagsContainer}>
            <View style={styles.tag}>
              <Wifi color={COLORS.darkBrown} size={16} />
              <Text style={styles.tagText}>Wi-Fi Rápido</Text>
            </View>
            <View style={styles.tag}>
              <Plug color={COLORS.darkBrown} size={16} />
              <Text style={styles.tagText}>Tomadas</Text>
            </View>
          </View>

          {/* description */}
          <Text style={styles.sectionTitle}>Visão Geral</Text>
          <Text style={styles.description}>{coffeeData.description}</Text>

          {/* avaliações */}
          <Text style={styles.sectionTitle}>Avaliações Contextuais</Text>
          <View style={styles.placeholderReview}>
            <Text style={{ color: COLORS.mediumBrown }}>
              As notas detalhadas entrarão aqui.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push(`/review/${id}` as any)}
        >
          <Text style={styles.primaryButtonText}>Avaliar Experiência</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  heroImage: {
    width: "100%",
    height: 450,
    position: "absolute",
    top: 0,
  },
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
  scrollContainer: {
    flex: 1,
  },
  transparentSpacer: {
    height: 350,
  },
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
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  location: {
    fontSize: 14,
    color: COLORS.darkBrown,
  },
  scoreBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.cream,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 4,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.darkBrown,
  },
  tagsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
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
  tagText: {
    color: COLORS.darkBrown,
    fontWeight: "600",
    fontSize: 13,
  },
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
  primaryButtonText: {
    color: COLORS.cream,
    fontSize: 16,
    fontWeight: "bold",
  },
});
