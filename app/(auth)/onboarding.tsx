import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { onboardingStyles as styles } from "../../src/styles/onboardingStyles";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    title: "Encontre o Café Perfeito",
    description:
      "Descubra cafeterias incríveis mapeadas especificamente para o seu momento do dia.",
    image:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Foque nos Estudos",
    description:
      "Filtre locais silenciosos, com Wi-Fi estável e tomadas acessíveis para render nos livros.",
    image:
      "https://images.unsplash.com/photo-1497534446932-c925b458314e?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Trabalhe com Conforto",
    description:
      "Encontre cafeterias acolhedoras para o seu home office remoto e longa estadia.",
    image:
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "Conecte-se e Avalie",
    description:
      "Compartilhe suas experiências e ajude a comunidade a achar os melhores grãos e ambientes.",
    image:
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1000&auto=format&fit=crop",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentIndex < SLIDES.length - 1) {
        const nextIndex = currentIndex + 1;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        setCurrentIndex(nextIndex);
      } else {
        clearInterval(timer);
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

  const isLastSlide = currentIndex === SLIDES.length - 1;

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image
              source={{ uri: item.image }}
              style={styles.slideImage}
              resizeMode="cover"
            />

            <View style={styles.overlay}>
              <View style={styles.progressContainer}>
                {SLIDES.map((_, index) => (
                  <View key={index} style={styles.progressBarBackground}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: index <= currentIndex ? "100%" : "0%",
                        },
                      ]}
                    />
                  </View>
                ))}
              </View>

              <View style={styles.contentContainer}>
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.description}>{item.description}</Text>
                </View>
              </View>

              <View style={styles.footer}>
                {isLastSlide ? (
                  <>
                    <TouchableOpacity
                      style={styles.primaryButton}
                      onPress={() => router.push("/login") as any}
                    >
                      <Text style={styles.primaryButtonText}>Fazer Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.secondaryButton}
                      onPress={() => router.push("/(auth)/register" as any)}
                    >
                      <Text style={styles.secondaryButtonText}>
                        Criar Conta
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <View style={{ height: 20 }} />
                )}
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}
