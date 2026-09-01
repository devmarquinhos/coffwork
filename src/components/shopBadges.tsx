import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Laptop, VolumeX, Coffee, LucideIcon } from "lucide-react-native";

interface ShopBadgesProps {
  contextStatistics: Record<string, Record<string, number>>;
}

interface BadgeItem {
  id: string;
  label: string;
  icon: LucideIcon;
  bg: string;
  color: string;
}

export const ShopBadges: React.FC<ShopBadgesProps> = ({
  contextStatistics,
}) => {
  const badges: BadgeItem[] = [];

  const getAvg = (stats?: Record<string, number>) => {
    if (!stats) return 0;
    const values = Object.values(stats).map(Number);
    return values.reduce((a, b) => a + b, 0) / (values.length || 1);
  };

  if (getAvg(contextStatistics?.REMOTE_WORK) >= 4.0) {
    badges.push({
      id: "devs",
      label: "Paradise for Devs",
      icon: Laptop,
      bg: "#E8F5E9",
      color: "#2E7D32",
    });
  }

  if (getAvg(contextStatistics?.STUDY) >= 4.0) {
    badges.push({
      id: "focus",
      label: "Zona de Foco",
      icon: VolumeX,
      bg: "#E3F2FD",
      color: "#1565C0",
    });
  }

  if (getAvg(contextStatistics?.COFFEE_TASTING) >= 4.0) {
    badges.push({
      id: "coffee",
      label: "Café Especial",
      icon: Coffee,
      bg: "#FFF3E0",
      color: "#E65100",
    });
  }

  if (badges.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SELOS CONQUISTADOS</Text>
      <View style={styles.badgeWrapper}>
        {badges.map((b) => {
          const Icon = b.icon;
          return (
            <View key={b.id} style={[styles.badge, { backgroundColor: b.bg }]}>
              <Icon size={14} color={b.color} />
              <Text style={[styles.badgeText, { color: b.color }]}>
                {b.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  title: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 8,
    fontWeight: "600",
  },
  badgeWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "bold",
  },
});
