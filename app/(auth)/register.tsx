import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { COLORS } from "../../src/styles/theme";
import { registerStyles as styles } from "../../src/styles/registerStyles";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Mail,
  Lock,
  MapPin,
  User,
  Store,
} from "lucide-react-native";
import { authService } from "../../src/services/authService";

export default function RegisterScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");

  const handleNext = () => {
    if (step === 1) {
      if (!email || !password || !confirmPassword) {
        Alert.alert("Atenção", "Preencha todos os campos para continuar.");
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert(
          "Atenção",
          "As senhas não coincidem. Verifique e tente novamente.",
        );
        return;
      }
    } else if (step === 2) {
      if (!city) {
        Alert.alert("Atenção", "Informe a sua cidade.");
        return;
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handleFinishRegister = async () => {
    if (!name) {
      Alert.alert("Atenção", "Por favor, diga como deseja ser chamado.");
      return;
    }

    try {
      setLoading(true);

      await authService.register({
        name,
        email,
        password,
        city,
        role: "USER",
      });

      Alert.alert(
        "Sucesso!",
        `Bem-vindo(a), ${name}! Conta criada com sucesso.`,
      );

      router.replace("/login" as any);
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível realizar o cadastro. O e-mail pode já estar em uso.",
      );
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
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowLeft color={COLORS.white} size={24} />
          </TouchableOpacity>
          <Text style={styles.stepIndicator}>Passo {step} de 3</Text>
        </View>

        <View style={styles.content}>
          {step === 1 && (
            <View style={styles.stepContainer}>
              <Text style={styles.title}>Crie sua conta</Text>
              <Text style={styles.subtitle}>
                Para começar, informe seu e-mail e escolha uma senha segura.
              </Text>

              <View style={styles.inputContainer}>
                <Mail color={COLORS.cream} size={20} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Seu melhor e-mail"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputContainer}>
                <Lock color={COLORS.cream} size={20} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Sua senha"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <View style={styles.inputContainer}>
                <Lock color={COLORS.cream} size={20} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirme sua senha"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>
            </View>
          )}

          {step === 2 && (
            <View style={styles.stepContainer}>
              <Text style={styles.title}>Onde você está?</Text>
              <Text style={styles.subtitle}>
                Informe sua cidade para encontrarmos os melhores grãos e
                cafeterias perto de você.
              </Text>

              <View style={styles.inputContainer}>
                <MapPin
                  color={COLORS.cream}
                  size={20}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Salvador, Camaçari..."
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={city}
                  onChangeText={setCity}
                />
              </View>
            </View>
          )}

          {step === 3 && (
            <View style={styles.stepContainer}>
              <Text style={styles.title}>Como podemos te chamar?</Text>
              <Text style={styles.subtitle}>
                Esse será o nome exibido no seu perfil e nas suas avaliações
                pela comunidade.
              </Text>

              <View style={styles.inputContainer}>
                <User color={COLORS.cream} size={20} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Seu apelido ou nome"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={name}
                  onChangeText={setName}
                  autoFocus
                />
              </View>
            </View>
          )}

          <View style={styles.footer}>
            {step < 3 ? (
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleNext}
              >
                <Text style={styles.primaryButtonText}>Avançar</Text>
                <ArrowRight color={COLORS.cream} size={20} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleFinishRegister}
              >
                <Text style={styles.primaryButtonText}>Finalizar Cadastro</Text>
                <Check color={COLORS.cream} size={20} />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 16,
                gap: 8,
              }}
              onPress={() => router.push("/owner-register" as any)}
            >
              <Store color={COLORS.cream} size={18} />
              <Text
                style={{
                  color: COLORS.cream,
                  fontWeight: "600",
                  textDecorationLine: "underline",
                }}
              >
                Possui uma cafeteria? Cadastre aqui
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
