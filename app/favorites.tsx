import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Heart, Coffee } from 'lucide-react-native';
import { COLORS } from '../src/styles/theme';

const INITIAL_FAVORITES = [
  { 
    id: '1', 
    coffeeShopId: '101',
    name: 'Cravo Camelia', 
    score: '4.9', 
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800',
    location: "Dias d'Ávila"
  }
];

export default function Favorites() {
  const router = useRouter();
  const [favorites, setFavorites] = useState(INITIAL_FAVORITES);

  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(item => item.id !== id));
  };

  const renderFavoriteItem = ({ item }: { item: typeof INITIAL_FAVORITES[0] }) => (
    <TouchableOpacity 
      style={styles.cardContainer}
      activeOpacity={0.8}
      onPress={() => router.push({ pathname: '/details/[id]', params: { id: item.coffeeShopId } } as any)}
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      
      <View style={styles.cardInfo}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
          {/* Botão de desfavoritar */}
          <TouchableOpacity 
            style={styles.heartButton} 
            onPress={() => removeFavorite(item.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Aumenta a área de clique
          >
            <Heart color={COLORS.mediumBrown} fill={COLORS.mediumBrown} size={24} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.cardLocation}>📍 {item.location}</Text>
        
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreText}>⭐ {item.score}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Coffee color={COLORS.mediumBrown} size={48} />
      </View>
      <Text style={styles.emptyTitle}>Nenhum favorito ainda</Text>
      <Text style={styles.emptySubtitle}>
        Explore cafeterias na página inicial e salve seus lugares preferidos para acessá-los rápido aqui.
      </Text>
      <TouchableOpacity 
        style={styles.exploreButton}
        onPress={() => router.push('/')}
      >
        <Text style={styles.exploreButtonText}>Explorar Cafés</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Meus Favoritos</Text>
        </View>

        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={renderFavoriteItem}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={favorites.length === 0 ? styles.emptyListContent : styles.listContent}
          showsVerticalScrollIndicator={false}
        />
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
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 16, // Espaçamento entre os cards (disponível no React Native moderno)
  },
  emptyListContent: {
    flexGrow: 1, 
    justifyContent: 'center',
  },
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)', // Usando a nova sintaxe de sombra
    height: 120,
    overflow: 'hidden',
  },
  cardImage: {
    width: 120,
    height: '100%',
  },
  cardInfo: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
    flex: 1,
    marginRight: 8,
  },
  heartButton: {
    marginLeft: 8,
  },
  cardLocation: {
    fontSize: 14,
    color: COLORS.darkBrown,
    marginTop: -4,
  },
  scoreBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.cream,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scoreText: {
    color: COLORS.darkBrown,
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(65, 45, 21, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 15,
    color: COLORS.darkBrown,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  exploreButton: {
    backgroundColor: COLORS.mediumBrown,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
  },
  exploreButtonText: {
    color: COLORS.cream,
    fontSize: 16,
    fontWeight: 'bold',
  }
});