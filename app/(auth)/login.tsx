import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authService } from "../../src/services/authService";
import { useAuthStore } from "../../src/store/useAuthStore";
import { COLORS } from "../../src/styles/theme";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setLogin = useAuthStore((state) => state.login);

  const handleLogin = async () => {
    if (!email) return alert("Por favor, digite seu e-mail.");
    if (!password) return alert("Por favor, digite sua senha.");

    setLoading(true);
    try {
      const data = await authService.login(email, password);
      console.log("Resposta do Spring Boot:", data);

      if (!data || !data.token) {
        alert("Erro: O backend não devolveu o token JWT.");
        return;
      }

      setLogin(data.user, data.token);

      router.replace("/");
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Falha ao fazer login. Verifique se a API está rodando.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Bem-vindo ao Coffwork</Text>
        <Text style={styles.subtitle}>Faça login para continuar</Text>

        <TextInput
          style={styles.input}
          placeholder="Seu e-mail"
          placeholderTextColor={COLORS.mediumBrown}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Sua senha"
          placeholderTextColor={COLORS.mediumBrown}
          keyboardType="default"
          autoCapitalize="none"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white },
  container: { flex: 1, paddingHorizontal: 24, justifyContent: "center" },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 8,
  },
  subtitle: { fontSize: 16, color: COLORS.darkBrown, marginBottom: 40 },
  input: {
    backgroundColor: "#F8F8F8",
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  button: {
    backgroundColor: COLORS.mediumBrown,
    padding: 18,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: { color: COLORS.white, fontSize: 16, fontWeight: "bold" },
});
