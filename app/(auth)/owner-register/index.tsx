import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import {
  ArrowLeft,
  Camera,
  Plus,
  Trash2,
  Check,
  User,
  Mail,
  Lock,
  Store,
  MapPin,
  FileText,
  Clock,
} from "lucide-react-native";

import { COLORS } from "@/styles/theme";
import { styles } from "@/styles/ownerRegistrationStyles";
import { ownerService } from "@/services/ownerService";

export default function OwnerRegisterWizard() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    shopName: "",
    shortDescription: "",
    address: "",
    district: "",
    city: "",
    openingTime: "08:00",
    closingTime: "20:00",
    hasWifi: true,
    hasPowerOutlets: false,
    coverImageUri: "",
    highlightsUris: [] as string[],
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (
      step === 1 &&
      (!formData.userName || !formData.email || !formData.password)
    ) {
      Alert.alert(
        "Campos obrigatórios",
        "Preencha todos os campos do usuário.",
      );
      return;
    }
    if (
      step === 2 &&
      (!formData.shopName ||
        !formData.district ||
        !formData.city ||
        !formData.openingTime ||
        !formData.closingTime)
    ) {
      Alert.alert(
        "Campos obrigatórios",
        "Informe nome, bairro, cidade e os horários de funcionamento.",
      );
      return;
    }
    if (step === 3 && !formData.coverImageUri) {
      Alert.alert(
        "Foto Obrigatória",
        "A foto de capa da cafeteria é obrigatória.",
      );
      return;
    }

    setStep((prev) => (prev + 1) as any);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep((prev) => (prev - 1) as any);
    else router.back();
  };

  const pickImage = async (isCover: boolean) => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permissão negada", "Precisamos de acesso às suas fotos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
      aspect: isCover ? [16, 9] : [1, 1],
    });

    if (!result.canceled && result.assets[0].uri) {
      const selectedUri = result.assets[0].uri;
      if (isCover) {
        updateField("coverImageUri", selectedUri);
      } else {
        if (formData.highlightsUris.length >= 3) {
          Alert.alert("Limite atingido", "Máximo de 3 fotos nos destaques.");
          return;
        }
        updateField("highlightsUris", [
          ...formData.highlightsUris,
          selectedUri,
        ]);
      }
    }
  };

  const removeHighlight = (index: number) => {
    const updated = formData.highlightsUris.filter((_, i) => i !== index);
    updateField("highlightsUris", updated);
  };

  const handleSubmitFinal = async () => {
    try {
      setLoading(true);

      await ownerService.registerOwnerAndShop({
        user: {
          name: formData.userName,
          email: formData.email,
          password: formData.password,
          city: formData.city,
          role: "OWNER",
        },
        shop: {
          name: formData.shopName,
          shortDescription: formData.shortDescription,
          address: formData.address,
          district: formData.district,
          city: formData.city,
          openingTime: formData.openingTime,
          closingTime: formData.closingTime,
          hasWifi: formData.hasWifi,
          hasPowerOutlets: formData.hasPowerOutlets,
          coverImageUrl: formData.coverImageUri,
        },
        highlights: formData.highlightsUris,
      });

      Alert.alert("Sucesso!", "Sua cafeteria foi cadastrada com sucesso.", [
        {
          text: "Acessar Painel",
          onPress: () => router.replace("/owner/dashboard"),
        },
      ]);
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        "Ocorreu um erro ao realizar o cadastro.";
      Alert.alert("Erro no Cadastro", msg);
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
          <TouchableOpacity onPress={handlePrevStep} style={styles.backButton}>
            <ArrowLeft color={COLORS.white} size={24} />
          </TouchableOpacity>
          <Text style={styles.stepIndicator}>Passo {step} de 4</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {step === 1 && (
            <View>
              <Text style={styles.title}>Criar Conta do Proprietário</Text>
              <Text style={styles.subtitle}>
                Estes dados serão usados para acessar o seu painel de gestão.
              </Text>

              <Text style={styles.label}>Seu Nome Completo *</Text>
              <View style={styles.inputContainer}>
                <User
                  color={COLORS.cream}
                  size={20}
                  style={{ marginRight: 12 }}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Marcos Santos"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={formData.userName}
                  onChangeText={(txt) => updateField("userName", txt)}
                />
              </View>

              <Text style={styles.label}>E-mail Comercial *</Text>
              <View style={styles.inputContainer}>
                <Mail
                  color={COLORS.cream}
                  size={20}
                  style={{ marginRight: 12 }}
                />
                <TextInput
                  style={styles.input}
                  placeholder="dono@cafeteria.com"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(txt) => updateField("email", txt)}
                />
              </View>

              <Text style={styles.label}>Senha de Acesso *</Text>
              <View style={styles.inputContainer}>
                <Lock
                  color={COLORS.cream}
                  size={20}
                  style={{ marginRight: 12 }}
                />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  secureTextEntry
                  value={formData.password}
                  onChangeText={(txt) => updateField("password", txt)}
                />
              </View>
            </View>
          )}

          {step === 2 && (
            <View>
              <Text style={styles.title}>Sobre a Cafeteria</Text>
              <Text style={styles.subtitle}>
                Insira as informações básicas do seu estabelecimento.
              </Text>

              <Text style={styles.label}>Nome do Estabelecimento *</Text>
              <View style={styles.inputContainer}>
                <Store
                  color={COLORS.cream}
                  size={20}
                  style={{ marginRight: 12 }}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Beanio Specialty Coffee"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={formData.shopName}
                  onChangeText={(txt) => updateField("shopName", txt)}
                />
              </View>

              <Text style={styles.label}>Descrição Curta</Text>
              <View style={styles.textAreaContainer}>
                <TextInput
                  style={styles.textArea}
                  placeholder="Um espaço aconchegante focado em cafés especiais..."
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  multiline
                  value={formData.shortDescription}
                  onChangeText={(txt) => updateField("shortDescription", txt)}
                />
              </View>

              <View style={styles.row}>
                <View style={styles.col}>
                  <Text style={styles.label}>Bairro *</Text>
                  <View style={styles.inputContainer}>
                    <MapPin
                      color={COLORS.cream}
                      size={18}
                      style={{ marginRight: 8 }}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Centro"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      value={formData.district}
                      onChangeText={(txt) => updateField("district", txt)}
                    />
                  </View>
                </View>
                <View style={styles.col}>
                  <Text style={styles.label}>Cidade *</Text>
                  <View style={styles.inputContainer}>
                    <MapPin
                      color={COLORS.cream}
                      size={18}
                      style={{ marginRight: 8 }}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Camaçari"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      value={formData.city}
                      onChangeText={(txt) => updateField("city", txt)}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.col}>
                  <Text style={styles.label}>Abertura *</Text>
                  <View style={styles.inputContainer}>
                    <Clock
                      color={COLORS.cream}
                      size={18}
                      style={{ marginRight: 8 }}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="08:00"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      value={formData.openingTime}
                      onChangeText={(txt) => updateField("openingTime", txt)}
                    />
                  </View>
                </View>
                <View style={styles.col}>
                  <Text style={styles.label}>Fechamento *</Text>
                  <View style={styles.inputContainer}>
                    <Clock
                      color={COLORS.cream}
                      size={18}
                      style={{ marginRight: 8 }}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="20:00"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      value={formData.closingTime}
                      onChangeText={(txt) => updateField("closingTime", txt)}
                    />
                  </View>
                </View>
              </View>

              <Text style={styles.label}>Endereço Completo</Text>
              <View style={styles.inputContainer}>
                <FileText
                  color={COLORS.cream}
                  size={20}
                  style={{ marginRight: 12 }}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Rua Exemplo, nº 123"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={formData.address}
                  onChangeText={(txt) => updateField("address", txt)}
                />
              </View>

              <Text style={styles.sectionTitle}>Comodidades</Text>

              <View style={styles.switchRow}>
                <Text style={styles.switchText}>
                  Oferece Wi-Fi de alta velocidade?
                </Text>
                <Switch
                  value={formData.hasWifi}
                  onValueChange={(val) => updateField("hasWifi", val)}
                  trackColor={{ false: "#555", true: COLORS.mediumBrown }}
                  thumbColor={COLORS.cream}
                />
              </View>

              <View style={styles.switchRow}>
                <Text style={styles.switchText}>
                  Possui tomadas acessíveis nas mesas?
                </Text>
                <Switch
                  value={formData.hasPowerOutlets}
                  onValueChange={(val) => updateField("hasPowerOutlets", val)}
                  trackColor={{ false: "#555", true: COLORS.mediumBrown }}
                  thumbColor={COLORS.cream}
                />
              </View>
            </View>
          )}

          {step === 3 && (
            <View>
              <Text style={styles.title}>Foto de Capa</Text>
              <Text style={styles.subtitle}>
                Esta imagem será o cartão de visitas da sua cafeteria no
                aplicativo.
              </Text>

              {formData.coverImageUri ? (
                <View style={{ alignItems: "center" }}>
                  <Image
                    source={{ uri: formData.coverImageUri }}
                    style={styles.coverImage}
                  />
                  <TouchableOpacity
                    onPress={() => pickImage(true)}
                    style={{
                      backgroundColor: "rgba(255,255,255,0.1)",
                      padding: 12,
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ color: COLORS.cream, fontWeight: "600" }}>
                      Trocar Imagem
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => pickImage(true)}
                  style={styles.coverPlaceholder}
                >
                  <Camera size={36} color={COLORS.cream} />
                  <Text
                    style={{
                      color: COLORS.cream,
                      fontWeight: "600",
                      marginTop: 8,
                    }}
                  >
                    Selecionar foto de capa
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {step === 4 && (
            <View>
              <Text style={styles.title}>Fotos dos Destaques</Text>
              <Text style={styles.subtitle}>
                Adicione até 3 fotos dos seus melhores produtos ou bebidas
                (carro-chefe).
              </Text>

              <View style={styles.highlightsGrid}>
                {formData.highlightsUris.map((uri, index) => (
                  <View key={index} style={styles.highlightBox}>
                    <Image
                      source={{ uri }}
                      style={{ width: "100%", height: "100%" }}
                    />
                    <TouchableOpacity
                      onPress={() => removeHighlight(index)}
                      style={styles.removeBadge}
                    >
                      <Trash2 size={16} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                ))}

                {formData.highlightsUris.length < 3 && (
                  <TouchableOpacity
                    onPress={() => pickImage(false)}
                    style={styles.addHighlightButton}
                  >
                    <Plus size={24} color={COLORS.cream} />
                    <Text
                      style={{
                        fontSize: 12,
                        color: COLORS.cream,
                        marginTop: 4,
                      }}
                    >
                      Adicionar
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Ações Inferiores */}
        <View style={styles.footer}>
          {step < 4 ? (
            <TouchableOpacity
              onPress={handleNextStep}
              style={styles.primaryButton}
            >
              <Text style={styles.buttonText}>Próximo Passo</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleSubmitFinal}
              disabled={loading}
              style={styles.submitButton}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.cream} />
              ) : (
                <>
                  <Check
                    size={20}
                    color={COLORS.cream}
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.buttonText}>Concluir Cadastro</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
