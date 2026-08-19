import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  StatusBar, 
  ScrollView, 
  TouchableOpacity, 
  ImageBackground, 
  FlatList 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../src/styles/theme';
import { useRouter, Href } from 'expo-router';

const CONTEXTS = ['Estudar', 'Trabalhar', 'Social', 'Café Especial'];

const MOCK_COFFEES = [
  { 
    id: '1', 
    name: 'Cravo Camelia', 
    score: '4.9', 
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800',
    location: 'Dias dÁvila'
  },
  { 
    id: '2', 
    name: 'Terraço Café', 
    score: '4.7', 
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800',
    location: 'Centro'
  },
];

export default function Home() {
  const router = useRouter();
  const [activeContext, setActiveContext] = useState('Estudar');

  const renderCoffeeCard = ({ item }: { item: typeof MOCK_COFFEES[0] }) => (
    <TouchableOpacity 
      style={styles.cardContainer} 
      activeOpacity={0.9}
      onPress={() => router.push(`/details/${item.id}` as Href)}>
      <ImageBackground
        source={{ uri: item.image }}
        style={styles.cardImage}
        imageStyle={styles.cardImageStyle}
      >
        {/* favorite icon */}
        <View style={styles.favoriteButton}>
          <Text style={{ fontSize: 16 }}>🤍</Text>
        </View>

        {/* dark overlay */}
        <View style={styles.cardContent}>
          <View>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSubtitle}>📍 {item.location}</Text>
          </View>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>⭐ {item.score}</Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.cream} />
      
      <View style={styles.container}>
        {/* header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Olá, Marquinhos 👋</Text>
          <Text style={styles.subtitle}>Escolha seu contexto de hoje</Text>
        </View>

        {/* filters */}
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
                  <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                    {context}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* coffeeshop list */}
        <FlatList
          data={MOCK_COFFEES}
          keyExtractor={(item) => item.id}
          renderItem={renderCoffeeCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
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
    marginTop: 20,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
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
    borderColor: 'transparent',
  },
  pillActive: {
    backgroundColor: COLORS.mediumBrown,
  },
  pillText: {
    color: COLORS.darkBrown,
    fontWeight: '600',
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
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: 24,
    backgroundColor: COLORS.cream,
  },
  cardImage: {
    flex: 1,
    justifyContent: 'flex-end',
    borderRadius: 24,
    overflow: 'hidden',
  },
  cardImageStyle: {
    borderRadius: 24,
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  cardTitle: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSubtitle: {
    color: COLORS.cream,
    fontSize: 14,
    fontWeight: '500',
  },
  scoreBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  scoreText: {
    color: COLORS.darkBrown,
    fontWeight: 'bold',
    fontSize: 14,
  },
});