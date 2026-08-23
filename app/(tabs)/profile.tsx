import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  User as UserIcon,
  Mail,
  MapPin,
  LogOut,
  Edit3,
  LogIn,
} from "lucide-react-native";
import { COLORS } from "../../src/styles/theme";
import { useAuthStore } from "../../src/store/useAuthStore";
import { Redirect } from "expo-router";

export default function Profile() {
  const { user, logout } = useAuthStore();

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Meu Perfil</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>

        <Text style={styles.sectionTitle}>Meus Dados</Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <UserIcon color={COLORS.mediumBrown} size={20} />
            </View>
            <View>
              <Text style={styles.infoLabel}>Nome Completo</Text>
              <Text style={styles.infoValue}>{user.name}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Mail color={COLORS.mediumBrown} size={20} />
            </View>
            <View>
              <Text style={styles.infoLabel}>E-mail</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <MapPin color={COLORS.mediumBrown} size={20} />
            </View>
            <View>
              <Text style={styles.infoLabel}>Cidade</Text>
              <Text style={styles.infoValue}>{user.city}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Ações</Text>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => alert("Em breve: Edição de Perfil")}
        >
          <Edit3 color={COLORS.darkBrown} size={20} />
          <Text style={styles.actionButtonText}>Editar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.logoutButton]}
          onPress={logout}
        >
          <LogOut color="#DC2626" size={20} />
          <Text style={styles.logoutButtonText}>Sair da Conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white },
  container: { flex: 1, paddingHorizontal: 24 },
  header: { paddingTop: 20, paddingBottom: 24 },
  headerTitle: { fontSize: 28, fontWeight: "bold", color: COLORS.black },
  profileCard: { alignItems: "center", marginBottom: 40 },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.mediumBrown,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: { fontSize: 40, fontWeight: "bold", color: COLORS.white },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 4,
  },
  userEmail: { fontSize: 16, color: COLORS.darkBrown },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 16,
  },
  infoContainer: {
    backgroundColor: "#F8F8F8",
    borderRadius: 20,
    padding: 20,
    marginBottom: 40,
  },
  infoRow: { flexDirection: "row", alignItems: "center" },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(65, 45, 21, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  infoLabel: { fontSize: 13, color: COLORS.darkBrown, marginBottom: 2 },
  infoValue: { fontSize: 16, color: COLORS.black, fontWeight: "500" },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginVertical: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  actionButtonText: {
    fontSize: 16,
    color: COLORS.darkBrown,
    fontWeight: "600",
    marginLeft: 12,
  },
  logoutButton: { backgroundColor: "#FEF2F2" },
  logoutButtonText: {
    fontSize: 16,
    color: "#DC2626",
    fontWeight: "600",
    marginLeft: 12,
  },
});
