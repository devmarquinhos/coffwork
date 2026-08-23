// src/components/ReviewModal.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Animated,
} from "react-native";
import { Star } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../styles/theme";
import { ReviewFormState } from "../types/review";

const CONTEXT_OPTIONS = [
  { label: "Estudar", value: "STUDY" },
  { label: "Trabalhar", value: "REMOTE_WORK" },
  { label: "Social", value: "SOCIAL" },
  { label: "Café Especial", value: "COFFEE_TASTING" },
];

const INITIAL_FORM: ReviewFormState = {
  context: "",
  overallRating: 0,
  comment: "",
  silenceRating: 0,
  powerOutletsRating: 0,
  seatComfortRating: 0,
  wifiRating: 0,
  longStayToleranceRating: 0,
  ambienceRating: 0,
  musicRating: 0,
  privacyRating: 0,
  coffeeQualityRating: 0,
  brewMethodsVarietyRating: 0,
  baristaServiceRating: 0,
  priceFairnessRating: 0,
};

interface ReviewModalProps {
  visible: boolean;
  onClose: () => void;
  coffeeName?: string;
  onSubmit: (data: ReviewFormState) => void;
}

export function ReviewModal({
  visible,
  onClose,
  coffeeName,
  onSubmit,
}: ReviewModalProps) {
  const insets = useSafeAreaInsets();
  const [reviewStep, setReviewStep] = useState(1);
  const [reviewForm, setReviewForm] = useState<ReviewFormState>(INITIAL_FORM);
  const [showModal, setShowModal] = useState(visible);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(600)).current;

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 600,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowModal(false);
      });
    }
  }, [visible]);

  const updateForm = (field: keyof ReviewFormState, value: any) => {
    setReviewForm((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (
      reviewStep === 1 &&
      (!reviewForm.context || reviewForm.overallRating === 0)
    ) {
      alert("Selecione o contexto e a nota geral para continuar.");
      return;
    }
    setReviewStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => setReviewStep((prev) => Math.max(prev - 1, 1));

  const handleClose = () => {
    setReviewStep(1);
    setReviewForm(INITIAL_FORM);
    onClose();
  };

  const handleSubmit = () => {
    onSubmit(reviewForm);
    setTimeout(() => {
      handleClose();
    }, 100);
  };

  const renderSubRating = (label: string, field: keyof ReviewFormState) => (
    <View style={styles.subRatingContainer} key={field}>
      <Text style={styles.subRatingLabel}>{label}</Text>
      <View style={styles.subStarsRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => updateForm(field, star)}
            style={styles.subStarButton}
          >
            <Star
              size={32}
              color={
                Number(reviewForm[field]) >= star
                  ? COLORS.mediumBrown
                  : "#D1D5DB"
              }
              fill={
                Number(reviewForm[field]) >= star
                  ? COLORS.mediumBrown
                  : "transparent"
              }
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={showModal}
      onRequestClose={handleClose}
    >
      <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
        <Animated.View
          style={[
            styles.bottomSheet,
            { paddingBottom: Math.max(insets.bottom, 24) },
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={handleClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.stepIndicator}>Passo {reviewStep} de 3</Text>
          </View>

          {reviewStep === 1 && (
            <View>
              <Text style={styles.stepTitle}>Como foi sua experiência?</Text>
              <Text style={styles.stepSubtitle}>
                O que você foi fazer no {coffeeName}?
              </Text>
              <View style={styles.optionsWrap}>
                {CONTEXT_OPTIONS.map((ctx) => (
                  <TouchableOpacity
                    key={ctx.value}
                    style={[
                      styles.optionPill,
                      reviewForm.context === ctx.value &&
                        styles.optionPillActive,
                    ]}
                    onPress={() => updateForm("context", ctx.value)}
                  >
                    <Text
                      style={[
                        styles.optionPillText,
                        reviewForm.context === ctx.value &&
                          styles.optionPillTextActive,
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
                  <TouchableOpacity
                    key={star}
                    onPress={() => updateForm("overallRating", star)}
                  >
                    <Star
                      size={44}
                      color={
                        reviewForm.overallRating >= star
                          ? COLORS.mediumBrown
                          : "#D1D5DB"
                      }
                      fill={
                        reviewForm.overallRating >= star
                          ? COLORS.mediumBrown
                          : "transparent"
                      }
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity style={styles.primaryButton} onPress={nextStep}>
                <Text style={styles.primaryButtonText}>Continuar</Text>
              </TouchableOpacity>
            </View>
          )}

          {reviewStep === 2 && (
            <View>
              <Text style={styles.stepTitle}>Detalhes do Ambiente</Text>
              <Text style={styles.stepSubtitle}>
                Avalie os pontos importantes para o seu contexto.
              </Text>
              <ScrollView
                style={styles.phaseTwoScroll}
                showsVerticalScrollIndicator={false}
              >
                {reviewForm.context === "STUDY" && (
                  <>
                    {renderSubRating("Nível de Silêncio", "silenceRating")}
                    {renderSubRating(
                      "Tomadas Acessíveis",
                      "powerOutletsRating",
                    )}
                    {renderSubRating(
                      "Conforto dos Assentos",
                      "seatComfortRating",
                    )}
                    {renderSubRating("Qualidade do Wi-Fi", "wifiRating")}
                  </>
                )}
                {reviewForm.context === "REMOTE_WORK" && (
                  <>
                    {renderSubRating("Qualidade do Wi-Fi", "wifiRating")}
                    {renderSubRating(
                      "Tomadas Acessíveis",
                      "powerOutletsRating",
                    )}
                    {renderSubRating(
                      "Conforto dos Assentos",
                      "seatComfortRating",
                    )}
                    {renderSubRating(
                      "Tolerância a Longa Estadia",
                      "longStayToleranceRating",
                    )}
                  </>
                )}
                {reviewForm.context === "SOCIAL" && (
                  <>
                    {renderSubRating("Atmosfera e Ambiente", "ambienceRating")}
                    {renderSubRating("Volume/Seleção da Música", "musicRating")}
                    {renderSubRating(
                      "Conforto dos Assentos",
                      "seatComfortRating",
                    )}
                    {renderSubRating("Privacidade nas Mesas", "privacyRating")}
                  </>
                )}
                {reviewForm.context === "COFFEE_TASTING" && (
                  <>
                    {renderSubRating(
                      "Qualidade dos Grãos/Café",
                      "coffeeQualityRating",
                    )}
                    {renderSubRating(
                      "Variedade de Métodos",
                      "brewMethodsVarietyRating",
                    )}
                    {renderSubRating(
                      "Atendimento do Barista",
                      "baristaServiceRating",
                    )}
                    {renderSubRating("Custo-Benefício", "priceFairnessRating")}
                  </>
                )}
              </ScrollView>
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
            <View>
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
                  numberOfLines={4}
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
                  onPress={handleSubmit}
                >
                  <Text style={styles.primaryButtonText}>
                    Publicar Avaliação
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  cancelText: { color: "#EF4444", fontWeight: "600", fontSize: 16 },
  stepIndicator: { color: COLORS.darkBrown, fontWeight: "bold" },
  stepTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 8,
  },
  stepSubtitle: { fontSize: 15, color: COLORS.darkBrown, marginBottom: 24 },
  modalButtonRow: { flexDirection: "row", gap: 16, marginTop: 16 },
  secondaryButton: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 30,
    backgroundColor: COLORS.cream,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: COLORS.darkBrown,
    fontSize: 16,
    fontWeight: "bold",
  },
  primaryButton: {
    backgroundColor: COLORS.mediumBrown,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: { color: COLORS.cream, fontSize: 16, fontWeight: "bold" },
  optionsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 32,
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
  optionPillText: { color: COLORS.darkBrown, fontWeight: "600", fontSize: 14 },
  optionPillTextActive: { color: COLORS.white },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 40,
    justifyContent: "center",
  },
  phaseTwoScroll: { maxHeight: 300, marginBottom: 16 },
  subRatingContainer: { marginBottom: 24 },
  subRatingLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.black,
    marginBottom: 12,
  },
  subStarsRow: { flexDirection: "row", gap: 8 },
  subStarButton: { paddingRight: 4 },
  inputContainer: { marginBottom: 24 },
  textArea: {
    backgroundColor: COLORS.cream,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: COLORS.black,
    minHeight: 120,
  },
});
