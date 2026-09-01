import { StyleSheet } from "react-native";
import { COLORS } from "@/styles/theme";

export const editProfileStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  keyboardView: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: COLORS.black },
  form: { marginTop: 24 },
  inputGroup: { marginBottom: 20 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.darkBrown,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: COLORS.black },
  footer: { marginBottom: 24 },
  saveButton: {
    backgroundColor: COLORS.mediumBrown,
    flexDirection: "row",
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  saveButtonText: { color: COLORS.cream, fontSize: 16, fontWeight: "bold" },
});
