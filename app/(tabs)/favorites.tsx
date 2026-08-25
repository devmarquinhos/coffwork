import { useFocusEffect, useRouter } from "expo-router";
import {
  Compass,
  Heart,
  LogIn,
  MapPin,
  Star
} from "lucide-react-native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FavoriteResponse,
  favoriteService,
} from "../../src/services/favoriteService";
import { useAuthStore } from "../../src/store/useAuthStore";
import { favoritesStyles as styles } from "../../src/styles/favoritesStyles";
import { COLORS } from "../../src/styles/theme";

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
              size={22}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.locationRow}>
          <MapPin color={COLORS.darkBrown} size={14} />
          <Text style={styles.cardLocation} numberOfLines={1}>
            Ver detalhes
          </Text>
        </View>

        <View style={styles.scoreBadge}>
          <Star color={COLORS.darkBrown} fill={COLORS.darkBrown} size={12} />
          <Text style={styles.scoreText}>4.8</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        {!user ? (
          <LogIn color={COLORS.mediumBrown} size={40} />
        ) : (
          <Compass color={COLORS.mediumBrown} size={40} />
        )}
      </View>
      <Text style={styles.emptyTitle}>
        {!user ? "Faça login para ver favoritos" : "Nenhum favorito ainda"}
      </Text>
      <Text style={styles.emptySubtitle}>
        {!user
          ? "Você precisa estar logado para salvar as suas cafeterias preferidas e acessá-las rapidamente."
          : "Explore cafeterias na página inicial e toque no ícone de coração para salvá-las aqui."}
      </Text>
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() =>
          !user
            ? router.push("/(auth)/login" as any)
            : router.push("/(tabs)" as any)
        }
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
