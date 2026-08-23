import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../src/styles/theme";
import { useRouter, useFocusEffect } from "expo-router";
import { Heart, MapPin, Star } from "lucide-react-native";
import { useAuthStore } from "../src/store/useAuthStore";
import { CoffeeShop, coffeeService } from "../src/services/coffeeService";
import { favoriteService } from "../src/services/favoriteService";

const CONTEXTS = ["Estudar", "Trabalhar", "Social", "Café Especial"];

const CONTEXT_MAP: Record<string, string> = {
  Estudar: "STUDY",
  Trabalhar: "REMOTE_WORK",
  Social: "SOCIAL",
  "Café Especial": "COFFEE_TASTING",
};

export default function Home() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [activeContext, setActiveContext] = useState("Estudar");
  const [coffees, setCoffees] = useState<CoffeeShop[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchCoffees = async () => {
        setLoading(true);
        try {
          const backendContext = CONTEXT_MAP[activeContext];
          const data = await coffeeService.getByContext(backendContext);
          if (isActive) setCoffees(data);
        } catch (error) {
          console.log("Erro ao carregar cafeterias:", error);
        } finally {
          if (isActive) setLoading(false);
        }
      };

      const fetchFavorites = async () => {
        if (!user) {
          if (isActive) setFavoriteIds([]);
          return;
        }
        try {
          const myFavs = await favoriteService.getMyFavorites();
          if (isActive) setFavoriteIds(myFavs.map((f) => f.coffeeShopId));
        } catch (error) {
          console.log("Erro ao carregar favoritos da API na Home");
        }
      };

      fetchCoffees();
      fetchFavorites();

      return () => {
        isActive = false;
      };
    }, [activeContext, user]),
  );

  const handleFavoriteClick = async (coffeeId: string) => {
    if (!user) {
      alert("Faça login para salvar suas cafeterias favoritas!");
      router.push("/login");
      return;
    }

    const isFavorited = favoriteIds.includes(coffeeId);
    if (isFavorited) {
      setFavoriteIds((prev) => prev.filter((id) => id !== coffeeId));
    } else {
      setFavoriteIds((prev) => [...prev, coffeeId]);
    }

    try {
      if (isFavorited) {
        await favoriteService.removeFavorite(coffeeId);
      } else {
        await favoriteService.addFavorite(coffeeId);
      }
    } catch (error) {
      console.log("Erro ao favoritar:", error);

      if (isFavorited) {
        setFavoriteIds((prev) => [...prev, coffeeId]);
      } else {
        setFavoriteIds((prev) => prev.filter((id) => id !== coffeeId));
      }
    }
  };

  const renderCoffeeCard = ({ item }: { item: CoffeeShop }) => {
    const isFavorited = favoriteIds.includes(item.id);

    return (
      <TouchableOpacity
        style={styles.cardContainer}
        activeOpacity={0.9}
        onPress={() =>
          router.push({ pathname: "/details/[id]", params: { id: item.id } })
        }
      >
        <ImageBackground
          source={{ uri: item.coverImageUrl }}
          style={styles.cardImage}
          imageStyle={styles.cardImageStyle}
        >
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => handleFavoriteClick(item.id)}
            activeOpacity={0.7}
          >
            <Heart
              color={isFavorited ? COLORS.mediumBrown : COLORS.black}
              fill={isFavorited ? COLORS.mediumBrown : "transparent"}
              size={22}
            />
          </TouchableOpacity>

          <View style={styles.cardContent}>
            <View>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <View style={styles.locationContainer}>
                <MapPin color={COLORS.cream} size={14} />
                <Text style={styles.cardSubtitle}>{item.location}</Text>
              </View>
            </View>

            <View style={styles.scoreBadge}>
              <Star
                color={COLORS.darkBrown}
                fill={COLORS.darkBrown}
                size={12}
              />
              <Text style={styles.scoreText}>{item.score}</Text>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.cream} />

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Olá{user ? `, ${user.name}` : ""} 👋
          </Text>
          <Text style={styles.subtitle}>Escolha seu contexto de hoje</Text>
        </View>

        <View style={styles.pillsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {CONTEXTS.map((context) => {
              const isActive = activeContext === context;
              return (
                <TouchableOpacity
                  key={context}
                  style={[styles.pill, isActive && styles.pillActive]}
                  onPress={() => setActiveContext(context)}
                >
                  <Text
                    style={[styles.pillText, isActive && styles.pillTextActive]}
                  >
                    {context}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {loading ? (
          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator size="large" color={COLORS.mediumBrown} />
          </View>
        ) : (
          <FlatList
            data={coffees}
            keyExtractor={(item) => item.id}
            renderItem={renderCoffeeCard}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    marginTop: 20,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.black,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.darkBrown,
    marginTop: 4,
  },
  pillsContainer: {
    paddingLeft: 24,
    marginBottom: 24,
  },
  pill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "transparent",
  },
  pillActive: {
    backgroundColor: COLORS.mediumBrown,
  },
  pillText: {
    color: COLORS.darkBrown,
    fontWeight: "600",
  },
  pillTextActive: {
    color: COLORS.white,
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  cardContainer: {
    height: 280,
    marginBottom: 24,
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: 24,
    backgroundColor: COLORS.cream,
  },
  cardImage: {
    flex: 1,
    justifyContent: "flex-end",
    borderRadius: 24,
    overflow: "hidden",
  },
  cardImageStyle: {
    borderRadius: 24,
  },
  favoriteButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  cardTitle: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardSubtitle: {
    color: COLORS.cream,
    fontSize: 14,
    fontWeight: "500",
  },
  scoreBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  scoreText: {
    color: COLORS.darkBrown,
    fontWeight: "bold",
    fontSize: 14,
  },
});
