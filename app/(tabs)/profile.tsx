import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  User as UserIcon,
  Mail,
  MapPin,
  LogOut,
  Edit3,
  Store,
} from "lucide-react-native";
import { COLORS } from "../../src/styles/theme";
import { profileStyles as styles } from "../../src/styles/profileStyles";
import { useAuthStore } from "../../src/store/useAuthStore";
import { Redirect, router } from "expo-router";

export default function Profile() {
  const { user, logout } = useAuthStore();

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
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
          onPress={() => router.push("/profile/edit" as any)}
        >
          <Edit3 color={COLORS.darkBrown} size={20} />
          <Text style={styles.actionButtonText}>Editar Perfil</Text>
        </TouchableOpacity>

        {user?.role === "OWNER" && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/owner/dashboard" as any)}
          >
            <Store color={COLORS.mediumBrown} size={20} />
            <Text
              style={[
                styles.actionButtonText,
                { color: COLORS.mediumBrown, fontWeight: "bold" },
              ]}
            >
              Painel da Minha Cafeteria
            </Text>
          </TouchableOpacity>
        )}

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
