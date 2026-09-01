import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Star,
  Target,
  BarChart,
  Layers,
  TrendingUp,
  BookOpen,
  Laptop,
  Users,
  Coffee,
  Wifi,
  Plug,
  Clock,
  VolumeX,
  Music,
  Shield,
  Sun,
  Beaker,
  Smile,
  DollarSign,
  Heart,
} from "lucide-react-native";
import { ownerService, CoffeeShopStatistics } from "@/services/ownerService";
import { COLORS } from "@/styles/theme";
import { statisticsStyles as styles } from "@/styles/statisticsStyles";
import { ShopBadges } from "@/components/shopBadges";
import { WorkabilityScore } from "@/components/WorkabilityScore";
import { Share } from "react-native";
import { Share2 } from "lucide-react-native";

export default function StatisticsScreen() {
  const { shopId } = useLocalSearchParams();
  const router = useRouter();
  const [stats, setStats] = useState<CoffeeShopStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedContext, setSelectedContext] = useState<string>("REMOTE_WORK");

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      if (shopId) {
        const data = await ownerService.getStatistics(shopId as string);
        setStats(data);

        const contexts = Object.keys(data.contextStatistics);
        if (contexts.length > 0) setSelectedContext(contexts[0]);
      }
    } catch (error) {
      console.error("Erro ao carregar estatísticas", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={COLORS.cream} />
      </View>
    );
  }

  if (!stats) return null;

  const contextLabels: Record<string, string> = {
    STUDY: "Estudo",
    REMOTE_WORK: "Trabalho",
    SOCIAL: "Social",
    COFFEE_TASTING: "Degustação",
  };

  const getContextIcon = (ctx: string, color: string) => {
    switch (ctx) {
      case "STUDY":
        return <BookOpen color={color} size={16} />;
      case "REMOTE_WORK":
        return <Laptop color={color} size={16} />;
      case "SOCIAL":
        return <Users color={color} size={16} />;
      case "COFFEE_TASTING":
        return <Coffee color={color} size={16} />;
      default:
        return null;
    }
  };

  const getCriterionIcon = (name: string, color: string) => {
    switch (name) {
      case "Wi-Fi":
        return <Wifi color={color} size={18} />;
      case "Tomadas":
        return <Plug color={color} size={18} />;
      case "Conforto":
        return <Heart color={color} size={18} />;
      case "Silêncio":
        return <VolumeX color={color} size={18} />;
      case "Longa Permanência":
        return <Clock color={color} size={18} />;
      case "Ambiente":
        return <Sun color={color} size={18} />;
      case "Música":
        return <Music color={color} size={18} />;
      case "Privacidade":
        return <Shield color={color} size={18} />;
      case "Qualidade do Café":
        return <Coffee color={color} size={18} />;
      case "Variedade de Métodos":
        return <Beaker color={color} size={18} />;
      case "Atendimento":
        return <Smile color={color} size={18} />;
      case "Preço Justo":
        return <DollarSign color={color} size={18} />;
      default:
        return <Star color={color} size={18} />;
    }
  };

  const handleShareStats = async () => {
    try {
      await Share.share({
        message: `☕ Confira o desempenho da nossa cafeteria no Coffwork!\nNota média: ${stats.averageRating.toFixed(1)} ⭐ com ${stats.totalReviews} avaliações.`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const contextData = stats.contextStatistics[selectedContext] || {};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerSideButton}
        >
          <ArrowLeft color={COLORS.white} size={24} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Análise da Cafeteria</Text>

        <TouchableOpacity
          onPress={handleShareStats}
          style={styles.headerSideButton}
        >
          <Share2 color={COLORS.white} size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Target color={COLORS.cream} size={20} style={{ marginRight: 8 }} />
            <Text style={[styles.cardTitle, { marginBottom: 0 }]}>
              Visão Geral
            </Text>
          </View>

          <View style={styles.overviewRow}>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>
                {stats.averageRating.toFixed(1)}{" "}
              </Text>
              <Text style={styles.overviewLabel}>Nota Média</Text>
            </View>
            <View style={styles.overviewDivider} />
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>{stats.totalReviews}</Text>
              <Text style={styles.overviewLabel}>Avaliações</Text>
            </View>
          </View>

          <ShopBadges contextStatistics={stats.contextStatistics} />
        </View>

        <WorkabilityScore contextStatistics={stats.contextStatistics} />

        <View style={styles.card}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <BarChart
              color={COLORS.cream}
              size={20}
              style={{ marginRight: 8 }}
            />
            <Text style={[styles.cardTitle, { marginBottom: 0 }]}>
              Distribuição de Notas
            </Text>
          </View>

          {[5, 4, 3, 2, 1].map((stars) => {
            const count = stats.ratingDistribution[stars] || 0;
            const maxCount = Math.max(
              ...Object.values(stats.ratingDistribution).map(Number),
              1,
            );
            const percentage = (count / maxCount) * 100;

            return (
              <View key={stars} style={styles.barRow}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    width: 50,
                    marginRight: 12,
                  }}
                >
                  <Text style={styles.starText}>{stars}</Text>
                  <Star
                    size={14}
                    color="#FFD700"
                    fill="#FFD700"
                    style={{ marginLeft: 4 }}
                  />
                </View>
                <View style={styles.barBackground}>
                  <View style={[styles.barFill, { width: `${percentage}%` }]} />
                </View>
                <Text style={styles.countText}>{count}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.card}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Layers color={COLORS.cream} size={20} style={{ marginRight: 8 }} />
            <Text style={[styles.cardTitle, { marginBottom: 0 }]}>
              Médias por Contexto
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.contextTabs}
          >
            {Object.keys(stats.contextStatistics).map((ctx) => {
              const isActive = selectedContext === ctx;
              const iconColor = isActive
                ? COLORS.cream
                : "rgba(255,255,255,0.6)";

              return (
                <TouchableOpacity
                  key={ctx}
                  style={[
                    styles.tab,
                    isActive && styles.tabActive,
                    { flexDirection: "row", alignItems: "center", gap: 6 },
                  ]}
                  onPress={() => setSelectedContext(ctx)}
                >
                  {getContextIcon(ctx, iconColor)}
                  <Text
                    style={[styles.tabText, isActive && styles.tabTextActive]}
                  >
                    {contextLabels[ctx] || ctx}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {Object.entries(contextData).length === 0 ? (
            <Text style={styles.emptyText}>Sem dados para este contexto.</Text>
          ) : (
            Object.entries(contextData).map(([criterion, value]) => (
              <View
                key={criterion}
                style={[styles.criterionRow, { alignItems: "center" }]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  {getCriterionIcon(criterion, "rgba(255,255,255,0.7)")}
                  <Text style={styles.criterionName}>{criterion}</Text>
                </View>
                <Text style={styles.criterionValue}>
                  {Number(value).toFixed(1)}
                </Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.card}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <TrendingUp
              color={COLORS.cream}
              size={20}
              style={{ marginRight: 8 }}
            />
            <Text style={[styles.cardTitle, { marginBottom: 0 }]}>
              Evolução Mensal (Média)
            </Text>
          </View>

          {stats.monthlyAverage.length === 0 ? (
            <Text style={styles.emptyText}>Sem dados históricos.</Text>
          ) : (
            <View style={styles.timelineContainer}>
              {stats.monthlyAverage.map((item, index) => (
                <View key={index} style={styles.timelineRow}>
                  <Text style={styles.timelineMonth}>
                    {item.month.substring(5)}/{item.month.substring(0, 4)}
                  </Text>
                  <View style={styles.timelineBarBg}>
                    <View
                      style={[
                        styles.timelineBarFill,
                        { width: `${(item.average / 5) * 100}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.timelineAvg}>
                    {item.average.toFixed(1)}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
