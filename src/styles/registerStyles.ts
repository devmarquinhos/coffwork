import { StyleSheet } from "react-native";
import { COLORS } from "./theme";

export const registerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  keyboardView: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  backButton: {
    padding: 8,
  },
  stepIndicator: {
    color: COLORS.cream,
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 40,
  },
  stepContainer: {
    width: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.cream,
    lineHeight: 22,
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: COLORS.white,
    fontSize: 16,
  },
  footer: {
    marginTop: 24,
  },
  primaryButton: {
    backgroundColor: COLORS.mediumBrown,
    flexDirection: "row",
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  primaryButtonText: {
    color: COLORS.cream,
    fontSize: 16,
    fontWeight: "bold",
  },
});