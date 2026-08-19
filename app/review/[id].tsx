import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Star, ArrowLeft } from "lucide-react-native";
import { COLORS } from "../../src/styles/theme";

type VisitContext = "STUDY" | "REMOTE_WORK" | "SOCIAL" | "COFFEE_TASTING";

const RatingStars = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (val: number) => void;
}) => (
  <View style={styles.ratingRow}>
    <Text style={styles.ratingLabel}>{label}</Text>
    <View style={styles.starsContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => onChange(star)}>
          <Star
            color={star <= value ? COLORS.mediumBrown : "#D3CFC1"}
            fill={star <= value ? COLORS.mediumBrown : "transparent"}
            size={28}
          />
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

export default function ReviewScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [context, setContext] = useState<VisitContext>("STUDY");
  const [overallRating, setOverallRating] = useState(0);
  const [comment, setComment] = useState("");

  const [subRatings, setSubRatings] = useState<Record<string, number>>({});

  const handleSubRating = (key: string, value: number) => {
    setSubRatings((prev) => ({ ...prev, [key]: value }));
  };

  const renderDynamicFields = () => {
    switch (context) {
      case "STUDY":
        return (
          <>
            <RatingStars
              label="Silêncio"
              value={subRatings["silenceRating"] || 0}
              onChange={(val) => handleSubRating("silenceRating", val)}
            />
            <RatingStars
              label="Tomadas"
              value={subRatings["powerOutletsRating"] || 0}
              onChange={(val) => handleSubRating("powerOutletsRating", val)}
            />
            <RatingStars
              label="Conforto"
              value={subRatings["seatComfortRating"] || 0}
              onChange={(val) => handleSubRating("seatComfortRating", val)}
            />
            <RatingStars
              label="Wi-Fi"
              value={subRatings["wifiRating"] || 0}
              onChange={(val) => handleSubRating("wifiRating", val)}
            />
          </>
        );
      case "REMOTE_WORK":
        return (
          <>
            <RatingStars
              label="Wi-Fi"
              value={subRatings["wifiRating"] || 0}
              onChange={(val) => handleSubRating("wifiRating", val)}
            />
            <RatingStars
              label="Tomadas"
              value={subRatings["powerOutletsRating"] || 0}
              onChange={(val) => handleSubRating("powerOutletsRating", val)}
            />
            <RatingStars
              label="Conforto"
              value={subRatings["seatComfortRating"] || 0}
              onChange={(val) => handleSubRating("seatComfortRating", val)}
            />
            <RatingStars
              label="Longa Estadia"
              value={subRatings["longStayToleranceRating"] || 0}
              onChange={(val) =>
                handleSubRating("longStayToleranceRating", val)
              }
            />
          </>
        );
      case "SOCIAL":
        return (
          <>
            <RatingStars
              label="Ambiente"
              value={subRatings["ambienceRating"] || 0}
              onChange={(val) => handleSubRating("ambienceRating", val)}
            />
            <RatingStars
              label="Música"
              value={subRatings["musicRating"] || 0}
              onChange={(val) => handleSubRating("musicRating", val)}
            />
            <RatingStars
              label="Conforto"
              value={subRatings["seatComfortRating"] || 0}
              onChange={(val) => handleSubRating("seatComfortRating", val)}
            />
            <RatingStars
              label="Privacidade"
              value={subRatings["privacyRating"] || 0}
              onChange={(val) => handleSubRating("privacyRating", val)}
            />
          </>
        );
      case "COFFEE_TASTING":
        return (
          <>
            <RatingStars
              label="Qualidade do Café"
              value={subRatings["coffeeQualityRating"] || 0}
              onChange={(val) => handleSubRating("coffeeQualityRating", val)}
            />
            <RatingStars
              label="Variedade de Métodos"
              value={subRatings["brewMethodsVarietyRating"] || 0}
              onChange={(val) =>
                handleSubRating("brewMethodsVarietyRating", val)
              }
            />
            <RatingStars
              label="Barista"
              value={subRatings["baristaServiceRating"] || 0}
              onChange={(val) => handleSubRating("baristaServiceRating", val)}
            />
            <RatingStars
              label="Preço Justo"
              value={subRatings["priceFairnessRating"] || 0}
              onChange={(val) => handleSubRating("priceFairnessRating", val)}
            />
          </>
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color={COLORS.black} size={24} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Avaliar Experiência</Text>

        <View style={{ width: 24 }} />
      </View>
      {/* Espaçador invisível para centralizar o texto */}

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Escolha do Contexto */}
        <Text style={styles.sectionTitle}>
          Qual foi o contexto da sua visita?
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.contextScroll}
        >
          {[
            { id: "STUDY", label: "Estudar" },
            { id: "REMOTE_WORK", label: "Trabalhar" },
            { id: "SOCIAL", label: "Rolê Social" },
            { id: "COFFEE_TASTING", label: "Apreciar Café" },
          ].map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.contextPill,
                context === item.id && styles.contextPillActive,
              ]}
              onPress={() => setContext(item.id as VisitContext)}
            >
              <Text
                style={[
                  styles.contextPillText,
                  context === item.id && styles.contextPillTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* overral rating */}
        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Nota Geral</Text>
        <RatingStars
          label="Experiência Completa"
          value={overallRating}
          onChange={setOverallRating}
        />

        {/* specific ratings */}
        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Avalie os detalhes</Text>
        {renderDynamicFields()}

        {/* opt comment */}
        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Comentário (Opcional)</Text>
        <TextInput
          style={styles.textInput}
          multiline
          numberOfLines={4}
          placeholder="Conte um pouco sobre sua experiência..."
          placeholderTextColor={COLORS.mediumBrown}
          value={comment}
          onChangeText={setComment}
        />

        {/* submit btn */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            overallRating === 0 && styles.submitButtonDisabled,
          ]}
          disabled={overallRating === 0}
          onPress={() => alert("Avaliação pronta para ser enviada para a API!")}
        >
          <Text style={styles.submitButtonText}>Enviar Avaliação</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },
  backButton: { padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: COLORS.black },
  container: { flex: 1, paddingHorizontal: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 16,
  },
  contextScroll: { marginBottom: 24 },
  contextPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "transparent",
  },
  contextPillActive: { backgroundColor: COLORS.mediumBrown },
  contextPillText: { color: COLORS.darkBrown, fontWeight: "600" },
  contextPillTextActive: { color: COLORS.white },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginVertical: 24,
  },
  ratingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  ratingLabel: { fontSize: 16, color: COLORS.darkBrown, fontWeight: "500" },
  starsContainer: { flexDirection: "row", gap: 4 },
  textInput: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: COLORS.darkBrown,
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 30,
  },
  submitButton: {
    backgroundColor: COLORS.mediumBrown,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 40,
  },
  submitButtonDisabled: { opacity: 0.5 },
  submitButtonText: { color: COLORS.cream, fontSize: 16, fontWeight: "bold" },
});
