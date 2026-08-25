import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authService } from "../../src/services/authService";
import { useAuthStore } from "../../src/store/useAuthStore";
import { COLORS } from "../../src/styles/theme";
import { editProfileStyles as styles } from "../../src/styles/loginStyles";

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

      router.replace("/(tabs)" as any);
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

        <TouchableOpacity
          style={styles.registerContainer}
          onPress={() => router.push("/(auth)/register" as any)}
        >
          <Text style={styles.registerTextNormal}>Não tem uma conta? </Text>
          <Text style={styles.registerTextBold}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
