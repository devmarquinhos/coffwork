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
  Modal,
  TextInput,
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../../src/styles/theme";
import { useAuthStore } from "../../src/store/useAuthStore";
import { favoriteService } from "../../src/services/favoriteService";
import { coffeeService } from "../../src/services/coffeeService";
import { CoffeeShopDetails } from "@/types/coffee";

const CONTEXT_OPTIONS = [
  { label: "Estudar", value: "STUDY" },
  { label: "Trabalhar", value: "REMOTE_WORK" },
  { label: "Social", value: "SOCIAL" },
  { label: "Café Especial", value: "COFFEE_TASTING" },
];

const NOISE_OPTIONS = [
  { label: "Baixo", value: "LOW" },
  { label: "Médio", value: "MEDIUM" },
  { label: "Alto", value: "HIGH" },
];

export default function CoffeeDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();
  
  const [coffeeData, setCoffeeData] = useState<CoffeeShopDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewStep, setReviewStep] = useState(1);
  const [reviewForm, setReviewForm] = useState({
    context: "",
    rating: 0,
    hasWifi: null as boolean | null,
    hasPowerOutlets: null as boolean | null,
    noiseLevel: "",
    comment: "",
  });

  const updateForm = (field: keyof typeof reviewForm, value: any) => {
    setReviewForm((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (reviewStep === 1 && (!reviewForm.context || reviewForm.rating === 0)) {
      alert("Selecione o contexto e a nota para continuar.");
      return;
    }
    setReviewStep((prev) => Math.min(prev + 1, 3));
  };
  
  const prevStep = () => setReviewStep((prev) => Math.max(prev - 1, 1));
  
  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setReviewStep(1);
    setReviewForm({
      context: "",
      rating: 0,
      hasWifi: null,
      hasPowerOutlets: null,
      noiseLevel: "",
      comment: "",
    });
  };

  const submitReview = async () => {
    console.log("Enviando review:", reviewForm);
    alert("Avaliação enviada com sucesso!");
    closeReviewModal();
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchCoffeeDetails = async () => {
        if (!id) return;
        setLoading(true);
        try {
          const data = await coffeeService.getById(id as string);
          if (isActive) {
            setCoffeeData(data);
          }
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
          if (isActive) {
            const alreadyFavorited = myFavs.some(
              (fav) => fav.coffeeShopId === id,
            );
            setIsFavorited(alreadyFavorited);
          }
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
      setIsFavorited(currentState);
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
        source={{ uri: coffeeData.coverImageUrl || coffeeData.coverImageUrl }}
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
            {coffeeData.shortDescription ||
              coffeeData.shortDescription ||
              "Nenhuma descrição disponível."}
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
          onPress={() => {
            if (!user) {
              alert("Faça login para avaliar!");
              router.push("/login");
              return;
            }
            setIsReviewModalOpen(true);
          }}
        >
          <Text style={styles.primaryButtonText}>Avaliar Experiência</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isReviewModalOpen}
        onRequestClose={closeReviewModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.bottomSheet, { paddingBottom: Math.max(insets.bottom, 24) }]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={closeReviewModal}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <Text style={styles.stepIndicator}>Passo {reviewStep} de 3</Text>
            </View>

            {reviewStep === 1 && (
              <View style={styles.stepContainer}>
                <Text style={styles.stepTitle}>Como foi sua experiência?</Text>
                <Text style={styles.stepSubtitle}>
                  O que você foi fazer no {coffeeData?.name}?
                </Text>

                <View style={styles.optionsWrap}>
                  {CONTEXT_OPTIONS.map((ctx) => (
                    <TouchableOpacity
                      key={ctx.value}
                      style={[
                        styles.optionPill,
                        reviewForm.context === ctx.value && styles.optionPillActive,
                      ]}
                      onPress={() => updateForm("context", ctx.value)}
                    >
                      <Text
                        style={[
                          styles.optionPillText,
                          reviewForm.context === ctx.value && styles.optionPillTextActive,
                        ]}
                      >
                        {ctx.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.fieldLabel}>Nota Geral</Text>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={star} onPress={() => updateForm("rating", star)}>
                      <Star
                        size={40}
                        color={reviewForm.rating >= star ? COLORS.mediumBrown : "#D1D5DB"}
                        fill={reviewForm.rating >= star ? COLORS.mediumBrown : "transparent"}
                      />
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={nextStep}
                >
                  <Text style={styles.primaryButtonText}>Continuar</Text>
                </TouchableOpacity>
              </View>
            )}

            {reviewStep === 2 && (
              <View style={styles.stepContainer}>
                <Text style={styles.stepTitle}>Estrutura do Local</Text>
                <Text style={styles.stepSubtitle}>
                  Isso ajuda outros usuários a se prepararem.
                </Text>

                <View style={styles.fieldsContainer}>
                  <Text style={styles.fieldLabel}>O local possui Wi-Fi?</Text>
                  <View style={styles.binaryOptionsRow}>
                    <TouchableOpacity
                      style={[styles.binaryButton, reviewForm.hasWifi === true && styles.binaryButtonActive]}
                      onPress={() => updateForm("hasWifi", true)}
                    >
                      <Text style={[styles.binaryButtonText, reviewForm.hasWifi === true && styles.binaryButtonTextActive]}>Sim</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.binaryButton, reviewForm.hasWifi === false && styles.binaryButtonActive]}
                      onPress={() => updateForm("hasWifi", false)}
                    >
                      <Text style={[styles.binaryButtonText, reviewForm.hasWifi === false && styles.binaryButtonTextActive]}>Não</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.fieldLabel}>O local possui tomadas acessíveis?</Text>
                  <View style={styles.binaryOptionsRow}>
                    <TouchableOpacity
                      style={[styles.binaryButton, reviewForm.hasPowerOutlets === true && styles.binaryButtonActive]}
                      onPress={() => updateForm("hasPowerOutlets", true)}
                    >
                      <Text style={[styles.binaryButtonText, reviewForm.hasPowerOutlets === true && styles.binaryButtonTextActive]}>Sim</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.binaryButton, reviewForm.hasPowerOutlets === false && styles.binaryButtonActive]}
                      onPress={() => updateForm("hasPowerOutlets", false)}
                    >
                      <Text style={[styles.binaryButtonText, reviewForm.hasPowerOutlets === false && styles.binaryButtonTextActive]}>Não</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.fieldLabel}>Nível de ruído</Text>
                  <View style={styles.optionsWrap}>
                    {NOISE_OPTIONS.map((noise) => (
                      <TouchableOpacity
                        key={noise.value}
                        style={[
                          styles.optionPill,
                          reviewForm.noiseLevel === noise.value && styles.optionPillActive,
                        ]}
                        onPress={() => updateForm("noiseLevel", noise.value)}
                      >
                        <Text
                          style={[
                            styles.optionPillText,
                            reviewForm.noiseLevel === noise.value && styles.optionPillTextActive,
                          ]}
                        >
                          {noise.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.modalButtonRow}>
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={prevStep}
                  >
                    <Text style={styles.secondaryButtonText}>Voltar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.primaryButton, { flex: 1 }]}
                    onPress={nextStep}
                  >
                    <Text style={styles.primaryButtonText}>Continuar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {reviewStep === 3 && (
              <View style={styles.stepContainer}>
                <Text style={styles.stepTitle}>Algo a acrescentar?</Text>
                <Text style={styles.stepSubtitle}>
                  Conte um pouco mais sobre o atendimento ou o café (Opcional).
                </Text>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textArea}
                    placeholder="Deixe seu comentário aqui..."
                    placeholderTextColor="#9CA3AF"
                    multiline
                    numberOfLines={5}
                    value={reviewForm.comment}
                    onChangeText={(text) => updateForm("comment", text)}
                    textAlignVertical="top"
                  />
                </View>

                <View style={styles.modalButtonRow}>
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={prevStep}
                  >
                    <Text style={styles.secondaryButtonText}>Voltar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.primaryButton, { flex: 1 }]}
                    onPress={submitReview}
                  >
                    <Text style={styles.primaryButtonText}>
                      Publicar Avaliação
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  bottomSheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  cancelText: {
    color: "#EF4444",
    fontWeight: "600",
    fontSize: 16,
  },
  stepIndicator: {
    color: COLORS.darkBrown,
    fontWeight: "bold",
  },
  stepContainer: {},
  stepTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 15,
    color: COLORS.darkBrown,
    marginBottom: 24,
  },
  modalButtonRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 16,
  },
  secondaryButton: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 30,
    backgroundColor: COLORS.cream,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: COLORS.darkBrown,
    fontSize: 16,
    fontWeight: "bold",
  },
  optionsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  optionPill: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: COLORS.white,
  },
  optionPillActive: {
    backgroundColor: COLORS.mediumBrown,
    borderColor: COLORS.mediumBrown,
  },
  optionPillText: {
    color: COLORS.darkBrown,
    fontWeight: "600",
    fontSize: 14,
  },
  optionPillTextActive: {
    color: COLORS.white,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 40,
  },
  fieldsContainer: {
    marginBottom: 16,
  },
  binaryOptionsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  binaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  binaryButtonActive: {
    backgroundColor: COLORS.mediumBrown,
    borderColor: COLORS.mediumBrown,
  },
  binaryButtonText: {
    color: COLORS.darkBrown,
    fontWeight: "bold",
    fontSize: 15,
  },
  binaryButtonTextActive: {
    color: COLORS.white,
  },
  inputContainer: {
    marginBottom: 24,
  },
  textArea: {
    backgroundColor: COLORS.cream,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: COLORS.black,
    minHeight: 120,
  },
});