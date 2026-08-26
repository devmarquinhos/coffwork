import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  ActivityIndicator,
  StatusBar,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../src/styles/theme";
import { dashboardStyles as styles } from "../../src/styles/dashboardStyles";
import {
  ArrowLeft,
  Plus,
  Trash2,
  MessageSquare,
  Star,
} from "lucide-react-native";
import { ownerService } from "../../src/services/ownerService";
import { api } from "@/services/api";
import * as ImagePicker from "expo-image-picker";

export default function OwnerDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [coffeeShopId, setCoffeeShopId] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<string[]>([]);

  const [reviews, setReviews] = useState<
    Array<{
      id: string | number;
      userName: string;
      overallRating: number;
      comment: string;
      context?: string;
      ownerReply: string | null;
    }>
  >([]);

  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, curr) => acc + curr.overallRating, 0) /
          reviews.length
        ).toFixed(1)
      : "0.0";

  const formatVisitContext = (context?: string) => {
    if (!context) return null;

    const map: Record<string, string> = {
      COFFEE_TASTING: "Degustação de Café",
      REMOTE_WORK: "Trabalho Remoto",
      WORK: "Trabalho / Estudo",
      SOCIAL: "Encontro Social",
      STUDY: "Estudar",
    };

    return map[context] || context;
  };

  useEffect(() => {
    async function loadOwnerData() {
      try {
        const shopResponse = await api.get("/coffee-shops/my-shop");
        const shopId = shopResponse.data.id;

        setCoffeeShopId(shopId);

        if (shopResponse.data.specialtyHighlights) {
          setHighlights(shopResponse.data.specialtyHighlights);
        }

        const reviewsData = await ownerService.getReviews(shopId);
        setReviews(reviewsData);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar os dados do painel.");
      }
    }
    loadOwnerData();
  }, []);

  const handlePickImageFromGallery = async () => {
    if (highlights.length >= 3) {
      Alert.alert(
        "Limite atingido",
        "Você pode cadastrar no máximo 3 fotos como carro-chefe.",
      );
      return;
    }

    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permissão negada",
        "Precisamos de acesso à sua galeria para escolher a foto.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
      const selectedUri = result.assets[0].uri;

      if (!coffeeShopId) {
        Alert.alert("Aguarde", "ID da cafeteria não carregado.");
        return;
      }

      try {
        setLoading(true);

        await ownerService.addHighlight(coffeeShopId, selectedUri);

        setHighlights([...highlights, selectedUri]);
        Alert.alert("Sucesso", "Foto do carro-chefe adicionada!");
      } catch (error: any) {
        Alert.alert(
          "Erro",
          error.response?.data?.message ||
            "Não foi possível salvar o destaque.",
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRemoveHighlight = (index: number) => {
    const updated = highlights.filter((_, i) => i !== index);
    setHighlights(updated);
  };

  const handleOpenReplyModal = (reviewId: string) => {
    setSelectedReviewId(reviewId);
    setReplyText("");
    setIsReplyModalOpen(true);
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) {
      Alert.alert("Atenção", "Digite uma resposta.");
      return;
    }

    // Trava de segurança: Garante que temos o ID do review e da cafeteria
    if (!selectedReviewId || !coffeeShopId) return;

    try {
      setLoading(true);

      await ownerService.replyToReview(
        coffeeShopId,
        selectedReviewId,
        replyText,
      );

      setReviews((prev) =>
        prev.map((rev) =>
          rev.id.toString() === selectedReviewId
            ? { ...rev, ownerReply: replyText }
            : rev,
        ),
      );

      setIsReplyModalOpen(false);
      Alert.alert("Sucesso", "Resposta enviada com sucesso!");
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.response?.data?.message || "Não foi possível enviar a resposta.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color={COLORS.black} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Painel do Proprietário</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Carro-Chefe (Até 3 fotos)</Text>
        <Text style={styles.sectionSubtitle}>
          Destaque os principais produtos da sua cafeteria ({highlights.length}
          /3)
        </Text>

        <View style={styles.highlightsGrid}>
          {highlights.map((url, index) => (
            <View key={index} style={styles.highlightCard}>
              <Image source={{ uri: url }} style={styles.highlightImage} />
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleRemoveHighlight(index)}
              >
                <Trash2 color={COLORS.white} size={16} />
              </TouchableOpacity>
            </View>
          ))}

          {highlights.length < 3 && (
            <TouchableOpacity
              style={styles.addHighlightButton}
              onPress={handlePickImageFromGallery}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.mediumBrown} />
              ) : (
                <>
                  <Plus color={COLORS.mediumBrown} size={28} />
                  <Text style={styles.addText}>Galeria</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>Avaliações dos Clientes</Text>
            <Text style={styles.sectionSubtitleWrapper}>
              Responda aos comentários recebidos
            </Text>
          </View>
          {reviews.length > 0 && (
            <View style={styles.averageBadge}>
              <Star
                color={COLORS.mediumBrown}
                size={18}
                fill={COLORS.mediumBrown}
              />
              <Text style={styles.averageText}>{averageRating}</Text>
            </View>
          )}
        </View>

        {reviews.map((rev) => {
          const translatedContext = formatVisitContext(rev.context);
          return (
            <View key={rev.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View>
                  <Text style={styles.reviewerName}>{rev.userName}</Text>
                  {translatedContext && (
                    <Text style={styles.contextText}>
                      Motivo: {translatedContext}
                    </Text>
                  )}
                </View>
                <View style={styles.ratingBadge}>
                  <Star
                    color={COLORS.mediumBrown}
                    size={14}
                    fill={COLORS.mediumBrown}
                  />
                  <Text style={styles.ratingText}>
                    {rev.overallRating ?? 0}
                  </Text>
                </View>
              </View>

              <Text style={styles.reviewComment}>{rev.comment}</Text>

              {rev.ownerReply ? (
                <View style={styles.replyBox}>
                  <Text style={styles.replyTitle}>Sua Resposta:</Text>
                  <Text style={styles.replyContent}>{rev.ownerReply}</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.replyButton}
                  onPress={() => handleOpenReplyModal(rev.id.toString())}
                >
                  <MessageSquare color={COLORS.mediumBrown} size={16} />
                  <Text style={styles.replyButtonText}>
                    Responder avaliação
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </ScrollView>

      <Modal
        visible={isReplyModalOpen}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Responder Cliente</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Escreva sua resposta oficial..."
              placeholderTextColor={COLORS.mediumBrown}
              multiline
              value={replyText}
              onChangeText={setReplyText}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setIsReplyModalOpen(false)}
                disabled={loading}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={handleSendReply}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.white} size="small" />
                ) : (
                  <Text style={styles.modalConfirmText}>Enviar Resposta</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
