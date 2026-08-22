import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { Heart, Coffee } from "lucide-react-native";
import { COLORS } from "../src/styles/theme";
import {
  favoriteService,
  FavoriteResponse,
} from "../src/services/favoriteService";
import { useAuthStore } from "../src/store/useAuthStore";

export default function Favorites() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [favorites, setFavorites] = useState<FavoriteResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchMyFavorites = async () => {
        if (!user) {
          setFavorites([]);
          setLoading(false);
          return;
        }

        setLoading(true);
        try {
          const data = await favoriteService.getMyFavorites();
          if (isActive) {
            setFavorites(data);
          }
        } catch (error) {
          console.log("Erro ao carregar aba de favoritos silencioso.");
        } finally {
          if (isActive) setLoading(false);
        }
      };

      fetchMyFavorites();

      return () => {
        isActive = false;
      };
    }, [user]),
  );

  const removeFavorite = async (favoriteId: number, coffeeShopId: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== favoriteId));

    try {
      await favoriteService.removeFavorite(coffeeShopId);
    } catch (error) {
      console.log("Falha ao remover favorito na API");
    }
  };

  const renderFavoriteItem = ({ item }: { item: FavoriteResponse }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      activeOpacity={0.8}
      onPress={() =>
        router.push({
          pathname: "/details/[id]",
          params: { id: item.coffeeShopId },
        } as any)
      }
    >
      <Image source={{ uri: item.coverImageUrl }} style={styles.cardImage} />

      <View style={styles.cardInfo}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.coffeeShopName}
          </Text>

          <TouchableOpacity
            style={styles.heartButton}
            onPress={() => removeFavorite(item.id, item.coffeeShopId)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Heart
              color={COLORS.mediumBrown}
              fill={COLORS.mediumBrown}
              size={24}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.cardLocation}>📍 Ver no detalhe</Text>

        <View style={styles.scoreBadge}>
          <Text style={styles.scoreText}>⭐ 4.8</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Coffee color={COLORS.mediumBrown} size={48} />
      </View>
      <Text style={styles.emptyTitle}>
        {!user ? "Faça login para ver favoritos" : "Nenhum favorito ainda"}
      </Text>
      <Text style={styles.emptySubtitle}>
        {!user
          ? "Você precisa estar logado para salvar as suas cafeterias preferidas."
          : "Explore cafeterias na página inicial e salve seus lugares preferidos para acessá-los rápido aqui."}
      </Text>
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => (!user ? router.push("/login") : router.push("/"))}
      >
        <Text style={styles.exploreButtonText}>
          {!user ? "Fazer Login" : "Explorar Cafés"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Meus Favoritos</Text>
        </View>

        {loading ? (
          <View style={[styles.emptyListContent, { flex: 1 }]}>
            <ActivityIndicator size="large" color={COLORS.mediumBrown} />
          </View>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderFavoriteItem}
            ListEmptyComponent={renderEmptyState}
            contentContainerStyle={
              favorites.length === 0
                ? styles.emptyListContent
                : styles.listContent
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white },
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 28, fontWeight: "bold", color: COLORS.black },
  listContent: { paddingHorizontal: 24, paddingBottom: 24, gap: 16 },
  emptyListContent: { flexGrow: 1, justifyContent: "center" },
  cardContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 20,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
    height: 120,
    overflow: "hidden",
  },
  cardImage: { width: 120, height: "100%" },
  cardInfo: { flex: 1, padding: 16, justifyContent: "space-between" },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
    flex: 1,
    marginRight: 8,
  },
  heartButton: { marginLeft: 8 },
  cardLocation: { fontSize: 14, color: COLORS.darkBrown, marginTop: -4 },
  scoreBadge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.cream,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scoreText: { color: COLORS.darkBrown, fontWeight: "bold", fontSize: 12 },
  emptyContainer: { alignItems: "center", paddingHorizontal: 40 },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(65, 45, 21, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 15,
    color: COLORS.darkBrown,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  exploreButton: {
    backgroundColor: COLORS.mediumBrown,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
  },
  exploreButtonText: { color: COLORS.cream, fontSize: 16, fontWeight: "bold" },
});
