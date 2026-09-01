import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { COLORS } from "@/styles/theme";
import { editProfileStyles as styles } from "@/styles/editProfileStyles";
import { ArrowLeft, User, MapPin, Check } from "lucide-react-native";
import { useAuthStore } from "@/store/useAuthStore";
import { userService } from "@/services/userService";

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore() as any;

  const [name, setName] = useState(user?.name || "");
  const [city, setCity] = useState(user?.city || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !city) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      const updatedUser = await userService.updateProfile({ name, city });

      if (updateUser) {
        updateUser(updatedUser);
      }

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      router.back();
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      Alert.alert("Erro", "Não foi possível atualizar os dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft color={COLORS.black} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar Perfil</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Como deseja ser chamado?</Text>
            <View style={styles.inputContainer}>
              <User
                color={COLORS.darkBrown}
                size={20}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Seu nome"
                placeholderTextColor="rgba(65, 45, 21, 0.4)"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Sua Cidade</Text>
            <View style={styles.inputContainer}>
              <MapPin
                color={COLORS.darkBrown}
                size={20}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={city}
                onChangeText={setCity}
                placeholder="Ex: Salvador, Camaçari..."
                placeholderTextColor="rgba(65, 45, 21, 0.4)"
              />
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.cream} />
            ) : (
              <>
                <Text style={styles.saveButtonText}>Salvar Alterações</Text>
                <Check color={COLORS.cream} size={20} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
