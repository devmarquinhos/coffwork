import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Lightbulb, ArrowUpRight } from "lucide-react-native";
import { COLORS } from "@/styles/theme";

interface OwnerInsightsProps {
  contextStatistics: Record<string, Record<string, number>>;
}

export const OwnerInsights: React.FC<OwnerInsightsProps> = ({
  contextStatistics,
}) => {
  const generateInsights = () => {
    const remote = contextStatistics?.REMOTE_WORK || {};
    const insights = [];

    const wifi = Number(remote["Wi-Fi"] || 5);
    const outlets = Number(remote["Tomadas"] || 5);
    const silence = Number(remote["Silêncio"] || 5);

    if (wifi < 4.0) {
      insights.push({
        type: "warning",
        title: "Melhore a Conexão Wi-Fi",
        action:
          "Notas de Wi-Fi abaixo de 4.0 reduzem o fluxo de devs em até 40%. Considere um plano dedicado.",
      });
    }

    if (outlets < 4.0) {
      insights.push({
        type: "warning",
        title: "Disponibilize mais Tomadas",
        action:
          "Clientes de trabalho remoto citam falta de tomadas como principal motivo de troca de local.",
      });
    }

    if (silence < 3.8) {
      insights.push({
        type: "info",
        title: "Ajuste o Som Ambiente",
        action:
          "Níveis altos de ruído impactam reuniões remotas. Considere criar uma 'zona de foco'.",
      });
    }

    if (insights.length === 0) {
      insights.push({
        type: "success",
        title: "Excelente Estrutura!",
        action:
          "Sua cafeteria atende perfeitamente os requisitos para trabalhadores remotos.",
      });
    }

    return insights;
  };

  const insights = generateInsights();

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Lightbulb color="#FFB800" size={20} />
        <Text style={styles.title}>Recomendações para o Espaço</Text>
      </View>

      {insights.map((item, index) => (
        <View key={index} style={styles.itemRow}>
          <ArrowUpRight
            size={16}
            color={COLORS.cream}
            style={{ marginTop: 2 }}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemAction}>{item.action}</Text>
          </View>
        </View>
      ))}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.white,
  },
  itemRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: COLORS.cream,
  },
  itemAction: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginTop: 2,
    lineHeight: 16,
  },
});
