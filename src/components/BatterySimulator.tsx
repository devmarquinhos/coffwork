import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  BatteryCharging,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react-native";
import { COLORS } from "@/styles/theme";

interface BatterySimulatorProps {
  contextStatistics: Record<string, Record<string, number>>;
}

export const BatterySimulator: React.FC<BatterySimulatorProps> = ({
  contextStatistics,
}) => {
  const [battery, setBattery] = useState<number>(50);
  const [hours, setHours] = useState<number>(2);

  const remoteData =
    contextStatistics?.REMOTE_WORK || contextStatistics?.STUDY || {};
  const outletRating = Number(remoteData["Tomadas"] || 3.0);

  const getVerdict = () => {
    if (battery === 20 && hours >= 2 && outletRating < 4.0) {
      return {
        text: `Risco alto! Com apenas 20% de bateria e ${hours}h de sessão com tomadas limitadas, sua carga vai esgotar rápido. Procure uma tomada logo!`,
        Icon: AlertTriangle,
      };
    }
    if (battery <= 50 && hours === 4 && outletRating < 4.0) {
      return {
        text: `Atenção: Uma sessão longa de ${hours}h com ${battery}% de bateria exige cautela, pois as tomadas aqui são medianas.`,
        Icon: AlertTriangle,
      };
    }
    if (outletRating >= 4.0) {
      return {
        text: `Excelente estrutura! O local tem ótimas tomadas. Com ${battery}% de bateria, você está totalmente seguro para suas ${hours}h.`,
        Icon: CheckCircle,
      };
    }
    if (hours === 1 && battery >= 50) {
      return {
        text: `Tranquilo! Para uma hora rapidinha com ${battery}% de bateria, você não precisará se preocupar com tomadas.`,
        Icon: CheckCircle,
      };
    }
    return {
      text: `Cenário moderado para ${hours}h de sessão com ${battery}% de bateria. Gerencie o uso para garantir a autonomia.`,
      Icon: BatteryCharging,
    };
  };

  const verdict = getVerdict();
  const VerdictIcon = verdict.Icon;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Clock size={18} color={COLORS.darkBrown} />
        <Text style={styles.title}>Simulador de Autonomia</Text>
      </View>
      <Text style={styles.subtitle}>
        Quanto tempo você consegue trabalhar aqui?
      </Text>

      <View style={styles.controlsRow}>
        <View style={styles.controlGroup}>
          <Text style={styles.controlLabel}>Bateria: {battery}%</Text>
          <View style={styles.buttonRow}>
            {[20, 50, 80].map((val) => (
              <TouchableOpacity
                key={val}
                style={[
                  styles.miniBtn,
                  battery === val && styles.activeMiniBtn,
                ]}
                onPress={() => setBattery(val)}
              >
                <Text
                  style={[
                    styles.miniBtnText,
                    battery === val && styles.activeMiniText,
                  ]}
                >
                  {val}%
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.controlGroup}>
          <Text style={styles.controlLabel}>Tempo: {hours}h</Text>
          <View style={styles.buttonRow}>
            {[1, 2, 4].map((h) => (
              <TouchableOpacity
                key={h}
                style={[styles.miniBtn, hours === h && styles.activeMiniBtn]}
                onPress={() => setHours(h)}
              >
                <Text
                  style={[
                    styles.miniBtnText,
                    hours === h && styles.activeMiniText,
                  ]}
                >
                  {h}h
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.verdictBox}>
        <VerdictIcon size={16} color={COLORS.darkBrown} />
        <Text style={styles.verdictText}>{verdict.text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cream,
    borderRadius: 16,
    padding: 16,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: "rgba(65, 45, 21, 0.15)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  title: { fontSize: 16, fontWeight: "bold", color: COLORS.darkBrown },
  subtitle: { fontSize: 12, color: "rgba(65, 45, 21, 0.7)", marginBottom: 14 },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
    gap: 12,
  },
  controlGroup: { flex: 1 },
  controlLabel: {
    fontSize: 12,
    color: COLORS.darkBrown,
    marginBottom: 6,
    fontWeight: "600",
  },
  buttonRow: { flexDirection: "row", gap: 6 },
  miniBtn: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: "rgba(65, 45, 21, 0.08)",
    borderRadius: 8,
    alignItems: "center",
  },
  activeMiniBtn: { backgroundColor: COLORS.darkBrown },
  miniBtnText: { fontSize: 12, color: COLORS.darkBrown, fontWeight: "bold" },
  activeMiniText: { color: COLORS.cream },
  verdictBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "rgba(65, 45, 21, 0.06)",
    gap: 8,
  },
  verdictText: {
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
    fontWeight: "600",
    color: COLORS.darkBrown,
  },
});
