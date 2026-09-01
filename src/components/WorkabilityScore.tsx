import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Zap, AlertCircle, CheckCircle2 } from "lucide-react-native";
import { COLORS } from "@/styles/theme";

interface WorkabilityScoreProps {
  contextStatistics: Record<string, Record<string, number>>;
}

const CRITERIA_WEIGHTS: Record<string, number> = {
  "Wi-Fi": 0.35,
  Tomadas: 0.25,
  Silêncio: 0.2,
  Conforto: 0.1,
  "Longa Permanência": 0.1,
};

export const WorkabilityScore: React.FC<WorkabilityScoreProps> = ({
  contextStatistics,
}) => {
  const computeScore = (): number => {
    const remoteData = contextStatistics?.REMOTE_WORK;
    if (!remoteData || Object.keys(remoteData).length === 0) return 0;

    let totalWeight = 0;
    let weightedSum = 0;

    Object.entries(remoteData).forEach(([criterion, value]) => {
      const weight = CRITERIA_WEIGHTS[criterion] || 0.1;
      weightedSum += Number(value) * weight;
      totalWeight += weight;
    });

    if (totalWeight === 0) return 0;

    const rawAverage = weightedSum / totalWeight;
    return Math.round((rawAverage / 5) * 100);
  };

  const score = computeScore();

  const getScoreMetaData = (val: number) => {
    if (val >= 85) {
      return {
        label: "Ultra Produtivo",
        description: "Estrutura impecável para devs e trabalho remoto longo.",
        color: "#2E7D32",
        bg: "#E8F5E9",
        Icon: CheckCircle2,
      };
    }
    if (val >= 70) {
      return {
        label: "Bom para Trabalho",
        description: "Atende bem para tarefas diárias e reuniões curtas.",
        color: "#1565C0",
        bg: "#E3F2FD",
        Icon: Zap,
      };
    }
    return {
      label: "Uso Ocasional",
      description: "Pode faltar tomadas, Wi-Fi estável ou silêncio.",
      color: "#D84315",
      bg: "#FBE9E7",
      Icon: AlertCircle,
    };
  };

  const meta = getScoreMetaData(score);
  const Icon = meta.Icon;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <Zap size={18} color={COLORS.cream} />
          <Text style={styles.cardTitle}>Produtivade</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: meta.bg }]}>
          <Icon size={12} color={meta.color} />
          <Text style={[styles.statusText, { color: meta.color }]}>
            {meta.label}
          </Text>
        </View>
      </View>

      <View style={styles.scoreRow}>
        <View style={styles.scoreDisplay}>
          <Text style={styles.scoreValue}>{score}</Text>
          <Text style={styles.scoreMax}>/100</Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${score}%`, backgroundColor: meta.color },
              ]}
            />
          </View>
          <Text style={styles.descriptionText}>{meta.description}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  titleGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.white,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  scoreDisplay: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: COLORS.white,
  },
  scoreMax: {
    fontSize: 14,
    color: "rgba(255,255,255,0.5)",
    marginLeft: 2,
  },
  progressContainer: {
    flex: 1,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  descriptionText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    lineHeight: 16,
  },
});
