import { useState, useCallback } from "react";
import {
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../../src/styles/theme";
import { homeStyles as styles } from "../../src/styles/homeStyles";
import { useRouter, useFocusEffect } from "expo-router";
import { Heart, MapPin, Star, Search } from "lucide-react-native";
import { useAuthStore } from "../../src/store/useAuthStore";
import { CoffeeShop, coffeeService } from "../../src/services/coffeeService";
import { favoriteService } from "../../src/services/favoriteService";

export default function Home() {
  const router = useRouter();
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();

  const [coffees, setCoffees] = useState<CoffeeShop[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        setLoading(true);
        try {
          const data = await coffeeService.getByContext("STUDY");

          if (isActive) {
            const sortedByScore = data.sort(
              (a, b) => Number(b.score) - Number(a.score),
            );
            setCoffees(sortedByScore);
          }
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

      fetchData();
      fetchFavorites();

      return () => {
        isActive = false;
      };
    }, [user]),
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

  const filteredCoffees = coffees.filter((coffee) =>
    coffee.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
            <View style={styles.cardTextContainer}>
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
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.cream} />

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Olá{user ? `, ${user.name}` : ""} 👋
          </Text>
          <Text style={styles.subtitle}>
            Encontre o lugar ideal para o seu momento
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search color={COLORS.darkBrown} size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar cafeteria..."
              placeholderTextColor="rgba(65, 45, 21, 0.5)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {loading ? (
          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator size="large" color={COLORS.mediumBrown} />
          </View>
        ) : (
          <FlatList
            data={filteredCoffees}
            keyExtractor={(item) => item.id}
            renderItem={renderCoffeeCard}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <View style={styles.emptySearchContainer}>
                <Text style={styles.emptySearchText}>
                  Nenhuma cafeteria encontrada com "{searchQuery}"
                </Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}
